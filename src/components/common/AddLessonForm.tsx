import { useState } from 'react';
import { useLessonStore } from '@/store';

interface AddLessonFormProps {
  textbookId: string;
  onSuccess?: () => void;
}

const AddLessonForm = ({ textbookId, onSuccess }: AddLessonFormProps) => {
  const addLesson = useLessonStore((state) => state.addLesson);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addLesson({
      textbookId,
      name: name.trim(),
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">课程名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="如：第1课 秋天"
          className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
          autoFocus
        />
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full mt-5 py-4 bg-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        创建课程
      </button>
    </form>
  );
};

export default AddLessonForm;
