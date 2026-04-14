import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTextbookStore } from '@/store'
import type { IGrade, ISubject, ITextbook, ITerm } from '@/types'

interface TextbookFormProps {
  textbook?: ITextbook
  onSuccess?: () => void
}

const COLORS = ['#FF9A62', '#5FDD9D', '#88B9F2', '#FF8A8A', '#9B8AFB', '#FBC267']
const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6] as const
const SUBJECT_OPTIONS = [
  { value: 'chinese', label: '语文' },
  { value: 'english', label: '英语' },
  { value: 'poetry', label: '古诗' },
] as const
const TERM_OPTIONS = [
  { value: 1, label: '上册' },
  { value: 2, label: '下册' },
] as const

const textbookSchema = z.object({
  name: z.string().trim().min(1, '请输入课本名称'),
  subject: z.enum(['chinese', 'english', 'poetry']),
  grade: z.number().int().min(1).max(6),
  term: z.number().int().min(1).max(2),
  coverColor: z.string().min(1),
})

type TextbookFormValues = z.infer<typeof textbookSchema>

const TextbookForm = ({ textbook, onSuccess }: TextbookFormProps) => {
  const addTextbook = useTextbookStore((state) => state.addTextbook)
  const updateTextbook = useTextbookStore((state) => state.updateTextbook)
  const isEditMode = Boolean(textbook)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TextbookFormValues>({
    resolver: zodResolver(textbookSchema),
    defaultValues: {
      name: textbook?.name ?? '',
      subject: textbook?.subject ?? 'chinese',
      grade: textbook?.grade ?? 1,
      term: textbook?.term ?? 1,
      coverColor: textbook?.coverColor ?? COLORS[0],
    },
    mode: 'onChange',
  })

  const selectedSubject = useWatch({ control, name: 'subject' })
  const selectedTerm = useWatch({ control, name: 'term' })
  const selectedColor = useWatch({ control, name: 'coverColor' })

  const onSubmit = handleSubmit((values) => {
    const payload = {
      name: values.name.trim(),
      subject: values.subject as ISubject,
      grade: values.grade as IGrade,
      term: values.term as ITerm,
      coverColor: values.coverColor,
    }

    if (textbook) {
      updateTextbook(textbook.id, payload)
      toast.success('课本已更新')
    } else {
      addTextbook(payload)
      toast.success('课本已创建')
    }

    onSuccess?.()
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5 px-6 py-4" noValidate>
      <div>
        <label htmlFor="textbook-name" className="mb-2 block text-sm font-medium text-text-primary">
          课本名称
        </label>
        <input
          id="textbook-name"
          type="text"
          autoFocus
          placeholder="如：部编版语文一年级上册"
          aria-invalid={Boolean(errors.name)}
          className={cn(
            'w-full rounded-xl bg-background px-4 py-3 text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30',
            errors.name && 'ring-2 ring-danger/30',
          )}
          {...register('name')}
        />
        {errors.name && <p className="mt-2 text-sm text-danger">{errors.name.message}</p>}
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-text-primary">学科</span>
        <div className="flex gap-2">
          {SUBJECT_OPTIONS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setValue('subject', item.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className={cn(
                'flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors',
                selectedSubject === item.value ? 'bg-primary text-white' : 'bg-background text-text-primary',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="textbook-grade" className="mb-2 block text-sm font-medium text-text-primary">
            年级
          </label>
          <select
            id="textbook-grade"
            className="w-full rounded-xl bg-background px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            {...register('grade', { valueAsNumber: true })}
          >
            {GRADE_OPTIONS.map((grade) => (
              <option key={grade} value={grade}>
                {grade} 年级
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <span className="mb-2 block text-sm font-medium text-text-primary">学期</span>
          <div className="flex gap-2">
            {TERM_OPTIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setValue('term', item.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={cn(
                  'flex-1 rounded-xl py-3 text-sm font-medium transition-colors',
                  selectedTerm === item.value ? 'bg-primary text-white' : 'bg-background text-text-primary',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-text-primary">封面颜色</span>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() =>
                setValue('coverColor', color, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className={cn(
                'h-10 w-10 rounded-xl transition-transform focus:outline-none focus:ring-2 focus:ring-primary/30',
                selectedColor === color && 'scale-110 ring-2 ring-primary ring-offset-2',
              )}
              style={{ backgroundColor: color }}
              aria-label={`选择颜色 ${color}`}
            />
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={!isValid || isSubmitting}>
        {isEditMode ? '保存课本' : '创建课本'}
      </Button>
    </form>
  )
}

export default TextbookForm
