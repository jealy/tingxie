import type { ITextbook } from '@/types';

interface ITextbookCardProps {
  textbook: ITextbook;
  lessonCount: number;
  wordCount: number;
  onClick: () => void;
}

const TextbookCard = ({ textbook, lessonCount, wordCount, onClick }: ITextbookCardProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-card p-4 shadow-card flex items-center gap-4 min-h-touch active:scale-98 transition-transform"
    >
      <div
        className="w-16 h-20 rounded-xl flex items-center justify-center text-3xl"
        style={{ backgroundColor: textbook.coverColor + '20' }}
      >
        📖
      </div>
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold text-text-primary">{textbook.name}</h3>
        <p className="text-sm text-text-secondary mt-1">
          {lessonCount}课 · {wordCount}词
        </p>
      </div>
      <span className="text-text-secondary">›</span>
    </button>
  );
};

export default TextbookCard;
