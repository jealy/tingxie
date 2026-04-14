const STORAGE_KEY = 'ning_ting_app_data'
const SESSION_KEY = 'ning_ting_current_session'
const { buildSampleAppData } = require('./sample-data')

function getAppData() {
  const data = wx.getStorageSync(STORAGE_KEY)
  if (data && data.version) {
    return data
  }
  return buildSampleAppData()
}

function saveAppData(data) {
  wx.setStorageSync(STORAGE_KEY, data)
  return data
}

function ensureSeedData() {
  const data = wx.getStorageSync(STORAGE_KEY)
  if (!data || !data.version) {
    saveAppData(buildSampleAppData())
  }
}

function resetToSampleData() {
  return saveAppData(buildSampleAppData())
}

function updateSettings(patch) {
  const data = getAppData()
  data.settings = Object.assign({}, data.settings, patch)
  return saveAppData(data)
}

function getTextbooksWithStats() {
  const data = getAppData()
  return data.textbooks.map((textbook) => {
    const lessons = data.lessons.filter((lesson) => lesson.textbookId === textbook.id)
    const lessonIds = lessons.map((lesson) => lesson.id)
    const wordCount = data.words.filter((word) => lessonIds.indexOf(word.lessonId) !== -1).length

    return Object.assign({}, textbook, {
      lessonCount: lessons.length,
      wordCount,
    })
  })
}

function getTextbookDetail(textbookId) {
  const data = getAppData()
  const textbook = data.textbooks.find((item) => item.id === textbookId)
  if (!textbook) {
    return null
  }

  const lessons = data.lessons
    .filter((lesson) => lesson.textbookId === textbookId)
    .sort((left, right) => left.order - right.order)
    .map((lesson) => {
      const words = data.words
        .filter((word) => word.lessonId === lesson.id)
        .sort((left, right) => left.order - right.order)
      return Object.assign({}, lesson, {
        words,
        wordCount: words.length,
      })
    })

  return {
    textbook,
    lessons,
  }
}

function getSetupSummary() {
  const data = getAppData()
  return data.textbooks.map((textbook) => {
    const lessons = data.lessons.filter((lesson) => lesson.textbookId === textbook.id)
    return {
      id: textbook.id,
      name: textbook.name,
      lessonCount: lessons.length,
      lessons: lessons.sort((left, right) => left.order - right.order),
    }
  })
}

function getWordsByLessonId(lessonId) {
  return getAppData().words
    .filter((word) => word.lessonId === lessonId)
    .sort((left, right) => left.order - right.order)
}

function saveDictationRecord(payload) {
  const data = getAppData()
  data.records.unshift(payload)
  saveAppData(data)
  return payload
}

function saveCurrentSession(session) {
  wx.setStorageSync(SESSION_KEY, session)
  return session
}

function getCurrentSession() {
  return wx.getStorageSync(SESSION_KEY) || null
}

function clearCurrentSession() {
  wx.removeStorageSync(SESSION_KEY)
}

function clearRecords() {
  const data = getAppData()
  data.records = []
  return saveAppData(data)
}

function clearAllData() {
  return saveAppData({
    version: '1.0.0',
    textbooks: [],
    lessons: [],
    words: [],
    records: [],
    settings: {
      defaultSpeechRate: 1,
      defaultRepeatTimes: 2,
      theme: 'light',
    },
  })
}

function getRecords() {
  return getAppData().records
}

function getRecordDisplayList() {
  const data = getAppData()
  const textbookMap = new Map(data.textbooks.map((item) => [item.id, item]))
  const lessonMap = new Map(data.lessons.map((item) => [item.id, item]))

  return data.records.map((record) =>
    Object.assign({}, record, {
      textbookName: textbookMap.get(record.textbookId)?.name || '未知教材',
      lessonName: lessonMap.get(record.lessonId)?.name || '未知课文',
    }),
  )
}

function getDashboardStats() {
  const data = getAppData()
  const today = new Date().toDateString()
  const todayRecords = data.records.filter((record) => new Date(record.endTime).toDateString() === today)
  const accuracy = todayRecords.length
    ? Math.round(todayRecords.reduce((sum, record) => sum + record.accuracy, 0) / todayRecords.length)
    : 0

  return {
    textbookCount: data.textbooks.length,
    wordCount: data.words.length,
    todayDictationCount: todayRecords.length,
    todayAccuracy: accuracy,
  }
}

module.exports = {
  clearAllData,
  clearCurrentSession,
  clearRecords,
  ensureSeedData,
  getAppData,
  getCurrentSession,
  getDashboardStats,
  getRecordDisplayList,
  getRecords,
  getSetupSummary,
  getTextbookDetail,
  getTextbooksWithStats,
  getWordsByLessonId,
  resetToSampleData,
  saveAppData,
  saveCurrentSession,
  saveDictationRecord,
  updateSettings,
}
