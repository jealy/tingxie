const { getSetupSummary } = require('../../utils/app-data')

Page({
  data: {
    textbookOptions: [],
    lessonOptions: [],
    textbookIndex: 0,
    lessonIndex: 0,
    textbookName: '暂无教材',
    lessonName: '暂无课文',
  },
  onShow() {
    const textbookOptions = getSetupSummary()
    const lessonOptions = textbookOptions.length ? textbookOptions[0].lessons : []

    this.setData({
      textbookOptions,
      lessonOptions,
      textbookIndex: 0,
      lessonIndex: 0,
      textbookName: textbookOptions.length ? textbookOptions[0].name : '暂无教材',
      lessonName: lessonOptions.length ? lessonOptions[0].name : '暂无课文',
    })
  },
  handleTextbookChange(event) {
    const textbookIndex = Number(event.detail.value)
    const lessonOptions = this.data.textbookOptions[textbookIndex]
      ? this.data.textbookOptions[textbookIndex].lessons
      : []

    this.setData({
      textbookIndex,
      lessonOptions,
      lessonIndex: 0,
      textbookName: this.data.textbookOptions[textbookIndex] ? this.data.textbookOptions[textbookIndex].name : '暂无教材',
      lessonName: lessonOptions.length ? lessonOptions[0].name : '暂无课文',
    })
  },
  handleLessonChange(event) {
    const lessonIndex = Number(event.detail.value)
    this.setData({
      lessonIndex,
      lessonName: this.data.lessonOptions[lessonIndex] ? this.data.lessonOptions[lessonIndex].name : '暂无课文',
    })
  },
  handleStart() {
    const textbook = this.data.textbookOptions[this.data.textbookIndex]
    const lesson = this.data.lessonOptions[this.data.lessonIndex]

    if (!textbook || !lesson) {
      wx.showToast({
        title: '暂无可用课文',
        icon: 'none',
      })
      return
    }

    wx.navigateTo({
      url: `/pages/dictation/dictation?lessonId=${lesson.id}&textbookId=${textbook.id}`,
    })
  },
})
