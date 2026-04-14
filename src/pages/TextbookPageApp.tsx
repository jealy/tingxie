import { useMemo, useState } from 'react'
import { BookOpen, ChevronLeft, PencilLine, Plus, Trash2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import LessonFormV2 from '@/components/common/LessonFormV2'
import Modal from '@/components/common/Modal'
import TextbookForm from '@/components/common/TextbookForm'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { deleteLessonCascade, deleteTextbookCascade, getLessonWordCount } from '@/lib/appData'
import { useLessonStore, useTextbookStore } from '@/store'
import type { ILesson } from '@/types'

const termLabelMap = {
  1: '上册',
  2: '下册',
} as const

const TextbookPageApp = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const textbook = useTextbookStore((state) => state.getTextbookById(id))
  const lessons = useLessonStore((state) => state.getLessonsByTextbookId(id))
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null)
  const [showEditTextbook, setShowEditTextbook] = useState(false)

  const sortedLessons = useMemo(
    () => [...lessons].sort((left, right) => left.order - right.order),
    [lessons],
  )

  if (!textbook) {
    return (
      <Layout>
        <div className="px-6 py-12 text-center">
          <p className="text-text-secondary">没有找到对应的课本。</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </Layout>
    )
  }

  const handleDeleteLesson = (lesson: ILesson) => {
    const confirmed = window.confirm(`删除“${lesson.name}”后，关联词条和听写记录也会一起删除。确定继续吗？`)
    if (!confirmed) {
      return
    }

    deleteLessonCascade(lesson.id)
    toast.success('课文已删除')
  }

  const handleDeleteTextbook = () => {
    const confirmed = window.confirm(`删除“${textbook.name}”后，所有关联内容都会被清除。确定继续吗？`)
    if (!confirmed) {
      return
    }

    deleteTextbookCascade(textbook.id)
    toast.success('课本已删除')
    navigate('/')
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
          <h1 className="text-xl font-semibold text-text-primary">{textbook.name}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {textbook.grade} 年级 · {termLabelMap[textbook.term]}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowEditTextbook(true)}>
            <PencilLine size={14} />
            编辑
          </Button>
          <Button variant="ghost" size="sm" className="text-danger hover:text-danger" onClick={handleDeleteTextbook}>
            <Trash2 size={14} />
            删除
          </Button>
        </div>
      </header>

      <section className="px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">课文列表</h2>
            <p className="text-sm text-text-secondary">在这里管理当前课本下的所有课文。</p>
          </div>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            添加课文
          </Button>
        </div>

        <div className="space-y-3">
          {sortedLessons.map((lesson) => (
            <div key={lesson.id} className="rounded-card bg-white p-4 shadow-card">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(`/lesson/${lesson.id}`)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <BookOpen size={22} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text-primary">{lesson.name}</p>
                    <p className="mt-1 text-sm text-text-secondary">{getLessonWordCount(lesson.id)} 条词条</p>
                  </div>
                </button>

                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => setEditingLesson(lesson)}>
                    编辑
                  </Button>
                  <Button variant="ghost" size="sm" className="text-danger hover:text-danger" onClick={() => handleDeleteLesson(lesson)}>
                    删除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedLessons.length === 0 && (
          <div className="rounded-card bg-white py-16 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <BookOpen size={36} className="text-primary" />
            </div>
            <p className="text-text-secondary">还没有课文</p>
            <p className="mt-1 text-sm text-text-hint">点击右上角按钮，先把课文加进来。</p>
          </div>
        )}
      </section>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="添加课文">
        <LessonFormV2 textbookId={textbook.id} onSuccess={() => setShowCreateModal(false)} />
      </Modal>

      <Modal isOpen={Boolean(editingLesson)} onClose={() => setEditingLesson(null)} title="编辑课文">
        {editingLesson ? (
          <LessonFormV2 textbookId={textbook.id} lesson={editingLesson} onSuccess={() => setEditingLesson(null)} />
        ) : null}
      </Modal>

      <Modal isOpen={showEditTextbook} onClose={() => setShowEditTextbook(false)} title="编辑课本">
        <TextbookForm textbook={textbook} onSuccess={() => setShowEditTextbook(false)} />
      </Modal>
    </Layout>
  )
}

export default TextbookPageApp
