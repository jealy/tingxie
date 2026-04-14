import { ChevronRight, Volume2, Repeat, Download, RotateCcw, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TabBar from '@/components/layout/TabBar';

const SettingsPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <header className="px-6 pb-6 pt-8">
          <h1 className="text-2xl font-bold text-text-primary">设置</h1>
          <p className="mt-1 text-sm text-text-secondary">个性化配置，数据管理</p>
        </header>

        <main className="px-6 space-y-5 pb-8">
          <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="px-4 py-3 bg-gradient-to-r from-primary/8 to-primary/3">
              <h2 className="text-sm font-medium text-primary">语音设置</h2>
            </div>
            <div className="divide-y divide-border-color/60">
              <button className="w-full px-4 py-4 flex items-center justify-between transition-colors hover:bg-primary/5 active:bg-primary/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-inner">
                    <Volume2 size={20} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="text-base font-medium text-text-primary">默认语速</span>
                    <p className="text-xs text-text-hint mt-0.5">调节朗读时的播放速度</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">1.0x</span>
                  <ChevronRight size={18} className="text-text-hint" />
                </div>
              </button>
              <button className="w-full px-4 py-4 flex items-center justify-between transition-colors hover:bg-info/5 active:bg-info/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-info/20 to-info/10 shadow-inner">
                    <Repeat size={20} className="text-info" />
                  </div>
                  <div className="text-left">
                    <span className="text-base font-medium text-text-primary">默认重复次数</span>
                    <p className="text-xs text-text-hint mt-0.5">每个字词朗读的遍数</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-info">2次</span>
                  <ChevronRight size={18} className="text-text-hint" />
                </div>
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="px-4 py-3 bg-gradient-to-r from-success/8 to-success/3">
              <h2 className="text-sm font-medium text-success">数据管理</h2>
            </div>
            <div className="divide-y divide-border-color/60">
              <button className="w-full px-4 py-4 flex items-center justify-between transition-colors hover:bg-success/5 active:bg-success/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/10 shadow-inner">
                    <Download size={20} className="text-success" />
                  </div>
                  <div className="text-left">
                    <span className="text-base font-medium text-text-primary">导出全部数据</span>
                    <p className="text-xs text-text-hint mt-0.5">生成 JSON 格式备份文件</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-hint" />
              </button>
              <button className="w-full px-4 py-4 flex items-center justify-between transition-colors hover:bg-info/5 active:bg-info/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-info/20 to-info/10 shadow-inner">
                    <RotateCcw size={20} className="text-info" />
                  </div>
                  <div className="text-left">
                    <span className="text-base font-medium text-text-primary">重置为示例数据</span>
                    <p className="text-xs text-text-hint mt-0.5">恢复内置的演示课本</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-hint" />
              </button>
              <button className="w-full px-4 py-4 flex items-center justify-between transition-colors hover:bg-danger/5 active:bg-danger/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-danger/20 to-danger/10 shadow-inner">
                    <Trash2 size={20} className="text-danger" />
                  </div>
                  <div className="text-left">
                    <span className="text-base font-medium text-danger">清空所有数据</span>
                    <p className="text-xs text-text-hint mt-0.5">不可恢复，请谨慎操作</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-text-hint" />
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg shadow-primary/30">
                  <span className="text-xl font-semibold text-white">宁</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-text-primary">关于</h2>
                  <p className="text-sm text-text-secondary mt-1">版本 1.0.0</p>
                  <div className="mt-3 rounded-xl bg-primary/5 p-3">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      <span className="font-medium text-primary">宁听</span> - 小学生专属听写助手<br/>
                      数据完全本地化存储，保护隐私安全
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <TabBar />
      </div>
    </Layout>
  );
};

export default SettingsPage;