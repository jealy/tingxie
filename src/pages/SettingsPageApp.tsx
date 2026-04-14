import { useMemo, useState } from 'react'
import { Download, History, Info, Repeat, Trash2, Volume2 } from 'lucide-react'
import { toast } from 'sonner'
import Layout from '@/components/layout/Layout'
import TabBar from '@/components/layout/TabBarApp'
import { Button } from '@/components/ui/button'
import { clearAppData, downloadAppData, resetToSampleData } from '@/lib/appData'
import { useLessonStore, useRecordStore, useSettingsStore, useTextbookStore, useWordStore } from '@/store'

const SettingsPageApp = () => {
  const settings = useSettingsStore((state) => state.settings)
  const updateSettings = useSettingsStore((state) => state.updateSettings)
  const resetSettings = useSettingsStore((state) => state.resetSettings)
  const records = useRecordStore((state) => state.records)
  const deleteRecord = useRecordStore((state) => state.deleteRecord)
  const textbooks = useTextbookStore((state) => state.textbooks)
  const lessons = useLessonStore((state) => state.lessons)
  const words = useWordStore((state) => state.words)
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(records[0]?.id ?? null)

  const sortedRecords = useMemo(
    () => [...records].sort((left, right) => right.endTime - left.endTime),
    [records],
  )

  const textbookMap = useMemo(() => new Map(textbooks.map((textbook) => [textbook.id, textbook])), [textbooks])
  const lessonMap = useMemo(() => new Map(lessons.map((lesson) => [lesson.id, lesson])), [lessons])
  const wordMap = useMemo(() => new Map(words.map((word) => [word.id, word])), [words])

  const clearAllData = () => {
    const confirmed = window.confirm('确定清空全部数据吗？此操作不可恢复。')
    if (!confirmed) {
      return
    }

    clearAppData()
    toast.success('全部数据已清空')
  }

  const resetSample = () => {
    const confirmed = window.confirm('确定恢复为内置示例数据吗？当前数据会被覆盖。')
    if (!confirmed) {
      return
    }

    resetToSampleData()
    toast.success('已恢复为示例数据')
  }

  const handleDeleteRecord = (recordId: string) => {
    const confirmed = window.confirm('确定删除这条听写记录吗？')
    if (!confirmed) {
      return
    }

    deleteRecord(recordId)
    toast.success('记录已删除')
  }

  return (
    <Layout>
      <header className="px-6 pb-4 pt-8">
        <h1 className="text-2xl font-bold text-text-primary">设置与历史</h1>
        <p className="mt-1 text-sm text-text-secondary">管理语音设置、数据和历史听写记录。</p>
      </header>

      <main className="space-y-6 px-6 pb-24">
        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Volume2 size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">默认语速</h2>
              <p className="text-sm text-text-secondary">进入听写页时默认使用这个语速。</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">当前值</span>
            <span className="text-sm font-medium text-text-primary">{settings.defaultSpeechRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.defaultSpeechRate}
            onChange={(event) => updateSettings({ defaultSpeechRate: Number(event.target.value) })}
            className="mt-3 w-full accent-primary"
          />

          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10">
              <Repeat size={20} className="text-info" />
            </div>
            <div className="flex-1">
              <h2 className="font-medium text-text-primary">默认重复次数</h2>
              <p className="text-sm text-text-secondary">每个词条默认朗读 1 到 3 次。</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => updateSettings({ defaultRepeatTimes: count as 1 | 2 | 3 })}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                  settings.defaultRepeatTimes === count ? 'bg-primary text-white' : 'bg-background text-text-primary'
                }`}
              >
                {count} 次
              </button>
            ))}
          </div>

          <Button variant="ghost" className="mt-4 w-full" onClick={resetSettings}>
            恢复默认语音设置
          </Button>
        </section>

        <section className="rounded-card bg-white p-5 shadow-card">
          <h2 className="font-medium text-text-primary">数据管理</h2>
          <div className="mt-4 space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                downloadAppData()
                toast.success('备份文件已开始下载')
              }}
            >
              <Download size={18} />
              导出全部数据
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={resetSample}>
              <History size={18} />
              重置为示例数据
            </Button>
            <Button variant="ghost" className="w-full justify-start text-danger hover:text-danger" onClick={clearAllData}>
              <Trash2 size={18} />
              清空全部数据
            </Button>
          </div>
        </section>

        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <History size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">历史记录</h2>
              <p className="text-sm text-text-secondary">按时间倒序查看听写结果，可展开查看明细。</p>
            </div>
          </div>

          <div className="space-y-3">
            {sortedRecords.map((record) => {
              const lesson = lessonMap.get(record.lessonId)
              const textbook = textbookMap.get(record.textbookId)
              const isExpanded = expandedRecordId === record.id

              return (
                <div key={record.id} className="rounded-xl bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" className="flex-1 text-left" onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}>
                      <p className="font-medium text-text-primary">{lesson?.name ?? '未知课文'}</p>
                      <p className="mt-1 text-sm text-text-secondary">{textbook?.name ?? '未知课本'}</p>
                      <p className="mt-1 text-xs text-text-hint">
                        {new Date(record.endTime).toLocaleString()} · 正确率 {record.accuracy}% · {record.itemIds.length} 条
                      </p>
                    </button>

                    <div className="flex shrink-0 gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}>
                        {isExpanded ? '收起' : '详情'}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-danger hover:text-danger" onClick={() => handleDeleteRecord(record.id)}>
                        删除
                      </Button>
                    </div>
                  </div>

                  {isExpanded ? (
                    <div className="mt-4 space-y-3 border-t border-border-color pt-4">
                      {record.photoUrl ? (
                        <img src={record.photoUrl} alt="本次听写照片" className="w-full rounded-xl object-cover" />
                      ) : null}
                      <div className="space-y-2">
                        {record.itemIds.map((itemId, index) => {
                          const word = wordMap.get(itemId)
                          const isCorrect = record.results[itemId]

                          return (
                            <div key={itemId} className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                              <div>
                                <p className="text-sm text-text-hint">{index + 1}.</p>
                                <p className="font-medium text-text-primary">{word?.content ?? '词条已删除'}</p>
                              </div>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  isCorrect ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                                }`}
                              >
                                {isCorrect ? '正确' : '错误'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>

          {sortedRecords.length === 0 && <p className="text-sm text-text-secondary">还没有历史记录，先去完成一次听写吧。</p>}
        </section>

        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Info size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">关于宁听</h2>
              <p className="mt-1 text-sm text-text-secondary">版本 1.0.0</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                宁听是一款纯前端、本地优先的小学生听写工具。课本、词条、记录都保存在当前浏览器中，照片也不会上传到任何服务器。
              </p>
            </div>
          </div>
        </section>
      </main>

      <TabBar />
    </Layout>
  )
}

export default SettingsPageApp
