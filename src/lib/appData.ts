import { nanoid } from 'nanoid'
import { z } from 'zod'
import { useLessonStore, useRecordStore, useSettingsStore, useTextbookStore, useWordStore } from '@/store'
import type { IAppData, IAppSettings, ILesson, ITextbook, IWordItem } from '@/types'

const APP_VERSION = '1.0.0'

export const DEFAULT_SETTINGS: IAppSettings = {
  defaultSpeechRate: 1,
  defaultRepeatTimes: 2,
  theme: 'auto',
}

const wordExtraSchema = z
  .object({
    author: z.string().optional(),
    fullText: z.string().optional(),
    example: z.string().optional(),
  })
  .optional()

const textbookSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  subject: z.enum(['chinese', 'english', 'poetry']),
  grade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  term: z.union([z.literal(1), z.literal(2)]),
  coverColor: z.string().min(1),
  createdAt: z.number(),
  updatedAt: z.number(),
})

const lessonSchema = z.object({
  id: z.string().min(1),
  textbookId: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().min(1),
  createdAt: z.number(),
  updatedAt: z.number(),
})

const wordSchema = z.object({
  id: z.string().min(1),
  lessonId: z.string().min(1),
  type: z.enum(['hanzi', 'ciyu', 'english', 'poetry']),
  content: z.string().min(1),
  pronunciation: z.string().optional(),
  hint: z.string().optional(),
  extra: wordExtraSchema,
  order: z.number().int().min(1),
  createdAt: z.number(),
  updatedAt: z.number(),
})

const recordSchema = z.object({
  id: z.string().min(1),
  textbookId: z.string().min(1),
  lessonId: z.string().min(1),
  startTime: z.number(),
  endTime: z.number(),
  itemIds: z.array(z.string().min(1)),
  results: z.record(z.string(), z.boolean()),
  accuracy: z.number().min(0).max(100),
  photoUrl: z.string().optional(),
})

const settingsSchema = z.object({
  defaultSpeechRate: z.number().min(0.5).max(1.5),
  defaultRepeatTimes: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  theme: z.enum(['light', 'auto']),
})

const appDataSchema = z.object({
  version: z.string().min(1),
  textbooks: z.array(textbookSchema),
  lessons: z.array(lessonSchema),
  words: z.array(wordSchema),
  records: z.array(recordSchema),
  settings: settingsSchema,
})

const sampleTextbookName = '\u90e8\u7f16\u7248\u8bed\u6587\u4e00\u5e74\u7ea7\u4e0a\u518c'

function buildSampleTextbooks(now: number, textbookId: string): ITextbook[] {
  return [
    {
      id: textbookId,
      name: sampleTextbookName,
      subject: 'chinese',
      grade: 1,
      term: 1,
      coverColor: '#FF9A62',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

function buildSampleLessons(now: number, textbookId: string, lessonIds: [string, string]): ILesson[] {
  return [
    {
      id: lessonIds[0],
      textbookId,
      name: '\u8bc6\u5b57\uff08\u4e00\uff09',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: lessonIds[1],
      textbookId,
      name: '\u8bfe\u6587 1 \u79cb\u5929',
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

function buildSampleWords(now: number, lessonIds: [string, string]): IWordItem[] {
  const hanziLessonId = lessonIds[0]
  const wordLessonId = lessonIds[1]

  const baseWords: Array<Omit<IWordItem, 'id' | 'createdAt' | 'updatedAt'>> = [
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u5929', pronunciation: 'tian', hint: '\u5929\u7a7a\u7684\u5929', order: 1 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u5730', pronunciation: 'di', hint: '\u5927\u5730\u7684\u5730', order: 2 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u4eba', pronunciation: 'ren', hint: '\u5927\u4eba\u7684\u4eba', order: 3 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u53e3', pronunciation: 'kou', hint: '\u4eba\u53e3\u7684\u53e3', order: 4 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u624b', pronunciation: 'shou', hint: '\u5c0f\u624b\u7684\u624b', order: 5 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u65e5', pronunciation: 'ri', hint: '\u65e5\u6708\u7684\u65e5', order: 6 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u6708', pronunciation: 'yue', hint: '\u6708\u4eae\u7684\u6708', order: 7 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u6c34', pronunciation: 'shui', hint: '\u6cb3\u6c34\u7684\u6c34', order: 8 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u706b', pronunciation: 'huo', hint: '\u706b\u5c71\u7684\u706b', order: 9 },
    { lessonId: hanziLessonId, type: 'hanzi', content: '\u5c71', pronunciation: 'shan', hint: '\u9ad8\u5c71\u7684\u5c71', order: 10 },
    { lessonId: wordLessonId, type: 'ciyu', content: '\u79cb\u5929', pronunciation: 'qiu tian', hint: '\u79cb\u5929\u7684\u79cb\u5929', order: 1 },
    { lessonId: wordLessonId, type: 'ciyu', content: '\u5929\u6c14', pronunciation: 'tian qi', hint: '\u5929\u6c14\u7684\u5929\u6c14', order: 2 },
    { lessonId: wordLessonId, type: 'ciyu', content: '\u6811\u53f6', pronunciation: 'shu ye', hint: '\u6811\u53f6\u7684\u6811\u53f6', order: 3 },
    { lessonId: wordLessonId, type: 'ciyu', content: '\u5929\u7a7a', pronunciation: 'tian kong', hint: '\u5929\u7a7a\u7684\u5929\u7a7a', order: 4 },
    { lessonId: wordLessonId, type: 'ciyu', content: '\u4e30\u6536', pronunciation: 'feng shou', hint: '\u4e30\u6536\u7684\u4e30\u6536', order: 5 },
  ]

  return baseWords.map((word) => ({
    ...word,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  }))
}

export function buildSampleAppData(): IAppData {
  const now = Date.now()
  const textbookId = nanoid()
  const lessonIds: [string, string] = [nanoid(), nanoid()]

  return {
    version: APP_VERSION,
    textbooks: buildSampleTextbooks(now, textbookId),
    lessons: buildSampleLessons(now, textbookId, lessonIds),
    words: buildSampleWords(now, lessonIds),
    records: [],
    settings: DEFAULT_SETTINGS,
  }
}

export function getAppData(): IAppData {
  return {
    version: APP_VERSION,
    textbooks: useTextbookStore.getState().textbooks,
    lessons: useLessonStore.getState().lessons,
    words: useWordStore.getState().words,
    records: useRecordStore.getState().records,
    settings: useSettingsStore.getState().settings,
  }
}

export function replaceAppData(data: IAppData) {
  useTextbookStore.setState({ textbooks: data.textbooks })
  useLessonStore.setState({ lessons: data.lessons })
  useWordStore.setState({ words: data.words })
  useRecordStore.setState({ records: data.records })
  useSettingsStore.setState({ settings: data.settings })
}

export function clearAppData() {
  replaceAppData({
    version: APP_VERSION,
    textbooks: [],
    lessons: [],
    words: [],
    records: [],
    settings: DEFAULT_SETTINGS,
  })
}

export function resetToSampleData() {
  replaceAppData(buildSampleAppData())
}

export function ensureSeedData() {
  const { textbooks, lessons, words } = getAppData()

  if (textbooks.length === 0 && lessons.length === 0 && words.length === 0) {
    resetToSampleData()
  }
}

export function downloadAppData(filename?: string) {
  const data = getAppData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = filename ?? `ning-ting-backup-${date}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function normalizeImportedData(raw: unknown): IAppData {
  const parsed = appDataSchema.parse(raw)

  return {
    version: parsed.version || APP_VERSION,
    textbooks: parsed.textbooks,
    lessons: parsed.lessons,
    words: parsed.words,
    records: parsed.records,
    settings: parsed.settings,
  }
}

function remapImportedData(data: IAppData): IAppData {
  const textbookIdMap = new Map<string, string>()
  const lessonIdMap = new Map<string, string>()
  const wordIdMap = new Map<string, string>()

  const textbooks = data.textbooks.map((textbook) => {
    const nextId = nanoid()
    textbookIdMap.set(textbook.id, nextId)

    return {
      ...textbook,
      id: nextId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  })

  const lessons = data.lessons.map((lesson) => {
    const nextId = nanoid()
    lessonIdMap.set(lesson.id, nextId)

    return {
      ...lesson,
      id: nextId,
      textbookId: textbookIdMap.get(lesson.textbookId) ?? lesson.textbookId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  })

  const words = data.words.map((word) => {
    const nextId = nanoid()
    wordIdMap.set(word.id, nextId)

    return {
      ...word,
      id: nextId,
      lessonId: lessonIdMap.get(word.lessonId) ?? word.lessonId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  })

  const records = data.records.map((record) => ({
    ...record,
    id: nanoid(),
    textbookId: textbookIdMap.get(record.textbookId) ?? record.textbookId,
    lessonId: lessonIdMap.get(record.lessonId) ?? record.lessonId,
    itemIds: record.itemIds.map((itemId) => wordIdMap.get(itemId) ?? itemId),
    results: Object.fromEntries(
      Object.entries(record.results).map(([itemId, value]) => [wordIdMap.get(itemId) ?? itemId, value]),
    ),
  }))

  return {
    version: APP_VERSION,
    textbooks,
    lessons,
    words,
    records,
    settings: data.settings,
  }
}

export async function importAppData(file: File, strategy: 'replace' | 'merge') {
  const text = await file.text()
  const raw = JSON.parse(text)
  const parsed = normalizeImportedData(raw)

  if (strategy === 'replace') {
    replaceAppData({
      ...parsed,
      version: APP_VERSION,
    })

    return getAppData()
  }

  const current = getAppData()
  const incoming = remapImportedData(parsed)

  replaceAppData({
    version: APP_VERSION,
    textbooks: [...current.textbooks, ...incoming.textbooks],
    lessons: [...current.lessons, ...incoming.lessons],
    words: [...current.words, ...incoming.words],
    records: [...current.records, ...incoming.records],
    settings: { ...current.settings, ...incoming.settings },
  })

  return getAppData()
}

export function deleteTextbookCascade(textbookId: string) {
  const lessonIds = useLessonStore
    .getState()
    .lessons.filter((lesson) => lesson.textbookId === textbookId)
    .map((lesson) => lesson.id)

  const lessonIdSet = new Set(lessonIds)
  const wordIds = useWordStore
    .getState()
    .words.filter((word) => lessonIdSet.has(word.lessonId))
    .map((word) => word.id)

  const wordIdSet = new Set(wordIds)

  useTextbookStore.setState((state) => ({
    textbooks: state.textbooks.filter((textbook) => textbook.id !== textbookId),
  }))
  useLessonStore.setState((state) => ({
    lessons: state.lessons.filter((lesson) => lesson.textbookId !== textbookId),
  }))
  useWordStore.setState((state) => ({
    words: state.words.filter((word) => !lessonIdSet.has(word.lessonId)),
  }))
  useRecordStore.setState((state) => ({
    records: state.records.filter(
      (record) =>
        record.textbookId !== textbookId &&
        !lessonIdSet.has(record.lessonId) &&
        !record.itemIds.some((itemId) => wordIdSet.has(itemId)),
    ),
  }))
}

export function deleteLessonCascade(lessonId: string) {
  const wordIds = useWordStore
    .getState()
    .words.filter((word) => word.lessonId === lessonId)
    .map((word) => word.id)
  const wordIdSet = new Set(wordIds)

  useLessonStore.setState((state) => ({
    lessons: state.lessons.filter((lesson) => lesson.id !== lessonId),
  }))
  useWordStore.setState((state) => ({
    words: state.words.filter((word) => word.lessonId !== lessonId),
  }))
  useRecordStore.setState((state) => ({
    records: state.records.filter(
      (record) => record.lessonId !== lessonId && !record.itemIds.some((itemId) => wordIdSet.has(itemId)),
    ),
  }))
}

export function getLessonWordCount(lessonId: string) {
  return useWordStore.getState().words.filter((word) => word.lessonId === lessonId).length
}

export function getTextbookWordCount(textbookId: string) {
  const lessonIds = useLessonStore
    .getState()
    .lessons.filter((lesson) => lesson.textbookId === textbookId)
    .map((lesson) => lesson.id)
  const lessonIdSet = new Set(lessonIds)

  return useWordStore.getState().words.filter((word) => lessonIdSet.has(word.lessonId)).length
}

export function getTextbookRecordStats(textbookId: string) {
  const today = new Date().toDateString()
  const records = useRecordStore
    .getState()
    .records.filter((record) => record.textbookId === textbookId || textbookId === 'all')

  const todayRecords = records.filter((record) => new Date(record.endTime).toDateString() === today)
  const accuracy =
    todayRecords.length > 0
      ? Math.round(todayRecords.reduce((sum, record) => sum + record.accuracy, 0) / todayRecords.length)
      : 0

  return {
    todayCount: todayRecords.length,
    todayAccuracy: accuracy,
    totalCount: records.length,
  }
}
