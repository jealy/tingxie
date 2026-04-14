import { useState } from 'react';
import { useTextbookStore } from '@/store';
import type { ITextbook } from '@/types';

interface AddTextbookFormProps {
  onSuccess?: () => void;
}

const COLORS = ['#FF9A62', '#5FDD9D', '#88B9F2', '#FF8A8A', '#9B8AFB', '#FBC267'];

const AddTextbookForm = ({ onSuccess }: AddTextbookFormProps) => {
  const addTextbook = useTextbookStore((state) => state.addTextbook);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<ITextbook['subject']>('chinese');
  const [grade, setGrade] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [term, setTerm] = useState<1 | 2>(1);
  const [coverColor, setCoverColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTextbook({
      name: name.trim(),
      subject,
      grade,
      term,
      coverColor,
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">课本名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="如：部编版语文一年级上册"
          className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">学科</label>
        <div className="flex gap-2">
          {[
            { value: 'chinese', label: '语文' },
            { value: 'english', label: '英语' },
            { value: 'poetry', label: '古诗' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSubject(item.value as ITextbook['subject'])}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                subject === item.value
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">年级</label>
          <select
            value={grade}
            onChange={(e) => setGrade(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6)}
            className="w-full px-4 py-3 bg-background rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>{g}年级</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">学期</label>
          <div className="flex gap-2">
            {[1, 2].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t as 1 | 2)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                  term === t
                    ? 'bg-primary text-white'
                    : 'bg-background text-text-primary'
                }`}
              >
                {t === 1 ? '上册' : '下册'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">封面颜色</label>
        <div className="flex gap-3">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setCoverColor(color)}
              className={`w-10 h-10 rounded-xl transition-transform ${
                coverColor === color ? 'scale-110 ring-2 ring-offset-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full py-4 bg-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        创建课本
      </button>
    </form>
  );
};

export default AddTextbookForm;
