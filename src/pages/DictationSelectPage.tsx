import { useMemo, useState } from 'react'
import { BookOpen, ChevronLeft, FileText, Hash, Headphones, Play, Repeat, Shuffle, Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import TabBar from '@/components/layout/TabBarApp'
import { Button } from '@/components/ui/button'
import { useLessonStore, useSettingsStore, useTextbookStore, useWordStore } from '@/store'

const DictationSelectPage = () => {
  const navigate = useNavigate()
  const textbooks = useTextbookStore((state) => state.textbooks)
  const lessons = useLessonStore((state) => state.lessons)
  const words = useWordStore((state) => state.words)
  const settings = useSettingsStore((state) => state.settings)
  const [selectedTextbookId, setSelectedTextbookId] = useState(textbooks[0]?.id ?? '')
  const [selectedLessonId, setSelectedLessonId] = useState('')
  const [randomOrder, setRandomOrder] = useState(false)

  const effectiveTextbookId = textbooks.some((textbook) => textbook.id === selectedTextbookId)
    ? selectedTextbookId
    : (textbooks[0]?.id ?? '')

  const availableLessons = useMemo(
    () =>
      lessons
        .filter((lesson) => lesson.textbookId === effectiveTextbookId)
        .sort((left, right) => left.order - right.order),
    [effectiveTextbookId, lessons],
  )

  const effectiveLessonId = availableLessons.some((lesson) => lesson.id === selectedLessonId)
    ? selectedLessonId
    : (availableLessons[0]?.id ?? '')
  const selectedLesson = availableLessons.find((lesson) => lesson.id === effectiveLessonId)
  const selectedWordCount = words.filter((word) => word.lessonId === effectiveLessonId).length

  const startDictation = () => {
    if (!effectiveLessonId) return
    navigate(`/dictation/${effectiveLessonId}`, {
      state: { randomOrder, startTime: Date.now() },
    })
  }

  return (
    <Layout>
      <header className="flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-lg transition-all hover:shadow-xl active:scale-95"
        >
          <ChevronLeft size={22} className="text-text-primary" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text-primary">选课听写</h1>
          <p className="text-xs text-text-secondary">选择课本和课文开始练习</p>
        </div>
      </header>

      <main className="space-y-4 px-6 pb-8">
        <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen size={16} className="text-primary" />
            </div>
            <p className="text-sm font-semibold text-text-primary">选择课本</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {textbooks.map((textbook) => (
              <button
                key={textbook.id}
                type="button"
                onClick={() => {
                  setSelectedTextbookId(textbook.id)
                  setSelectedLessonId('')
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  effectiveTextbookId === textbook.id
                    ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/30'
                    : 'bg-background text-text-primary hover:bg-primary/10'
                }`}
              >
                {textbook.name}
              </button>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
              <FileText size={16} className="text-success" />
            </div>
            <p className="text-sm font-semibold text-text-primary">选择课文</p>
          </div>
          <div className="space-y-2">
            {availableLessons.map((lesson, index) => {
              const wordCount = words.filter((word) => word.lessonId === lesson.id).length
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left transition-all duration-200 ${
                    effectiveLessonId === lesson.id
                      ? 'bg-gradient-to-r from-success/90 to-success text-white shadow-lg shadow-success/20'
                      : 'bg-background hover:bg-success/10 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium ${
                      effectiveLessonId === lesson.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white shadow-sm text-text-secondary'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`font-medium ${effectiveLessonId === lesson.id ? 'text-white' : 'text-text-primary'}`}>
                      {lesson.name}
                    </span>
                  </div>
                  <span className={`text-sm ${effectiveLessonId === lesson.id ? 'text-white/90' : 'text-text-hint'}`}>
                    {wordCount}词
                  </span>
                </button>
              )
            })}
          </div>
          {availableLessons.length === 0 && (
            <div className="rounded-xl bg-primary/5 py-8 text-center">
              <p className="text-sm text-text-secondary">当前课本还没有课文</p>
              <p className="mt-1 text-xs text-text-hint">请先在「我的」页面添加课文</p>
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                <Shuffle size={16} className="text-info" />
              </div>
              <span className="text-sm font-medium text-text-primary">随机顺序</span>
            </div>
            <button
              type="button"
              onClick={() => setRandomOrder((v) => !v)}
              className={`h-8 w-14 rounded-full relative transition-all duration-300 ${randomOrder ? 'bg-gradient-to-r from-primary to-primary-light shadow-lg shadow-primary/30' : 'bg-border-color'}`}
            >
              <span
                className={`absolute top-1 block h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${randomOrder ? 'left-7' : 'left-1'}`}
              />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-primary/5 p-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Volume2 size={12} className="text-primary" />
              <span>语速 {settings.defaultSpeechRate.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Repeat size={12} className="text-primary" />
              <span>重复 {settings.defaultRepeatTimes}次</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText size={12} className="text-success" />
              <span>{selectedLesson?.name ?? '未选择'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hash size={12} className="text-info" />
              <span>{selectedWordCount}词</span>
            </div>
          </div>
        </section>

        <section className={`overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 ${selectedLesson ? 'shadow-primary/10' : ''}`}>
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${selectedLesson ? 'bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/30' : 'bg-primary/10'}`}>
            <Headphones size={28} className={selectedLesson ? 'text-white' : 'text-primary'} />
          </div>
          <p className="text-center text-base font-medium text-text-primary">
            {selectedLesson ? `将听写：${selectedLesson.name}` : '请选择课文'}
          </p>
          <p className="mt-1 text-center text-sm text-text-hint">
            {selectedLesson ? `共 ${selectedWordCount} 个词条` : '从上方列表中选择一篇课文'}
          </p>
          <Button
            className={`mt-5 w-full rounded-xl text-base font-medium transition-all duration-300 ${
              selectedLesson && selectedWordCount > 0
                ? 'bg-gradient-to-r from-primary to-primary-light shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                : ''
            }`}
            size="lg"
            onClick={startDictation}
            disabled={!effectiveLessonId || selectedWordCount === 0}
          >
            <Play size={20} className="mr-1" />
            开始听写
          </Button>
        </section>
      </main>

      <TabBar />
    </Layout>
  )
}

export default DictationSelectPage