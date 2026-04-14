const { getDashboardStats, getTextbooksWithStats } = require('../../utils/app-data')

Page({
  data: {
    textbooks: [],
    stats: {
      textbookCount: 0,
      wordCount: 0,
      todayDictationCount: 0,
      todayAccuracy: 0,
    },
    greeting: '晚上好',
    accuracyText: '--',
  },
  onShow() {
    const hour = new Date().getHours()
    let greeting = '晚上好'

    if (hour < 12) {
      greeting = '上午好'
    } else if (hour < 18) {
      greeting = '下午好'
    }

    const stats = getDashboardStats()
    const textbooks = getTextbooksWithStats().map((item) => ({
      id: item.id,
      name: item.name,
      lessonCount: item.lessonCount,
      wordCount: item.wordCount,
      coverColor: item.coverColor,
      recentText: item.wordCount > 0 ? '可继续练习' : '待补充词条',
    }))

    this.setData({
      textbooks,
      stats,
      greeting,
      accuracyText: stats.todayAccuracy ? `${stats.todayAccuracy}%` : '--',
    })
  },
  handleOpenTextbook(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/textbook/textbook?id=${id}`,
    })
  },
})
