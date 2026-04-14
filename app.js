const { ensureSeedData } = require('./utils/app-data')

App({
  globalData: {
    appVersion: '1.0.0',
  },
  onLaunch() {
    ensureSeedData()
  },
})
