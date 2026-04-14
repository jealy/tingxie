import { useState } from 'react';
import { useWordStore } from '@/store';
import type { IWordType } from '@/types';

interface AddWordFormProps {
  lessonId: string;
  onSuccess?: () => void;
}

const AddWordForm = ({ lessonId, onSuccess }: AddWordFormProps) => {
  const addWord = useWordStore((state) => state.addWord);
  const [type, setType] = useState<IWordType>('hanzi');
  const [content, setContent] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [hint, setHint] = useState('');
  const [extra, setExtra] = useState({ author: '', fullText: '', example: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addWord({
      lessonId,
      type,
      content: content.trim(),
      pronunciation: pronunciation.trim() || undefined,
      hint: hint.trim() || undefined,
      extra: extra.author || extra.fullText || extra.example ? {
        author: extra.author || undefined,
        fullText: extra.fullText || undefined,
        example: extra.example || undefined,
      } : undefined,
    });

    setContent('');
    setPronunciation('');
    setHint('');
    setExtra({ author: '', fullText: '', example: '' });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">词条类型</label>
        <div className="flex gap-2">
          {[
            { value: 'hanzi', label: '汉字' },
            { value: 'ciyu', label: '词语' },
            { value: 'english', label: '英语' },
            { value: 'poetry', label: '古诗' },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setType(item.value as IWordType)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                type === item.value
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          {type === 'english' ? '单词' : type === 'poetry' ? '标题' : '内容'}
          <span className="text-danger ml-1">*</span>
        </label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === 'hanzi' ? '如：天' :
            type === 'ciyu' ? '如：天空' :
            type === 'english' ? '如：apple' :
            '如：静夜思'
          }
          className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
          autoFocus
        />
      </div>

      {(type === 'hanzi' || type === 'ciyu') && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            拼音 {type === 'hanzi' && <span className="text-text-hint">(选填)</span>}
          </label>
          <input
            type="text"
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            placeholder="如：tiān kōng"
            className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      {type === 'english' && (
        <>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">音标 (选填)</label>
            <input
              type="text"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              placeholder="如：/ˈæpl/"
              className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">释义 (选填)</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="如：苹果"
              className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">例句 (选填)</label>
            <input
              type="text"
              value={extra.example}
              onChange={(e) => setExtra({ ...extra, example: e.target.value })}
              placeholder="如：I have an apple."
              className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </>
      )}

      {type === 'poetry' && (
        <>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">作者 (选填)</label>
            <input
              type="text"
              value={extra.author}
              onChange={(e) => setExtra({ ...extra, author: e.target.value })}
              placeholder="如：李白"
              className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">全文 <span className="text-danger ml-1">*</span></label>
            <textarea
              value={extra.fullText}
              onChange={(e) => setExtra({ ...extra, fullText: e.target.value })}
              placeholder="如：床前明月光，疑是地上霜。举头望明月，低头思故乡。"
              rows={3}
              className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
        </>
      )}

      {(type === 'hanzi' || type === 'ciyu') && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">提示 (选填)</label>
          <input
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="如：天空的天"
            className="w-full px-4 py-3 bg-background rounded-xl text-text-primary placeholder:text-text-hint focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={!content.trim() || (type === 'poetry' && !extra.fullText.trim())}
        className="w-full py-4 bg-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        添加词条
      </button>
    </form>
  );
};

export default AddWordForm;
