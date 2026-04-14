const { createId } = require('./id')

function buildSampleAppData() {
  const now = Date.now()
  const textbookId = createId('tb')
  const lessonOneId = createId('lesson')
  const lessonTwoId = createId('lesson')

  return {
    version: '1.0.0',
    textbooks: [
      {
        id: textbookId,
        name: '部编版语文一年级上册',
        subject: 'chinese',
        grade: 1,
        term: 1,
        coverColor: '#FF9A62',
        createdAt: now,
        updatedAt: now,
      },
    ],
    lessons: [
      {
        id: lessonOneId,
        textbookId,
        name: '识字（一）',
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: lessonTwoId,
        textbookId,
        name: '课文 1 秋天',
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
    ],
    words: [
      { id: createId('word'), lessonId: lessonOneId, type: 'hanzi', content: '天', pronunciation: 'tian', hint: '天空的天', order: 1, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonOneId, type: 'hanzi', content: '地', pronunciation: 'di', hint: '大地的地', order: 2, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonOneId, type: 'hanzi', content: '人', pronunciation: 'ren', hint: '大人的人', order: 3, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonOneId, type: 'hanzi', content: '手', pronunciation: 'shou', hint: '小手的手', order: 4, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonOneId, type: 'hanzi', content: '山', pronunciation: 'shan', hint: '高山的山', order: 5, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonTwoId, type: 'ciyu', content: '秋天', pronunciation: 'qiu tian', hint: '秋天的秋天', order: 1, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonTwoId, type: 'ciyu', content: '天气', pronunciation: 'tian qi', hint: '天气的天气', order: 2, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonTwoId, type: 'ciyu', content: '树叶', pronunciation: 'shu ye', hint: '树叶的树叶', order: 3, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonTwoId, type: 'ciyu', content: '天空', pronunciation: 'tian kong', hint: '天空的天空', order: 4, createdAt: now, updatedAt: now },
      { id: createId('word'), lessonId: lessonTwoId, type: 'ciyu', content: '丰收', pronunciation: 'feng shou', hint: '丰收的丰收', order: 5, createdAt: now, updatedAt: now },
    ],
    records: [],
    settings: {
      defaultSpeechRate: 1,
      defaultRepeatTimes: 2,
      theme: 'light',
    },
  }
}

module.exports = {
  buildSampleAppData,
}
