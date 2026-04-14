import { useMemo, useRef, useState } from 'react'
import { BookOpen, Download, FileUp, Headphones, PencilLine, Plus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Modal from '@/components/common/Modal'
import TextbookForm from '@/components/common/TextbookForm'
import Layout from '@/components/layout/Layout'
import TabBar from '@/components/layout/TabBarApp'
import { Button } from '@/components/ui/button'
import {
  deleteTextbookCascade,
  downloadAppData,
  getTextbookRecordStats,
  getTextbookWordCount,
  importAppData,
} from '@/lib/appData'
import { useLessonStore, useRecordStore, useTextbookStore, useWordStore } from '@/store'
import type { ITextbook } from '@/types'

const HomePageApp = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textbooks = useTextbookStore((state) => state.textbooks)
  const lessons = useLessonStore((state) => state.lessons)
  const words = useWordStore((state) => state.words)
  const records = useRecordStore((state) => state.records)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTextbook, setEditingTextbook] = useState<ITextbook | null>(null)

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      return '上午好'
    }

    if (hour < 18) {
      return '下午好'
    }

    return '晚上好'
  }, [])

  const stats = getTextbookRecordStats('all')

  const sortedTextbooks = useMemo(
    () => [...textbooks].sort((left, right) => right.updatedAt - left.updatedAt),
    [textbooks],
  )

  const getLessonCount = (textbookId: string) =>
    lessons.filter((lesson) => lesson.textbookId === textbookId).length

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const replace = window.confirm('点击“确定”将替换当前全部数据；点击“取消”则把备份追加合并进当前数据。')
      const strategy = replace ? 'replace' : 'merge'
      const data = await importAppData(file, strategy)

      toast.success('备份导入成功', {
        description: `当前共有 ${data.textbooks.length} 本课本、${data.words.length} 条词条。`,
      })
    } catch {
      toast.error('导入失败', {
        description: '请选择格式正确的 JSON 备份文件。',
      })
    } finally {
      event.target.value = ''
    }
  }

  const handleDeleteTextbook = (textbook: ITextbook) => {
    const confirmed = window.confirm(`删除“${textbook.name}”后，关联的课文、词条和听写记录也会一起删除。确定继续吗？`)

    if (!confirmed) {
      return
    }

    deleteTextbookCascade(textbook.id)
    toast.success('课本已删除')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary/8 via-background to-background">
        <header className="px-6 pb-6 pt-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">宁听</h1>
              <p className="mt-1 text-sm text-text-secondary">{greeting}，今天也来练一练听写。</p>
            </div>
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/30">
                <span className="text-xl font-semibold text-white">宁</span>
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                <Headphones size={12} className="text-primary" />
              </div>
            </div>
          </div>
        </header>

        <section className="-mt-2 px-6">
          <div className="rounded-2xl bg-white/90 p-5 shadow-xl shadow-primary/10 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-3">
              <div className="relative py-2 text-center">
                <div className="absolute inset-0 rounded-xl bg-primary/5" />
                <p className="relative text-2xl font-bold text-primary">{stats.todayCount}</p>
                <p className="relative mt-1 text-xs text-text-secondary">今日听写</p>
              </div>
              <div className="relative py-2 text-center">
                <div className="absolute inset-0 rounded-xl bg-success/5" />
                <div className="absolute left-0 top-2 bottom-2 w-px bg-border-color" />
                <div className="absolute right-0 top-2 bottom-2 w-px bg-border-color" />
                <p className="relative text-2xl font-bold text-success">
                  {stats.todayAccuracy > 0 ? `${stats.todayAccuracy}%` : '--'}
                </p>
                <p className="relative mt-1 text-xs text-text-secondary">今日正确率</p>
              </div>
              <div className="relative py-2 text-center">
                <div className="absolute inset-0 rounded-xl bg-info/5" />
                <p className="relative text-2xl font-bold text-info">{words.length}</p>
                <p className="relative mt-1 text-xs text-text-secondary">累计词条</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 px-6 pb-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">我的课本</h2>
            <p className="text-sm text-text-secondary">管理课本、导入备份、继续练习。</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleImportClick} className="text-text-secondary hover:text-primary">
              <FileUp size={15} />
              导入
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                downloadAppData()
                toast.success('备份文件已开始下载')
              }}
              className="text-text-secondary hover:text-primary"
            >
              <Download size={15} />
              导出
            </Button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

        <div className="space-y-3">
          {sortedTextbooks.map((textbook) => (
            <div
              key={textbook.id}
              className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex items-start gap-4">
                <button
                  onClick={() => navigate(`/textbook/${textbook.id}`)}
                  className="flex flex-1 items-center gap-4 text-left"
                >
                  <div
                    className="flex h-16 w-14 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: `${textbook.coverColor}18` }}
                  >
                    <BookOpen size={28} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-text-primary">{textbook.name}</h3>
                    <p className="mt-1.5 text-sm text-text-secondary">
                      {getLessonCount(textbook.id)} 课文 · {getTextbookWordCount(textbook.id)} 词条
                    </p>
                    <p className="mt-1 text-xs text-text-hint">
                      最近听写 {records.filter((record) => record.textbookId === textbook.id).length} 次
                    </p>
                  </div>
                </button>

                <div className="flex shrink-0 flex-col gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingTextbook(textbook)}
                    className="h-8 px-3 text-xs shadow-sm"
                  >
                    <PencilLine size={12} />
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs text-text-hint hover:text-danger hover:bg-danger/5"
                    onClick={() => handleDeleteTextbook(textbook)}
                  >
                    <Trash2 size={12} />
                    删除
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedTextbooks.length === 0 && (
          <div className="rounded-2xl bg-white/80 py-16 text-center shadow-lg backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 shadow-inner">
              <BookOpen size={36} className="text-primary" />
            </div>
            <p className="text-base font-medium text-text-secondary">还没有课本</p>
            <p className="mt-1 text-sm text-text-hint">先创建一本课本，或者导入已有备份。</p>
          </div>
        )}
      </section>

      <div className="fixed bottom-20 left-6 right-6">
        <Button
          size="lg"
          className="w-full rounded-2xl shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          添加新课本
        </Button>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="添加课本">
        <TextbookForm onSuccess={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={Boolean(editingTextbook)}
        onClose={() => setEditingTextbook(null)}
        title="编辑课本"
      >
        {editingTextbook ? <TextbookForm textbook={editingTextbook} onSuccess={() => setEditingTextbook(null)} /> : null}
      </Modal>

      <TabBar />
    </Layout>
  )
}

export default HomePageApp
