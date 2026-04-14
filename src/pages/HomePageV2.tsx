import { useState } from 'react'
import { BookOpen, ChevronRight, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import AddTextbookFormV2 from '@/components/common/AddTextbookFormV2'
import Modal from '@/components/common/Modal'
import Layout from '@/components/layout/Layout'
import TabBar from '@/components/layout/TabBar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  useLessonStore,
  useRecordStore,
  useSettingsStore,
  useTextbookStore,
  useWordStore,
} from '@/store'

const HomePageV2 = () => {
  const navigate = useNavigate()
  const textbooks = useTextbookStore((state) => state.textbooks)
  const lessons = useLessonStore((state) => state.lessons)
  const words = useWordStore((state) => state.words)
  const records = useRecordStore((state) => state.records)
  const settings = useSettingsStore((state) => state.settings)
  const [showAddModal, setShowAddModal] = useState(false)

  const today = new Date().toDateString()
  const greeting = new Date().getHours() < 12 ? '上午好' : new Date().getHours() < 18 ? '下午好' : '晚上好'
  const todayRecords = records.filter((record) => new Date(record.endTime).toDateString() === today)
  const todayDictationCount = todayRecords.length
  const todayAccuracy =
    todayRecords.length > 0
      ? Math.round(
          (todayRecords.reduce((sum, record) => {
            const correct = Object.values(record.results).filter(Boolean).length
            const total = Object.values(record.results).length

            return sum + (total > 0 ? correct / total : 0)
          }, 0) /
            todayRecords.length) *
            100,
        )
      : 0

  const getLessonCount = (textbookId: string) =>
    lessons.filter((lesson) => lesson.textbookId === textbookId).length

  const getWordCount = (textbookId: string) => {
    const lessonIds = lessons
      .filter((lesson) => lesson.textbookId === textbookId)
      .map((lesson) => lesson.id)

    return words.filter((word) => lessonIds.includes(word.lessonId)).length
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]

      if (!file) {
        return
      }

      try {
        const text = await file.text()
        const parsed = JSON.parse(text)

        if (!parsed || typeof parsed !== 'object') {
          throw new Error('invalid-backup')
        }

        toast('导入入口已接好', {
          description: `已读取 ${file.name}，下一步可以接入备份校验和数据迁移逻辑。`,
        })
      } catch {
        toast.error('文件格式错误', {
          description: '请选择有效的 JSON 备份文件。',
        })
      }
    }

    input.click()
  }

  const handleExport = () => {
    const data = {
      textbooks,
      lessons,
      words,
      records,
      settings,
      version: '1.0.0',
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const filename = `ning-ting-backup-${new Date().toISOString().slice(0, 10)}.json`
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)

    toast.success('备份文件已开始下载', {
      description: filename,
    })
  }

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <header className="px-6 pb-6 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">宁听</h1>
              <p className="mt-1 text-sm text-text-secondary">{greeting}，小朋友</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-xl font-medium text-white">
              宁
            </div>
          </div>
        </header>

        <section className="-mt-2 px-6">
          <div className="rounded-card-lg bg-white p-5 shadow-card">
            <div className="flex gap-3">
              <div className="flex-1 py-3 text-center">
                <p className="text-2xl font-bold text-primary">{todayDictationCount}</p>
                <p className="mt-1 text-xs text-text-secondary">今日听写</p>
              </div>
              <div className="w-px bg-border-color" />
              <div className="flex-1 py-3 text-center">
                <p className="text-2xl font-bold text-success">
                  {todayAccuracy > 0 ? `${todayAccuracy}%` : '--'}
                </p>
                <p className="mt-1 text-xs text-text-secondary">正确率</p>
              </div>
              <div className="w-px bg-border-color" />
              <div className="flex-1 py-3 text-center">
                <p className="text-2xl font-bold text-info">{words.length}</p>
                <p className="mt-1 text-xs text-text-secondary">已学词数</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-primary">我的课本</h2>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleImport}>
                  导入
                </Button>
              </TooltipTrigger>
              <TooltipContent>读取 JSON 备份文件</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleExport}>
                  导出
                </Button>
              </TooltipTrigger>
              <TooltipContent>导出当前本地学习数据</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-3">
          {textbooks.map((textbook) => (
            <button
              key={textbook.id}
              onClick={() => navigate(`/textbook/${textbook.id}`)}
              className="flex w-full items-center gap-4 rounded-card bg-white p-4 text-left shadow-card transition-transform active:scale-[0.99]"
            >
              <div
                className="flex h-16 w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${textbook.coverColor}15` }}
              >
                <BookOpen size={28} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-text-primary">{textbook.name}</h3>
                <p className="mt-0.5 text-sm text-text-secondary">
                  {getLessonCount(textbook.id)} 课 · {getWordCount(textbook.id)} 词
                </p>
              </div>
              <ChevronRight size={20} className="text-text-hint" />
            </button>
          ))}
        </div>

        {textbooks.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <BookOpen size={36} className="text-primary" />
            </div>
            <p className="text-text-secondary">还没有课本</p>
            <p className="mt-1 text-sm text-text-hint">点击下方按钮先创建一本</p>
          </div>
        )}
      </section>

      <div className="mt-6 px-6">
        <Button size="lg" className="w-full" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          <span>添加新课本</span>
        </Button>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="添加课本">
        <AddTextbookFormV2 onSuccess={() => setShowAddModal(false)} />
      </Modal>

      <TabBar />
    </Layout>
  )
}

export default HomePageV2
