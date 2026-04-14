const { getTextbookDetail } = require('../../utils/app-data')

Page({
  data: {
    textbook: null,
    lessons: [],
    termLabel: '',
  },
  onShow() {
    const { id } = this.options
    const detail = getTextbookDetail(id)

    if (!detail) {
      wx.showToast({
        title: '教材不存在',
        icon: 'none',
      })
      return
    }

    wx.setNavigationBarTitle({
      title: detail.textbook.name,
    })

    this.setData({
      textbook: detail.textbook,
      lessons: detail.lessons,
      termLabel: detail.textbook.term === 1 ? '上册' : '下册',
    })
  },
})
