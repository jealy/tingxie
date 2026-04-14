import { useMemo, useState } from 'react'
import { ChevronLeft, Feather, FileText, Languages, PencilLine, Play, Plus, Trash2, Type } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import BatchWordForm from '@/components/common/BatchWordForm'
import Modal from '@/components/common/Modal'
import WordFormV2 from '@/components/common/WordFormV2'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { useLessonStore, useTextbookStore, useWordStore } from '@/store'
import type { IWordItem, IWordType } from '@/types'

const typeConfig: Record<IWordType, { label: string; icon: typeof Type; badge: string }> = {
  hanzi: { label: '汉字', icon: Type, badge: 'bg-orange-50 text-orange-600' },
  ciyu: { label: '词语', icon: FileText, badge: 'bg-green-50 text-green-600' },
  english: { label: '英语', icon: Languages, badge: 'bg-blue-50 text-blue-600' },
  poetry: { label: '古诗', icon: Feather, badge: 'bg-amber-50 text-amber-700' },
}

const LessonPageApp = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const lesson = useLessonStore((state) => state.getLessonById(id))
  const textbook = useTextbookStore((state) => {
    const lessonData = useLessonStore.getState().getLessonById(id)
    return lessonData ? state.getTextbookById(lessonData.textbookId) : undefined
  })
  const words = useWordStore((state) => state.getWordsByLessonId(id))
  const deleteWord = useWordStore((state) => state.deleteWord)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [editingWord, setEditingWord] = useState<IWordItem | null>(null)

  const sortedWords = useMemo(
    () => [...words].sort((left, right) => left.order - right.order),
    [words],
  )

  if (!lesson) {
    return (
      <Layout>
        <div className="px-6 py-12 text-center">
          <p className="text-text-secondary">没有找到对应的课文。</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </Layout>
    )
  }

  const handleDeleteWord = (word: IWordItem) => {
    const confirmed = window.confirm(`确定删除词条“${word.content}”吗？`)
    if (!confirmed) {
      return
    }

    deleteWord(word.id)
    toast.success('词条已删除')
  }

  const renderWordMeta = (word: IWordItem) => {
    if (word.type === 'english') {
      return (
        <div className="space-y-1 text-sm text-text-secondary">
          {word.pronunciation ? <p>音标：{word.pronunciation}</p> : null}
          {word.hint ? <p>释义：{word.hint}</p> : null}
          {word.extra?.example ? <p>例句：{word.extra.example}</p> : null}
        </div>
      )
    }

    if (word.type === 'poetry') {
      return (
        <div className="space-y-1 text-sm text-text-secondary">
          {word.extra?.author ? <p>作者：{word.extra.author}</p> : null}
          {word.extra?.fullText ? <p className="line-clamp-2">全文：{word.extra.fullText}</p> : null}
        </div>
      )
    }

    return (
      <div className="space-y-1 text-sm text-text-secondary">
        {word.pronunciation ? <p>读音：{word.pronunciation}</p> : null}
        {word.hint ? <p>提示：{word.hint}</p> : null}
      </div>
    )
  }

  return (
    <Layout>
      <header className="flex items-start gap-3 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card"
        >
          <ChevronLeft size={22} className="text-text-primary" />
        </button>

        <div className="flex-1">
          <h1 className="text-xl font-semibold text-text-primary">{lesson.name}</h1>
          <p className="mt-1 text-sm text-text-secondary">{textbook?.name ?? '未找到所属课本'}</p>
        </div>
      </header>

      <section className="px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">词条列表</h2>
            <p className="text-sm text-text-secondary">支持新增、编辑、删除和批量导入。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowBatchModal(true)}>
              批量添加
            </Button>
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              添加词条
            </Button>
            <Button size="sm" onClick={() => navigate(`/dictation/${lesson.id}`)} disabled={sortedWords.length === 0}>
              <Play size={16} />
              开始听写
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedWords.map((word, index) => {
            const currentType = typeConfig[word.type]
            const TypeIcon = currentType.icon

            return (
              <div key={word.id} className="rounded-card bg-white p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-sm text-text-hint">{index + 1}.</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-medium text-text-primary">{word.content}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${currentType.badge}`}>
                        <TypeIcon size={12} />
                        {currentType.label}
                      </span>
                    </div>
                    <div className="mt-2">{renderWordMeta(word)}</div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditingWord(word)}>
                      <PencilLine size={14} />
                      编辑
                    </Button>
                    <Button variant="ghost" size="sm" className="text-danger hover:text-danger" onClick={() => handleDeleteWord(word)}>
                      <Trash2 size={14} />
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {sortedWords.length === 0 && (
          <div className="rounded-card bg-white py-16 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FileText size={36} className="text-primary" />
            </div>
            <p className="text-text-secondary">还没有词条</p>
            <p className="mt-1 text-sm text-text-hint">先添加词条，再开始听写练习。</p>
          </div>
        )}
      </section>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="添加词条">
        <WordFormV2 lessonId={lesson.id} onSuccess={() => setShowCreateModal(false)} />
      </Modal>

      <Modal isOpen={showBatchModal} onClose={() => setShowBatchModal(false)} title="批量添加词条">
        <BatchWordForm lessonId={lesson.id} onSuccess={() => setShowBatchModal(false)} />
      </Modal>

      <Modal isOpen={Boolean(editingWord)} onClose={() => setEditingWord(null)} title="编辑词条">
        {editingWord ? <WordFormV2 lessonId={lesson.id} word={editingWord} onSuccess={() => setEditingWord(null)} /> : null}
      </Modal>
    </Layout>
  )
}

export default LessonPageApp
