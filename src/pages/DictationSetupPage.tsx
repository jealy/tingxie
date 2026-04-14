import { Headphones, Edit3, BookOpen, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import TabBar from '@/components/layout/TabBarApp'

const DictationSetupPage = () => {
  const navigate = useNavigate()

  return (
    <Layout>
      <header className="px-6 pb-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg">
            <Headphones size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">开始听写</h1>
            <p className="text-sm text-text-secondary">选择一种方式，练习听写</p>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-6 pb-8">
        <button
          type="button"
          onClick={() => navigate('/dictation/free')}
          className="group relative w-full overflow-hidden rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg active:scale-99"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-lg">
              <Edit3 size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-text-primary">自由听写</p>
                <Sparkles size={14} className="text-primary" />
              </div>
              <p className="mt-1 text-sm text-text-secondary">输入任意内容，想听什么就听什么</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dictation/select')}
          className="group relative w-full overflow-hidden rounded-2xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-lg active:scale-99"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-success/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-gradient-to-br from-success/80 to-success shadow-lg">
              <BookOpen size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-text-primary">选课听写</p>
              <p className="mt-1 text-sm text-text-secondary">从课本课文中选择，系统自动朗读</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 transition-colors group-hover:bg-success/20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-success">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </button>

        <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-primary/8 to-primary/3 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Headphones size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">小提示</p>
            <p className="mt-1 text-xs text-text-secondary leading-relaxed">
              听写过程中可随时调节语速和重复次数，也可以在中途暂停或跳过。
            </p>
          </div>
        </div>
      </main>

      <TabBar />
    </Layout>
  )
}

export default DictationSetupPage
