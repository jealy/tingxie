import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Modal from '@/components/common/Modal';
import AddLessonForm from '@/components/common/AddLessonForm';
import { useTextbookStore, useLessonStore, useWordStore } from '@/store';

const TextbookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const textbook = useTextbookStore((state) => state.getTextbookById(id!));
  const lessons = useLessonStore((state) => state.getLessonsByTextbookId(id!));
  const words = useWordStore((state) => state.words);
  const [showAddModal, setShowAddModal] = useState(false);

  if (!textbook) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <p className="text-text-secondary">课本不存在</p>
          <button onClick={() => navigate('/')} className="mt-4 text-primary">
            返回首页
          </button>
        </div>
      </Layout>
    );
  }

  const getWordCount = (lessonId: string) => {
    return words.filter((w) => w.lessonId === lessonId).length;
  };

  return (
    <Layout>
      <header className="px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center"
        >
          <ChevronLeft size={22} className="text-text-primary" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-text-primary">{textbook.name}</h1>
          <p className="text-sm text-text-secondary">
            {textbook.grade}年级 {textbook.term === 1 ? '上' : '下'}册
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 rounded-full bg-primary shadow-btn-primary flex items-center justify-center"
        >
          <Plus size={20} className="text-white" />
        </button>
      </header>

      <section className="px-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">课程列表</h2>

        <div className="space-y-3">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              className="w-full bg-white rounded-card p-4 shadow-card flex items-center justify-between active:scale-99 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen size={22} className="text-primary" />
                </div>
                <span className="text-text-primary font-medium">{lesson.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">{getWordCount(lesson.id)}词</span>
                <ChevronRight size={18} className="text-text-hint" />
              </div>
            </button>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen size={36} className="text-primary" />
            </div>
            <p className="text-text-secondary">还没有课程</p>
            <p className="text-sm text-text-hint mt-1">点击右上角添加课程</p>
          </div>
        )}
      </section>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="添加课程">
        <AddLessonForm textbookId={id!} onSuccess={() => setShowAddModal(false)} />
      </Modal>
    </Layout>
  );
};

export default TextbookPage;
