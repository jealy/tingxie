import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Headphones, Settings } from 'lucide-react';

const TabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', label: '首页', icon: Home },
    { path: '/dictation', label: '听写', icon: Headphones },
    { path: '/settings', label: '设置', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-color safe-area-pb">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center px-6 py-2 rounded-xl min-w-touch min-h-touch transition-all ${
                isActive(tab.path) ? 'text-primary' : 'text-text-hint'
              }`}
            >
              <Icon size={22} strokeWidth={isActive(tab.path) ? 2.5 : 1.8} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar;
