import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Headphones, Pause, Play, SkipBack, SkipForward, Volume2, X, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { useLessonStore, useSettingsStore, useWordStore } from '@/store'
import type { IWordItem, IWordType } from '@/types'

interface DictationRouteState {
  randomOrder?: boolean
  startTime?: number
  itemIds?: string[]
}

interface FreeWord {
  id: string
  type: IWordType
  content: string
  pronunciation?: string
  hint?: string
}

const EXAMPLE_TEXT = `天空
apple
美丽
rainbow
秋天`

function parseFreeInput(text: string): FreeWord[] {
  const lines = text.split('\n').filter((line) => line.trim())
  return lines.map((line, index) => {
    const trimmed = line.trim()
    if (/^[a-zA-Z\s]+$/.test(trimmed)) {
      return {
        id: `free-${Date.now()}-${index}`,
        type: 'english' as IWordType,
        content: trimmed,
      }
    }
    if (/^[\u4e00-\u9fa5]{1,4}$/.test(trimmed)) {
      return {
        id: `free-${Date.now()}-${index}`,
        type: 'hanzi' as IWordType,
        content: trimmed,
      }
    }
    return {
      id: `free-${Date.now()}-${index}`,
      type: 'ciyu' as IWordType,
      content: trimmed,
    }
  })
}

function shuffleIds(ids: string[]) {
  const cloned = [...ids]
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(Math.random() * (index + 1))
    ;[cloned[index], cloned[nextIndex]] = [cloned[nextIndex], cloned[index]]
  }
  return cloned
}

const DictationPageApp = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const routeState = (window.history.state?.usr ?? {}) as DictationRouteState
  const lessons = useLessonStore((state) => state.lessons)
  const words = useWordStore((state) => state.words)
  const settings = useSettingsStore((state) => state.settings)

  const lesson = useMemo(
    () => lessons.find((l) => l.id === id),
    [lessons, id],
  )

  const [mode] = useState<'free' | 'lesson'>(() => {
    return id && id !== 'free' ? 'lesson' : 'free'
  })
  const [freeInput, setFreeInput] = useState('')
  const [freeWords, setFreeWords] = useState<FreeWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speechRate, setSpeechRate] = useState(settings.defaultSpeechRate)
  const [repeatTimes, setRepeatTimes] = useState(settings.defaultRepeatTimes)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speechError, setSpeechError] = useState('')
  const [sessionStartTime] = useState(() => Date.now())
  const runIdRef = useRef(0)
  const repeatTimerRef = useRef<number | null>(null)

  const lessonWords = useMemo(() => {
    if (!id || id === 'free') return []
    const lessonWordList = words.filter((w) => w.lessonId === id)
    const ids = lessonWordList.map((word) => word.id)
    return routeState.randomOrder ? shuffleIds(ids) : ids
  }, [id, routeState.randomOrder, words])

  const lessonWordItems = useMemo(
    () =>
      lessonWords
        .map((wordId) => words.find((w) => w.id === wordId))
        .filter((word): word is IWordItem => Boolean(word)),
    [lessonWords, words],
  )

  const currentWord = mode === 'free' ? freeWords[currentIndex] : lessonWordItems[currentIndex]
  const totalWords = mode === 'free' ? freeWords.length : lessonWordItems.length
  const progress = totalWords > 0 ? ((currentIndex + 1) / totalWords) * 100 : 0

  const clearRepeatTimer = () => {
    if (repeatTimerRef.current !== null) {
      window.clearTimeout(repeatTimerRef.current)
      repeatTimerRef.current = null
    }
  }

  const stopPlayback = useCallback((keepPausedState = false) => {
    runIdRef.current += 1
    clearRepeatTimer()
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsPlaying(false)
    if (!keepPausedState) {
      setIsPaused(false)
    }
  }, [])

  const speakWord = useCallback(
    (word: FreeWord | IWordItem | undefined) => {
      if (!word) return

      if (!('speechSynthesis' in window)) {
        const message = '当前浏览器不支持语音朗读，请使用 Chrome、Edge 或 Safari。'
        setSpeechError(message)
        toast.error('无法开始朗读', { description: message })
        return
      }

      const synth = window.speechSynthesis
      const runId = runIdRef.current + 1
      runIdRef.current = runId
      clearRepeatTimer()
      synth.cancel()

      let completedTimes = 0
      setSpeechError('')
      setIsPlaying(true)
      setIsPaused(false)

      const speakOnce = () => {
        if (runIdRef.current !== runId) return

        const utterance = new SpeechSynthesisUtterance(word.content)
        utterance.rate = speechRate
        utterance.lang = word.type === 'english' ? 'en-US' : 'zh-CN'

        utterance.onend = () => {
          if (runIdRef.current !== runId) return
          completedTimes += 1
          if (completedTimes < repeatTimes) {
            repeatTimerRef.current = window.setTimeout(speakOnce, 2000)
            return
          }
          setIsPlaying(false)
        }

        utterance.onerror = () => {
          if (runIdRef.current !== runId) return
          setIsPlaying(false)
          setSpeechError('语音播放失败，请重试或切换浏览器。')
          toast.error('语音播放失败')
        }

        synth.speak(utterance)
      }

      speakOnce()
    },
    [repeatTimes, speechRate],
  )

  useEffect(() => {
    if (!currentWord) return
    const timer = window.setTimeout(() => {
      speakWord(currentWord)
    }, 300)
    return () => {
      window.clearTimeout(timer)
      stopPlayback()
    }
  }, [currentIndex, currentWord, speakWord, stopPlayback])

  useEffect(() => {
    return () => {
      stopPlayback()
    }
  }, [stopPlayback])

  const goPrev = () => {
    stopPlayback()
    setCurrentIndex((index) => Math.max(index - 1, 0))
  }

  const goNext = () => {
    stopPlayback()
    setCurrentIndex((index) => Math.min(index + 1, totalWords - 1))
  }

  const pausePlayback = () => {
    stopPlayback(true)
    setIsPaused(true)
  }

  const startFreeDictation = () => {
    const parsed = parseFreeInput(freeInput)
    if (parsed.length === 0) {
      toast.error('请输入要听写的内容')
      return
    }
    setFreeWords(parsed)
    setCurrentIndex(0)
    toast.success(`已添加 ${parsed.length} 个词条`)
  }

  const finishDictation = () => {
    stopPlayback()
    if (mode === 'free') {
      setFreeWords([])
      setCurrentIndex(0)
    } else {
      navigate(`/grading/${id}`, {
        state: {
          session: {
            textbookId: lesson?.textbookId ?? '',
            lessonId: id,
            itemIds: lessonWordItems.map((word) => word.id),
            startTime: sessionStartTime,
            randomOrder: Boolean(routeState.randomOrder),
          },
        },
      })
    }
  }

  if (mode === 'free' && freeWords.length === 0) {
    return (
      <Layout>
        <header className="flex items-center justify-between px-4 py-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-text-secondary">
            <X size={18} />
            返回
          </button>
          <span className="text-sm font-medium text-text-primary">自由听写</span>
          <span className="w-12" />
        </header>
        <main className="flex flex-1 flex-col px-6 pb-8">
          <div className="mb-4 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <Headphones size={16} />
            输入内容，系统自动识别类型并朗读
          </div>
          <textarea
            value={freeInput}
            onChange={(e) => setFreeInput(e.target.value)}
            placeholder={'输入要听写的内容（每行一个）'}
            className="min-h-[280px] rounded-card-lg bg-white p-4 text-base text-text-primary placeholder:text-text-hint shadow-card focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            autoFocus
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setFreeInput(EXAMPLE_TEXT)}
              className="flex-1 rounded-full bg-primary/10 py-2.5 text-sm font-medium text-primary"
            >
              使用示例
            </button>
            <button
              type="button"
              onClick={() => setFreeInput('')}
              disabled={!freeInput}
              className="flex items-center gap-1.5 rounded-full bg-danger/10 px-4 py-2.5 text-sm font-medium text-danger disabled:opacity-40"
            >
              <Trash2 size={14} />
              清空
            </button>
          </div>
          <Button className="mt-4 w-full" size="lg" onClick={startFreeDictation} disabled={!freeInput.trim()}>
            <Play size={18} />
            开始听写
          </Button>
        </main>
      </Layout>
    )
  }

  if (totalWords === 0) {
    return (
      <Layout>
        <div className="px-6 py-12 text-center">
          <p className="text-text-secondary">当前课文还没有可听写的词条。</p>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            返回
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <header className="flex items-center justify-between px-4 py-4">
        <button onClick={finishDictation} className="flex items-center gap-1 text-text-secondary">
          <X size={18} />
          结束
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">{mode === 'free' ? '自由听写' : lesson?.name}</p>
          <p className="text-xs text-text-secondary">
            第 {currentIndex + 1} / {totalWords} 个
          </p>
        </div>
        <span className="text-xs text-text-secondary">{routeState.randomOrder ? '随机' : '顺序'}</span>
      </header>

      <main className="flex flex-1 flex-col px-6 pb-8">
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-white shadow-card">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <section className="rounded-card-lg bg-white p-8 shadow-card">
          <div className="text-center">
            <p className="text-sm text-text-secondary">{isPlaying ? '正在朗读' : isPaused ? '已暂停' : '准备朗读'}</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-wide text-text-primary">{currentWord.content}</h1>
            {currentWord.hint ? <p className="mt-4 text-sm text-text-secondary">提示：{currentWord.hint}</p> : null}
            {currentWord.pronunciation ? (
              <p className="mt-2 text-xs uppercase tracking-wide text-text-hint">{currentWord.pronunciation}</p>
            ) : null}
            {speechError ? <p className="mt-3 text-sm text-danger">{speechError}</p> : null}
          </div>
        </section>

        <section className="mt-5 rounded-card bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">语速</span>
            <span className="text-sm text-text-secondary">{speechRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={speechRate}
            onChange={(event) => setSpeechRate(Number(event.target.value))}
            className="mt-3 w-full accent-primary"
          />

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">重复次数</span>
            <span className="text-sm text-text-secondary">{repeatTimes} 次</span>
          </div>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setRepeatTimes(count as 1 | 2 | 3)}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                  repeatTimes === count ? 'bg-primary text-white' : 'bg-background text-text-primary'
                }`}
              >
                {count} 次
              </button>
            ))}
          </div>
        </section>

        <section className="mt-5 grid grid-cols-3 gap-3">
          <Button variant="secondary" size="lg" onClick={goPrev} disabled={currentIndex === 0}>
            <SkipBack size={18} />
            上一个
          </Button>

          {isPlaying ? (
            <Button size="lg" onClick={pausePlayback}>
              <Pause size={18} />
              暂停
            </Button>
          ) : (
            <Button size="lg" onClick={() => speakWord(currentWord)}>
              {isPaused ? <Play size={18} /> : <Volume2 size={18} />}
              {isPaused ? '继续' : '朗读'}
            </Button>
          )}

          <Button variant="secondary" size="lg" onClick={goNext} disabled={currentIndex === totalWords - 1}>
            <SkipForward size={18} />
            下一个
          </Button>
        </section>

        <Button className="mt-5" variant="ghost" onClick={finishDictation}>
          {mode === 'free' ? '结束并返回' : '结束听写并进入批改'}
        </Button>
      </main>
    </Layout>
  )
}

export default DictationPageApp
