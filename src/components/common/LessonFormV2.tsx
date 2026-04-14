import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLessonStore } from '@/store'
import type { ILesson } from '@/types'

interface LessonFormV2Props {
  textbookId: string
  lesson?: ILesson
  onSuccess?: () => void
}

const LessonFormV2 = ({ textbookId, lesson, onSuccess }: LessonFormV2Props) => {
  const addLesson = useLessonStore((state) => state.addLesson)
  const updateLesson = useLessonStore((state) => state.updateLesson)
  const [name, setName] = useState(lesson?.name ?? '')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextName = name.trim()
    if (!nextName) {
      return
    }

    if (lesson) {
      updateLesson(lesson.id, { name: nextName })
      toast.success('课文已更新')
    } else {
      addLesson({ textbookId, name: nextName })
      toast.success('课文已创建')
    }

    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-6 py-4">
      <div>
        <label htmlFor="lesson-name" className="mb-2 block text-sm font-medium text-text-primary">
          课文名称
        </label>
        <input
          id="lesson-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
          placeholder="如：课文 1 秋天"
          className={cn(
            'w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30',
            !name.trim() && 'placeholder:text-text-hint',
          )}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!name.trim()}>
        {lesson ? '保存课文' : '创建课文'}
      </Button>
    </form>
  )
}

export default LessonFormV2
