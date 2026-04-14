import { Headphones, Settings, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const TabBarApp = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { path: '/my', label: '我的', icon: User },
    { path: '/', label: '听写', icon: Headphones, isCenter: true },
    { path: '/settings', label: '设置', icon: Settings },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border-color bg-white/80 backdrop-blur-lg safe-area-pb">
      <div className="flex items-end justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = isActive(tab.path)
          const isCenter = tab.isCenter

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center justify-end transition-all duration-200 ${
                isCenter ? 'mb-1' : 'mb-0'
              }`}
            >
              {active && (
                <div
                  className={`absolute ${isCenter ? 'w-16 h-16 -top-4 rounded-full shadow-lg' : 'w-12 h-12 top-0 rounded-xl'} bg-primary transition-all duration-300`}
                />
              )}
              <div className={`relative z-10 flex flex-col items-center transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                <div className={`rounded-full p-2 transition-all duration-200 ${active && isCenter ? 'bg-white/20' : ''}`}>
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={`transition-colors duration-200 ${active ? 'text-white' : 'text-text-hint'}`}
                  />
                </div>
                <span
                  className={`mt-1 text-xs font-medium transition-colors duration-200 ${
                    active ? 'text-primary' : 'text-text-hint'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabBarApp
