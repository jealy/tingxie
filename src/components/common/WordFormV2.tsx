import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWordStore } from '@/store'
import type { IWordExtra, IWordItem, IWordType } from '@/types'

interface WordFormV2Props {
  lessonId: string
  word?: IWordItem
  onSuccess?: () => void
}

const TYPE_OPTIONS: Array<{ value: IWordType; label: string }> = [
  { value: 'hanzi', label: '汉字' },
  { value: 'ciyu', label: '词语' },
  { value: 'english', label: '英语' },
  { value: 'poetry', label: '古诗' },
]

const WordFormV2 = ({ lessonId, word, onSuccess }: WordFormV2Props) => {
  const addWord = useWordStore((state) => state.addWord)
  const updateWord = useWordStore((state) => state.updateWord)
  const [type, setType] = useState<IWordType>(word?.type ?? 'hanzi')
  const [content, setContent] = useState(word?.content ?? '')
  const [pronunciation, setPronunciation] = useState(word?.pronunciation ?? '')
  const [hint, setHint] = useState(word?.hint ?? '')
  const [extra, setExtra] = useState<IWordExtra>({
    author: word?.extra?.author ?? '',
    fullText: word?.extra?.fullText ?? '',
    example: word?.extra?.example ?? '',
  })

  const isPoetry = type === 'poetry'
  const isEnglish = type === 'english'
  const needsHint = type === 'hanzi' || type === 'ciyu'
  const canSubmit = content.trim() && (!isPoetry || extra.fullText?.trim())

  const buildExtra = () => {
    const nextExtra: IWordExtra = {}

    if (extra.author?.trim()) {
      nextExtra.author = extra.author.trim()
    }

    if (extra.fullText?.trim()) {
      nextExtra.fullText = extra.fullText.trim()
    }

    if (extra.example?.trim()) {
      nextExtra.example = extra.example.trim()
    }

    return Object.keys(nextExtra).length > 0 ? nextExtra : undefined
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    const payload = {
      lessonId,
      type,
      content: content.trim(),
      pronunciation: pronunciation.trim() || undefined,
      hint: hint.trim() || undefined,
      extra: buildExtra(),
    }

    if (word) {
      updateWord(word.id, payload)
      toast.success('词条已更新')
    } else {
      addWord(payload)
      toast.success('词条已添加')
    }

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
              className={cn(
                'rounded-xl py-2.5 text-sm font-medium transition-colors',
                type === item.value ? 'bg-primary text-white' : 'bg-background text-text-primary',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="word-content" className="mb-2 block text-sm font-medium text-text-primary">
          {isEnglish ? '单词' : isPoetry ? '标题' : '内容'}
        </label>
        <input
          id="word-content"
          type="text"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          autoFocus
          placeholder={
            isEnglish ? '如：apple' : isPoetry ? '如：静夜思' : type === 'hanzi' ? '如：天' : '如：天空'
          }
          className="w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {(type === 'hanzi' || type === 'ciyu') && (
        <>
          <div>
            <label htmlFor="word-pronunciation" className="mb-2 block text-sm font-medium text-text-primary">
              拼音
            </label>
            <input
              id="word-pronunciation"
              type="text"
              value={pronunciation}
              onChange={(event) => setPronunciation(event.target.value)}
              placeholder="如：tian kong"
              className="w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="word-hint" className="mb-2 block text-sm font-medium text-text-primary">
              提示
            </label>
            <input
              id="word-hint"
              type="text"
              value={hint}
              onChange={(event) => setHint(event.target.value)}
              placeholder="如：天空的天"
              className="w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </>
      )}

      {isEnglish && (
        <>
          <div>
            <label htmlFor="word-pronunciation" className="mb-2 block text-sm font-medium text-text-primary">
              音标
            </label>
            <input
              id="word-pronunciation"
              type="text"
              value={pronunciation}
              onChange={(event) => setPronunciation(event.target.value)}
              placeholder="如：/ˈæp(ə)l/"
              className="w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="word-hint" className="mb-2 block text-sm font-medium text-text-primary">
              释义
            </label>
            <input
              id="word-hint"
              type="text"
              value={hint}
              onChange={(event) => setHint(event.target.value)}
              placeholder="如：苹果"
              className="w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="word-example" className="mb-2 block text-sm font-medium text-text-primary">
              例句
            </label>
            <textarea
              id="word-example"
              value={extra.example ?? ''}
              onChange={(event) => setExtra((prev) => ({ ...prev, example: event.target.value }))}
              rows={3}
              placeholder="如：I have an apple."
              className="w-full resize-none rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </>
      )}

      {isPoetry && (
        <>
          <div>
            <label htmlFor="word-author" className="mb-2 block text-sm font-medium text-text-primary">
              作者
            </label>
            <input
              id="word-author"
              type="text"
              value={extra.author ?? ''}
              onChange={(event) => setExtra((prev) => ({ ...prev, author: event.target.value }))}
              placeholder="如：李白"
              className="w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="word-full-text" className="mb-2 block text-sm font-medium text-text-primary">
              全文
            </label>
            <textarea
              id="word-full-text"
              value={extra.fullText ?? ''}
              onChange={(event) => setExtra((prev) => ({ ...prev, fullText: event.target.value }))}
              rows={4}
              placeholder="如：床前明月光，疑是地上霜。"
              className="w-full resize-none rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </>
      )}

      {!needsHint && !isEnglish && !isPoetry ? null : null}

      <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
        {word ? '保存词条' : '添加词条'}
      </Button>
    </form>
  )
}

export default WordFormV2
