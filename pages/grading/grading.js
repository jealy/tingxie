const {
  clearCurrentSession,
  getAppData,
  getCurrentSession,
  saveDictationRecord,
} = require('../../utils/app-data')
const { createId } = require('../../utils/id')

Page({
  data: {
    session: null,
    textbookName: '',
    lessonName: '',
    words: [],
    photoUrl: '',
    results: {},
    accuracy: 0,
    correctCount: 0,
  },
  onShow() {
    const session = getCurrentSession()
    const appData = getAppData()

    if (!session) {
      wx.showToast({
        title: '缺少本次听写信息',
        icon: 'none',
      })
      return
    }

    const textbook = appData.textbooks.find((item) => item.id === session.textbookId)
    const lesson = appData.lessons.find((item) => item.id === session.lessonId)
    const words = session.itemIds
      .map((id) => appData.words.find((item) => item.id === id))
      .filter(Boolean)

    this.setData({
      session,
      textbookName: textbook ? textbook.name : '未知教材',
      lessonName: lesson ? lesson.name : '未知课文',
      words,
      photoUrl: '',
      results: {},
      accuracy: 0,
      correctCount: 0,
    })
  },
  recalculate(results) {
    const correctCount = this.data.words.filter((word) => results[word.id] === true).length
    const accuracy = this.data.words.length ? Math.round((correctCount / this.data.words.length) * 100) : 0

    this.setData({
      results,
      correctCount,
      accuracy,
    })
  },
  handleMark(event) {
    const { id, correct } = event.currentTarget.dataset
    const results = Object.assign({}, this.data.results, {
      [id]: !!correct,
    })
    this.recalculate(results)
  },
  handleMarkAllCorrect() {
    const results = {}
    this.data.words.forEach((word) => {
      results[word.id] = true
    })
    this.recalculate(results)
  },
  handleChoosePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success: ({ tempFiles }) => {
        const file = tempFiles && tempFiles[0]
        if (!file) {
          return
        }

        this.setData({
          photoUrl: file.tempFilePath,
        })
      },
    })
  },
  handleClearPhoto() {
    this.setData({
      photoUrl: '',
    })
  },
  handleSubmit() {
    if (!this.data.session) {
      wx.showToast({
        title: '缺少会话信息',
        icon: 'none',
      })
      return
    }

    if (Object.keys(this.data.results).length < this.data.words.length) {
      wx.showModal({
        title: '还有未批改项',
        content: '未标记的词条会按错误处理，是否继续保存？',
        success: ({ confirm }) => {
          if (confirm) {
            this.saveRecord()
          }
        },
      })
      return
    }

    this.saveRecord()
  },
  saveRecord() {
    const results = {}
    this.data.words.forEach((word) => {
      results[word.id] = this.data.results[word.id] === true
    })

    saveDictationRecord({
      id: createId('record'),
      textbookId: this.data.session.textbookId,
      lessonId: this.data.session.lessonId,
      startTime: this.data.session.startTime,
      endTime: Date.now(),
      itemIds: this.data.words.map((word) => word.id),
      results,
      accuracy: this.data.words.length
        ? Math.round((this.data.words.filter((word) => results[word.id]).length / this.data.words.length) * 100)
        : 0,
      photoUrl: this.data.photoUrl || undefined,
    })

    clearCurrentSession()
    wx.showToast({
      title: '批改结果已保存',
      icon: 'success',
    })

    setTimeout(() => {
      wx.switchTab({
        url: '/pages/settings/settings',
      })
    }, 500)
  },
})
