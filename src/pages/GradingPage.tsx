import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Camera, Check, X, CheckCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useWordStore, useRecordStore } from '@/store';

const GradingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const wordStore = useWordStore((state) => state);
  const addRecord = useRecordStore((state) => state.addRecord);

  const wordIds = (location.state as { wordIds: string[] })?.wordIds || [];
  const words = wordIds.map((id: string) => wordStore.getWordById(id)).filter(Boolean);

  const [results, setResults] = useState<Record<string, boolean>>({});
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const correctCount = Object.values(results).filter(Boolean).length;
  const totalCount = words.length;
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  const handleCorrect = (wordId: string, isCorrect: boolean) => {
    setResults((prev) => ({ ...prev, [wordId]: isCorrect }));
  };

  const handleMarkAllCorrect = () => {
    const allCorrect: Record<string, boolean> = {};
    words.forEach((word) => {
      if (word) allCorrect[word.id] = true;
    });
    setResults(allCorrect);
  };

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch {
      alert('无法访问摄像头，请检查权限设置');
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      const url = canvas.toDataURL('image/jpeg', 0.8);
      setPhotoUrl(url);

      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      setShowCamera(false);
    }
  };

  const handleFinish = () => {
    const textbookId = '';
    const lessonId = wordIds[0] || '';

    addRecord({
      textbookId,
      lessonId,
      startTime: Date.now() - 600000,
      endTime: Date.now(),
      itemIds: wordIds,
      results,
      photoUrl: photoUrl || undefined,
    });

    navigate('/');
  };

  return (
    <Layout>
      <header className="px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center"
        >
          <X size={22} className="text-text-primary" />
        </button>
        <h1 className="text-xl font-semibold text-text-primary">批改</h1>
      </header>

      <section className="px-6 mb-4">
        <h2 className="text-base font-medium text-text-primary mb-3">拍照对照</h2>
        <div className="bg-white rounded-card p-4 shadow-card">
          {photoUrl ? (
            <div className="relative">
              <img src={photoUrl} alt="拍照" className="w-full rounded-xl" />
              <button
                onClick={() => setPhotoUrl(null)}
                className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-sm text-text-primary"
              >
                重拍
              </button>
            </div>
          ) : showCamera ? (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl" />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowCamera(false)}
                  className="flex-1 py-2 bg-background text-text-primary rounded-full"
                >
                  取消
                </button>
                <button
                  onClick={handleCapture}
                  className="flex-1 py-2 bg-primary text-white rounded-full"
                >
                  拍照
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleTakePhoto}
              className="w-full py-10 border-2 border-dashed border-border-color rounded-xl text-center"
            >
              <Camera size={32} className="mx-auto text-text-hint mb-2" />
              <p className="text-text-secondary">点击拍照</p>
              <p className="text-xs text-text-hint mt-1">请将听写本放在框内</p>
            </button>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </section>

      <section className="px-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-medium text-text-primary">批改清单</h2>
          <button
            onClick={handleMarkAllCorrect}
            className="flex items-center gap-1 px-3 py-1 text-sm text-success border border-success rounded-full"
          >
            <CheckCircle size={14} />
            一键全对
          </button>
        </div>

        <div className="space-y-2">
          {words.map((word, index) => (
            <div
              key={word?.id}
              className="bg-white rounded-card p-4 shadow-card flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-text-hint w-6">{index + 1}.</span>
                <div>
                  <p className="text-text-primary font-medium">{word?.content}</p>
                  {word?.pronunciation && (
                    <p className="text-xs text-text-secondary">{word.pronunciation}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCorrect(word!.id, true)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    results[word!.id] === true
                      ? 'bg-success text-white'
                      : 'bg-success/10 text-success'
                  }`}
                >
                  <Check size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => handleCorrect(word!.id, false)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    results[word!.id] === false
                      ? 'bg-danger text-white'
                      : 'bg-danger/10 text-danger'
                  }`}
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border-color">
        <div className="text-center mb-3">
          <p className="text-lg text-text-primary">
            正确率：<span className={accuracy >= 80 ? 'text-success' : accuracy >= 50 ? 'text-primary' : 'text-danger'}>{accuracy}%</span>
            ({correctCount}/{totalCount})
          </p>
        </div>
        <button
          onClick={handleFinish}
          className="w-full py-4 bg-primary text-white rounded-card text-lg font-medium shadow-btn-primary flex items-center justify-center gap-2"
        >
          <CheckCircle size={22} />
          完成批改
        </button>
      </footer>
    </Layout>
  );
};

export default GradingPage;
