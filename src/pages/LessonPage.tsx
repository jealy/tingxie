import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, FileText, Type, AlignLeft, Languages, Feather } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Modal from '@/components/common/Modal';
import AddWordForm from '@/components/common/AddWordForm';
import { useLessonStore, useWordStore } from '@/store';
import type { IWordType } from '@/types';

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = useLessonStore((state) => state.getLessonById(id!));
  const words = useWordStore((state) => state.getWordsByLessonId(id!));
  const [showAddModal, setShowAddModal] = useState(false);

  if (!lesson) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <p className="text-text-secondary">课程不存在</p>
          <button onClick={() => navigate('/')} className="mt-4 text-primary">
            返回首页
          </button>
        </div>
      </Layout>
    );
  }

  const getTypeConfig = (type: IWordType) => {
    const configs: Record<IWordType, { icon: typeof FileText; color: string; label: string }> = {
      hanzi: { icon: Type, color: 'text-orange-500 bg-orange-50', label: '汉字' },
      ciyu: { icon: AlignLeft, color: 'text-green-500 bg-green-50', label: '词语' },
      english: { icon: Languages, color: 'text-blue-500 bg-blue-50', label: '英语' },
      poetry: { icon: Feather, color: 'text-purple-500 bg-purple-50', label: '古诗' },
    };
    return configs[type];
  };

  return (
    <Layout>
      <header className="px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center"
        >
          <ChevronLeft size={22} className="text-text-primary" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-text-primary">{lesson.name}</h1>
          <p className="text-sm text-text-secondary">共 {words.length} 个词条</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 rounded-full bg-primary shadow-btn-primary flex items-center justify-center"
        >
          <Plus size={20} className="text-white" />
        </button>
      </header>

      <section className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-primary">词条列表</h2>
          {words.length > 0 && (
            <button
              onClick={() => navigate(`/dictation/${id}`)}
              className="px-4 py-2 bg-primary text-white text-sm rounded-full shadow-btn-primary"
            >
              开始听写
            </button>
          )}
        </div>

        <div className="space-y-2">
          {words.map((word, index) => {
            const typeConfig = getTypeConfig(word.type);
            const TypeIcon = typeConfig.icon;
            return (
              <div
                key={word.id}
                className="bg-white rounded-card p-4 shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-hint w-6">{index + 1}.</span>
                  <div>
                    <p className="text-text-primary font-medium">{word.content}</p>
                    {word.pronunciation && (
                      <p className="text-xs text-text-secondary mt-0.5">{word.pronunciation}</p>
                    )}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                  <TypeIcon size={12} />
                  {typeConfig.label}
                </span>
              </div>
            );
          })}
        </div>

        {words.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText size={36} className="text-primary" />
            </div>
            <p className="text-text-secondary">还没有词条</p>
            <p className="text-sm text-text-hint mt-1">点击右上角添加词条</p>
          </div>
        )}
      </section>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="添加词条">
        <AddWordForm lessonId={id!} onSuccess={() => setShowAddModal(false)} />
      </Modal>
    </Layout>
  );
};

export default LessonPage;
