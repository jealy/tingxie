import { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Check, CheckCircle, RotateCcw, X } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { useLessonStore, useRecordStore, useTextbookStore, useWordStore } from '@/store'
import type { IWordItem } from '@/types'

interface GradingSession {
  textbookId: string
  lessonId: string
  itemIds: string[]
  startTime: number
  randomOrder?: boolean
}

const GradingPageApp = () => {
  const { id = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const addRecord = useRecordStore((state) => state.addRecord)
  const getWordById = useWordStore((state) => state.getWordById)
  const lesson = useLessonStore((state) => state.getLessonById(id))
  const textbook = useTextbookStore((state) => (lesson ? state.getTextbookById(lesson.textbookId) : undefined))
  const session = (location.state as { session?: GradingSession } | null)?.session
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const words = useMemo(
    () =>
      (session?.itemIds ?? [])
        .map((wordId) => getWordById(wordId))
        .filter((word): word is IWordItem => Boolean(word)),
    [getWordById, session?.itemIds],
  )

  const correctCount = words.filter((word) => results[word.id] === true).length
  const accuracy = words.length > 0 ? Math.round((correctCount / words.length) * 100) : 0

  useEffect(
    () => () => {
      const stream = videoRef.current?.srcObject as MediaStream | null
      stream?.getTracks().forEach((track) => track.stop())
    },
    [],
  )

  if (!session || !lesson) {
    return (
      <Layout>
        <div className="px-6 py-12 text-center">
          <p className="text-text-secondary">缺少本次听写会话信息，请重新开始。</p>
          <Button className="mt-4" onClick={() => navigate('/dictation')}>
            返回听写入口
          </Button>
        </div>
      </Layout>
    )
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach((track) => track.stop())
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const takePhoto = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('当前设备不支持摄像头调用')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch {
      toast.error('无法访问摄像头，请检查权限设置')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')

    context?.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error('拍照失败，请重试')
          return
        }

        if (photoUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(photoUrl)
        }

        setPhotoUrl(URL.createObjectURL(blob))
        stopCamera()
        setShowCamera(false)
      },
      'image/jpeg',
      0.72,
    )
  }

  const finishGrading = () => {
    if (Object.keys(results).length < words.length) {
      const confirmed = window.confirm('还有词条没有标记对错。点击“确定”继续保存，未标记项会按错误处理。')
      if (!confirmed) {
        return
      }
    }

    const normalizedResults = Object.fromEntries(words.map((word) => [word.id, results[word.id] ?? false]))

    addRecord({
      textbookId: session.textbookId,
      lessonId: session.lessonId,
      startTime: session.startTime,
      endTime: Date.now(),
      itemIds: words.map((word) => word.id),
      results: normalizedResults,
      photoUrl: photoUrl ?? undefined,
    })

    toast.success('批改结果已保存')
    navigate('/settings')
  }

  return (
    <Layout>
      <header className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card"
        >
          <X size={20} className="text-text-primary" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-text-primary">批改</h1>
          <p className="text-sm text-text-secondary">
            {textbook?.name ?? '未找到课本'} · {lesson.name}
          </p>
        </div>
      </header>

      <main className="space-y-5 px-6 pb-28">
        <section className="rounded-card bg-white p-4 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium text-text-primary">拍照对照</h2>
            {photoUrl ? (
              <Button variant="secondary" size="sm" onClick={() => setPhotoUrl(null)}>
                <RotateCcw size={14} />
                重拍
              </Button>
            ) : null}
          </div>

          {photoUrl ? (
            <img src={photoUrl} alt="听写照片" className="w-full rounded-xl object-cover" />
          ) : showCamera ? (
            <div>
              <div className="overflow-hidden rounded-xl bg-black">
                <video ref={videoRef} autoPlay playsInline className="w-full" />
              </div>
              <p className="mt-2 text-center text-sm text-text-secondary">请将听写本放进取景区域后再拍照。</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    stopCamera()
                    setShowCamera(false)
                  }}
                >
                  取消
                </Button>
                <Button onClick={capturePhoto}>拍照</Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={takePhoto}
              className="w-full rounded-xl border-2 border-dashed border-border-color px-4 py-12 text-center"
            >
              <Camera size={32} className="mx-auto text-text-hint" />
              <p className="mt-3 text-text-secondary">点击拍照</p>
              <p className="mt-1 text-xs text-text-hint">照片只保存在当前设备中，不会上传。</p>
            </button>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </section>

        <section className="rounded-card bg-white p-4 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-text-primary">批改列表</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setResults(Object.fromEntries(words.map((word) => [word.id, true])))}
            >
              <CheckCircle size={14} />
              一键全对
            </Button>
          </div>

          <div className="space-y-3">
            {words.map((word, index) => (
              <div key={word.id} className="rounded-xl bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-text-hint">{index + 1}.</p>
                    <p className="font-medium text-text-primary">{word.content}</p>
                    {word.pronunciation ? <p className="mt-1 text-sm text-text-secondary">{word.pronunciation}</p> : null}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setResults((current) => ({ ...current, [word.id]: true }))}
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                        results[word.id] === true ? 'bg-success text-white' : 'bg-success/10 text-success'
                      }`}
                    >
                      <Check size={20} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setResults((current) => ({ ...current, [word.id]: false }))}
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                        results[word.id] === false ? 'bg-danger text-white' : 'bg-danger/10 text-danger'
                      }`}
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-border-color bg-background p-6">
        <div className="mb-3 text-center">
          <p className="text-lg text-text-primary">
            正确率：
            <span className={accuracy >= 80 ? 'text-success' : accuracy >= 50 ? 'text-primary' : 'text-danger'}>
              {accuracy}%
            </span>
            （{correctCount}/{words.length}）
          </p>
        </div>
        <Button className="w-full" size="lg" onClick={finishGrading}>
          <CheckCircle size={18} />
          完成批改
        </Button>
      </footer>
    </Layout>
  )
}

export default GradingPageApp
