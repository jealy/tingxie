import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, SkipBack, SkipForward, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLessonStore, useWordStore, useSettingsStore } from '@/store';

const DictationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = useLessonStore((state) => state.getLessonById(id!));
  const words = useWordStore((state) => state.getWordsByLessonId(id!));
  const settings = useSettingsStore((state) => state.settings);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(settings.defaultSpeechRate);
  const [repeatTimes, setRepeatTimes] = useState<number>(settings.defaultRepeatTimes);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const currentWord = words[currentIndex];

  const speak = useCallback((text: string, rate: number, repeat: number) => {
    if (!('speechSynthesis' in window)) {
      alert('浏览器不支持语音朗读，请使用 Chrome 或 Safari');
      return;
    }

    const synth = window.speechSynthesis;
    synthRef.current = synth;
    synth.cancel();

    let count = 0;

    const speakWord = () => {
      if (count >= repeat) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = 'zh-CN';

      utterance.onend = () => {
        count++;
        if (count < repeat) {
          setTimeout(speakWord, 2000);
        } else {
          setIsPlaying(false);
        }
      };

      synth.speak(utterance);
    };

    setIsPlaying(true);
    speakWord();
  }, []);

  useEffect(() => {
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    if (currentWord && !isPlaying) {
      const timer = setTimeout(() => {
        speak(currentWord.content, speechRate, repeatTimes);
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentWord]);

  const handlePlay = () => {
    if (currentWord) {
      speak(currentWord.content, speechRate, repeatTimes);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleEnd = () => {
    synthRef.current?.cancel();
    navigate(`/grading/${id}`, { state: { wordIds: words.map((w) => w.id) } });
  };

  if (!lesson || words.length === 0) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <p className="text-text-secondary">没有可听写的词条</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary">
            返回
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={handleEnd}
          className="flex items-center gap-1 text-text-secondary"
        >
          <X size={20} />
          <span>结束</span>
        </button>
        <span className="text-sm text-text-secondary">
          {currentIndex + 1} / {words.length}
        </span>
      </header>

      <main className="flex flex-col items-center justify-center flex-1 px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-card-lg p-10 shadow-card mb-6 flex items-center justify-center min-h-[180px]">
            <p className="text-5xl font-bold text-text-primary tracking-wide">
              {isPlaying && <span className="animate-pulse">🎧</span>}
              {currentWord?.content}
            </p>
          </div>

          {currentWord?.hint && (
            <p className="text-center text-text-secondary mb-8">{currentWord.hint}</p>
          )}

          <div className="bg-white rounded-card p-5 shadow-card mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-primary">语速</span>
              <span className="text-sm text-text-secondary">{speechRate.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full accent-primary"
            />

            <div className="flex justify-between items-center mt-4 mb-2">
              <span className="text-sm text-text-primary">重复次数</span>
              <span className="text-sm text-text-secondary">{repeatTimes}次</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setRepeatTimes(num)}
                  className={`flex-1 py-2 rounded-full text-sm transition-colors ${
                    repeatTimes === num
                      ? 'bg-primary text-white'
                      : 'bg-background text-text-primary'
                  }`}
                >
                  {num}次
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 bg-white rounded-card p-4 shadow-card flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <SkipBack size={20} className="text-text-primary" />
            </button>
            <button
              onClick={handlePlay}
              className="flex-1 bg-primary text-white rounded-card p-5 shadow-btn-primary flex items-center justify-center gap-2"
            >
              <Volume2 size={24} />
              <span className="font-medium">播放</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === words.length - 1}
              className="flex-1 bg-white rounded-card p-4 shadow-card flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <SkipForward size={20} className="text-text-primary" />
            </button>
          </div>

          <button
            onClick={handleEnd}
            className="w-full mt-4 py-3 text-center text-text-secondary text-sm"
          >
            结束听写，进入批改
          </button>
        </div>
      </main>
    </Layout>
  );
};

export default DictationPage;
