const {
  clearAllData,
  clearRecords,
  getAppData,
  getRecordDisplayList,
  resetToSampleData,
  updateSettings,
} = require('../../utils/app-data')

Page({
  data: {
    settings: {
      defaultSpeechRate: 1,
      defaultRepeatTimes: 2,
    },
    speechRateLabel: '1.0',
    repeatOptions: [],
    records: [],
  },
  onShow() {
    const data = getAppData()
    this.setData({
      settings: data.settings,
      speechRateLabel: Number(data.settings.defaultSpeechRate).toFixed(1),
      repeatOptions: this.buildRepeatOptions(data.settings.defaultRepeatTimes),
      records: getRecordDisplayList().map((record) => ({
        id: record.id,
        lessonName: record.lessonName,
        textbookName: record.textbookName,
        accuracy: record.accuracy,
        itemCount: record.itemIds.length,
        endTimeLabel: this.formatTime(record.endTime),
      })),
    })
  },
  buildRepeatOptions(selectedValue) {
    return [1, 2, 3].map((value) => ({
      value,
      label: `${value} 次`,
      className: value === selectedValue ? 'primary-btn' : 'ghost-btn',
    }))
  },
  formatTime(timestamp) {
    const date = new Date(timestamp)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  },
  handleSpeechRateChange(event) {
    const nextValue = Number(event.detail.value)
    updateSettings({ defaultSpeechRate: nextValue })
    this.setData({
      'settings.defaultSpeechRate': nextValue,
      speechRateLabel: nextValue.toFixed(1),
    })
  },
  handleRepeatChange(event) {
    const nextValue = Number(event.currentTarget.dataset.value)
    updateSettings({ defaultRepeatTimes: nextValue })
    this.setData({
      'settings.defaultRepeatTimes': nextValue,
      repeatOptions: this.buildRepeatOptions(nextValue),
    })
  },
  handleResetSample() {
    wx.showModal({
      title: '恢复示例数据',
      content: '会覆盖当前教材、词条和记录，是否继续？',
      success: ({ confirm }) => {
        if (!confirm) {
          return
        }
        resetToSampleData()
        this.onShow()
      },
    })
  },
  handleClearRecords() {
    wx.showModal({
      title: '清空记录',
      content: '只删除听写记录，教材和词条保留。',
      success: ({ confirm }) => {
        if (!confirm) {
          return
        }
        clearRecords()
        this.onShow()
      },
    })
  },
  handleClearAll() {
    wx.showModal({
      title: '清空全部数据',
      content: '会删除教材、课文、词条与记录。',
      success: ({ confirm }) => {
        if (!confirm) {
          return
        }
        clearAllData()
        this.onShow()
      },
    })
  },
})
