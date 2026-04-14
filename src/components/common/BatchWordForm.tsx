import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useWordStore } from '@/store'
import type { IWordExtra, IWordType } from '@/types'

interface BatchWordFormProps {
  lessonId: string
  onSuccess?: () => void
}

const TYPE_OPTIONS: Array<{ value: IWordType; label: string; help: string }> = [
  { value: 'hanzi', label: '汉字', help: '每行：内容|拼音|提示' },
  { value: 'ciyu', label: '词语', help: '每行：内容|拼音|提示' },
  { value: 'english', label: '英语', help: '每行：单词|音标|释义|例句' },
  { value: 'poetry', label: '古诗', help: '每行：标题|作者|全文' },
]

const BatchWordForm = ({ lessonId, onSuccess }: BatchWordFormProps) => {
  const batchAddWords = useWordStore((state) => state.batchAddWords)
  const [type, setType] = useState<IWordType>('hanzi')
  const [content, setContent] = useState('')

  const helpText = useMemo(() => TYPE_OPTIONS.find((item) => item.value === type)?.help ?? '', [type])

  const parseLines = () => {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    return lines
      .map((line) => line.split(/[|\t]/).map((part) => part.trim()))
      .filter((parts) => parts[0])
      .map((parts) => {
        let extra: IWordExtra | undefined
        let pronunciation: string | undefined
        let hint: string | undefined

        if (type === 'hanzi' || type === 'ciyu') {
          pronunciation = parts[1] || undefined
          hint = parts[2] || undefined
        }

        if (type === 'english') {
          pronunciation = parts[1] || undefined
          hint = parts[2] || undefined
          extra = parts[3] ? { example: parts[3] } : undefined
        }

        if (type === 'poetry') {
          extra = {
            author: parts[1] || undefined,
            fullText: parts[2] || undefined,
          }
        }

        return {
          lessonId,
          type,
          content: parts[0],
          pronunciation,
          hint,
          extra,
        }
      })
      .filter((item) => item.content && (type !== 'poetry' || item.extra?.fullText))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const parsedWords = parseLines()

    if (parsedWords.length === 0) {
      toast.error('没有解析出可导入的词条')
      return
    }

    batchAddWords(parsedWords)
    toast.success(`已批量添加 ${parsedWords.length} 条词条`)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-text-primary">词条类型</label>
        <div className="grid grid-cols-2 gap-2">
          {TYPE_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setType(item.value)}
              className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${
                type === item.value ? 'bg-primary text-white' : 'bg-background text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-background p-3 text-sm text-text-secondary">
        <p>{helpText}</p>
        <p className="mt-1 text-xs text-text-hint">支持用竖线或 Tab 分隔字段。</p>
      </div>

      <div>
        <label htmlFor="batch-words" className="mb-2 block text-sm font-medium text-text-primary">
          批量内容
        </label>
        <textarea
          id="batch-words"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={8}
          placeholder="天|tian|天空的天"
          className="w-full resize-none rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!content.trim()}>
        开始批量导入
      </Button>
    </form>
  )
}

export default BatchWordForm
