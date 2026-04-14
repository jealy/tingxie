import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TabBar from '@/components/layout/TabBar';
import Modal from '@/components/common/Modal';
import AddTextbookForm from '@/components/common/AddTextbookForm';
import { useTextbookStore, useLessonStore, useWordStore, useRecordStore } from '@/store';

const HomePage = () => {
  const navigate = useNavigate();
  const textbooks = useTextbookStore((state) => state.textbooks);
  const lessons = useLessonStore((state) => state.lessons);
  const words = useWordStore((state) => state.words);
  const records = useRecordStore((state) => state.records);
  const [showAddModal, setShowAddModal] = useState(false);

  const today = new Date().toDateString();
  const todayRecords = records.filter((r) => new Date(r.endTime).toDateString() === today);
  const todayDictationCount = todayRecords.length;
  const todayAccuracy = todayRecords.length > 0
    ? Math.round(todayRecords.reduce((sum, r) => {
        const correct = Object.values(r.results).filter(Boolean).length;
        const total = Object.values(r.results).length;
        return sum + (total > 0 ? correct / total : 0);
      }, 0) / todayRecords.length * 100)
    : 0;

  const getLessonCount = (textbookId: string) =>
    lessons.filter((l) => l.textbookId === textbookId).length;

  const getWordCount = (textbookId: string) => {
    const lessonIds = lessons
      .filter((l) => l.textbookId === textbookId)
      .map((l) => l.id);
    return words.filter((w) => lessonIds.includes(w.lessonId)).length;
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/10 to-background">
        <header className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">宁听</h1>
              <p className="text-sm text-text-secondary mt-1">
                {new Date().getHours() < 12 ? '上午好' : new Date().getHours() < 18 ? '下午好' : '晚上好'}，小朋友
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xl font-medium">
              宁
            </div>
          </div>
        </header>

        <section className="px-6 -mt-2">
          <div className="bg-white rounded-card-lg p-5 shadow-card">
            <div className="flex gap-3">
              <div className="flex-1 text-center py-3">
                <p className="text-2xl font-bold text-primary">{todayDictationCount}</p>
                <p className="text-xs text-text-secondary mt-1">今日听写</p>
              </div>
              <div className="w-px bg-border-color" />
              <div className="flex-1 text-center py-3">
                <p className="text-2xl font-bold text-success">{todayAccuracy > 0 ? todayAccuracy + '%' : '--'}</p>
                <p className="text-xs text-text-secondary mt-1">正确率</p>
              </div>
              <div className="w-px bg-border-color" />
              <div className="flex-1 text-center py-3">
                <p className="text-2xl font-bold text-info">{words.length}</p>
                <p className="text-xs text-text-secondary mt-1">已学词数</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-primary">我的课本</h2>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const text = await file.text();
                    try {
                      const data = JSON.parse(text);
                      console.log('导入数据:', data);
                      alert('导入成功（功能开发中）');
                    } catch {
                      alert('文件格式错误');
                    }
                  }
                };
                input.click();
              }}
              className="text-sm text-text-secondary"
            >
              导入
            </button>
            <button
              onClick={() => {
                const data = {
                  textbooks,
                  lessons,
                  words,
                  records,
                  settings: {},
                  version: '1.0.0',
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ning-ting-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-sm text-text-secondary"
            >
              导出
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {textbooks.map((textbook) => (
            <button
              key={textbook.id}
              onClick={() => navigate(`/textbook/${textbook.id}`)}
              className="w-full bg-white rounded-card p-4 shadow-card flex items-center gap-4 active:scale-99 transition-transform"
            >
              <div
                className="w-14 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: textbook.coverColor + '15' }}
              >
                <BookOpen size={28} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-medium text-text-primary">{textbook.name}</h3>
                <p className="text-sm text-text-secondary mt-0.5">
                  {getLessonCount(textbook.id)}课 · {getWordCount(textbook.id)}词
                </p>
              </div>
              <ChevronRight size={20} className="text-text-hint" />
            </button>
          ))}
        </div>

        {textbooks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen size={36} className="text-primary" />
            </div>
            <p className="text-text-secondary">还没有课本</p>
            <p className="text-sm text-text-hint mt-1">点击下方添加</p>
          </div>
        )}
      </section>

      <div className="px-6 mt-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-primary text-white rounded-card py-4 shadow-btn-primary flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} />
          <span>添加新课本</span>
        </button>
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="添加课本">
        <AddTextbookForm onSuccess={() => setShowAddModal(false)} />
      </Modal>

      <TabBar />
    </Layout>
  );
};

export default HomePage;
