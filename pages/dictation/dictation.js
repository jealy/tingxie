const { saveCurrentSession, getAppData, getWordsByLessonId } = require('../../utils/app-data')

let repeatTimer = null
let playRunId = 0
let plugin = null
let audioContext = null

try {
  plugin = requirePlugin('WechatSI')
} catch (error) {
  plugin = null
}

Page({
  data: {
    textbookId: '',
    lessonId: '',
    lessonName: '',
    words: [],
    currentIndex: 0,
    repeatTimes: 2,
    speechRate: 1,
    isPlaying: false,
    isPaused: false,
    playCount: 0,
    sessionStartTime: 0,
    progressWidth: '0%',
    currentHint: '',
    statusText: '准备朗读',
    repeatOptions: [],
    actionButtonText: '朗读',
    speechAvailable: true,
  },
  onLoad(options) {
    const appData = getAppData()
    const words = getWordsByLessonId(options.lessonId)
    const lesson = appData.lessons.find((item) => item.id === options.lessonId)
    const repeatTimes = appData.settings.defaultRepeatTimes
    const speechRate = appData.settings.defaultSpeechRate

    if (!words.length) {
      wx.showToast({ title: '当前课文没有词条', icon: 'none' })
    }

    this.setData({
      textbookId: options.textbookId || '',
      lessonId: options.lessonId || '',
      lessonName: lesson ? lesson.name : '听写练习',
      words,
      repeatTimes,
      speechRate,
      sessionStartTime: Date.now(),
      progressWidth: this.getProgressWidth(0, words.length),
      currentHint: words[0] ? this.getHintText(words[0]) : '当前词条无额外提示',
      repeatOptions: this.buildRepeatOptions(repeatTimes),
      actionButtonText: '朗读',
      speechAvailable: Boolean(plugin),
    })

    wx.setNavigationBarTitle({ title: lesson ? lesson.name : '听写练习' })

    if (!plugin) {
      wx.showToast({ title: '请先配置同声传译插件', icon: 'none' })
      return
    }

    if (words.length) {
      setTimeout(() => this.startPlayback(), 250)
    }
  },
  onUnload() {
    this.stopPlayback()
    this.destroyAudio()
  },
  onHide() {
    this.stopPlayback()
    this.destroyAudio()
  },
  ensureAudioContext() {
    if (!audioContext) {
      audioContext = wx.createInnerAudioContext()
      audioContext.obeyMuteSwitch = false
    }
    return audioContext
  },
  destroyAudio() {
    if (audioContext) {
      audioContext.stop()
      audioContext.destroy()
      audioContext = null
    }
  },
  buildRepeatOptions(selectedValue) {
    return [1, 2, 3].map((value) => ({
      value,
      label: `${value} 次`,
      className: value === selectedValue ? 'primary-btn repeat-btn' : 'secondary-btn repeat-btn',
    }))
  },
  getProgressWidth(index, total) {
    if (!total) return '0%'
    return `${Math.round(((index + 1) / total) * 100)}%`
  },
  getHintText(word) {
    if (!word) return '当前词条无额外提示'
    return word.hint || word.pronunciation || word.type || '当前词条无额外提示'
  },
  updatePlaybackView(partial) {
    const isPlaying = Object.prototype.hasOwnProperty.call(partial, 'isPlaying') ? partial.isPlaying : this.data.isPlaying
    const isPaused = Object.prototype.hasOwnProperty.call(partial, 'isPaused') ? partial.isPaused : this.data.isPaused
    let statusText = '准备朗读'
    let actionButtonText = '朗读'

    if (isPlaying) {
      statusText = '正在朗读'
      actionButtonText = '暂停'
    } else if (isPaused) {
      statusText = '已暂停'
      actionButtonText = '继续'
    }

    this.setData(Object.assign({ statusText, actionButtonText }, partial))
  },
  stopPlayback(keepPausedState) {
    playRunId += 1
    if (repeatTimer) {
      clearTimeout(repeatTimer)
      repeatTimer = null
    }
    if (audioContext) {
      audioContext.stop()
    }
    this.updatePlaybackView({ isPlaying: false, isPaused: !!keepPausedState })
  },
  playWordAudio(word, onDone) {
    if (!plugin || typeof plugin.textToSpeech !== 'function') {
      wx.showToast({ title: '同声传译插件未就绪', icon: 'none' })
      this.updatePlaybackView({ isPlaying: false, isPaused: false })
      return
    }

    plugin.textToSpeech({
      lang: word.type === 'english' ? 'en_US' : 'zh_CN',
      content: word.content,
      success: (res) => {
        if (!res || res.retcode !== 0 || !res.filename) {
          wx.showToast({ title: '语音合成失败', icon: 'none' })
          this.updatePlaybackView({ isPlaying: false, isPaused: false })
          return
        }

        const ctx = this.ensureAudioContext()
        ctx.stop()
        ctx.src = res.filename
        ctx.onEnded(() => {
          onDone()
        })
        ctx.onError(() => {
          wx.showToast({ title: '音频播放失败', icon: 'none' })
          this.updatePlaybackView({ isPlaying: false, isPaused: false })
        })
        ctx.play()
      },
      fail: () => {
        wx.showToast({ title: '语音合成失败', icon: 'none' })
        this.updatePlaybackView({ isPlaying: false, isPaused: false })
      },
    })
  },
  startPlayback() {
    const current = this.data.words[this.data.currentIndex]
    if (!current) return

    playRunId += 1
    const currentRunId = playRunId
    let count = 0

    if (repeatTimer) {
      clearTimeout(repeatTimer)
      repeatTimer = null
    }

    this.updatePlaybackView({ isPlaying: true, isPaused: false, playCount: 0 })

    const speakOnce = () => {
      if (currentRunId !== playRunId) return

      count += 1
      this.setData({ playCount: count })
      this.playWordAudio(current, () => {
        if (currentRunId !== playRunId) return

        if (count >= this.data.repeatTimes) {
          this.updatePlaybackView({ isPlaying: false, isPaused: false })
          repeatTimer = null
          return
        }

        const wait = Math.max(1200, Math.round(2400 - this.data.speechRate * 600))
        repeatTimer = setTimeout(speakOnce, wait)
      })
    }

    speakOnce()
  },
  handleReplay() {
    this.startPlayback()
  },
  handlePause() {
    this.stopPlayback(true)
  },
  handlePrev() {
    if (this.data.currentIndex <= 0) return
    this.stopPlayback(false)
    const nextIndex = this.data.currentIndex - 1
    const nextWord = this.data.words[nextIndex]
    this.setData({
      currentIndex: nextIndex,
      progressWidth: this.getProgressWidth(nextIndex, this.data.words.length),
      currentHint: this.getHintText(nextWord),
      playCount: 0,
    }, () => this.startPlayback())
  },
  handleNext() {
    if (this.data.currentIndex >= this.data.words.length - 1) return
    this.stopPlayback(false)
    const nextIndex = this.data.currentIndex + 1
    const nextWord = this.data.words[nextIndex]
    this.setData({
      currentIndex: nextIndex,
      progressWidth: this.getProgressWidth(nextIndex, this.data.words.length),
      currentHint: this.getHintText(nextWord),
      playCount: 0,
    }, () => this.startPlayback())
  },
  handleSpeechRateChange(event) {
    this.setData({ speechRate: Number(event.detail.value) })
  },
  handleRepeatChange(event) {
    const repeatTimes = Number(event.currentTarget.dataset.value)
    this.setData({ repeatTimes, repeatOptions: this.buildRepeatOptions(repeatTimes) })
  },
  handleFinish() {
    const itemIds = this.data.words.map((item) => item.id)
    this.stopPlayback(false)
    saveCurrentSession({ textbookId: this.data.textbookId, lessonId: this.data.lessonId, startTime: this.data.sessionStartTime, itemIds })
    wx.navigateTo({ url: '/pages/grading/grading' })
  },
})
