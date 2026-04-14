# 宁听 (ning-ting) 项目约束规则

> 本文档为「宁听」项目的开发约束规则，所有开发者必须严格遵守。

---

## 一、开发原则（核心准则）

### 必须遵守
- ✅ **严格按需求文档功能点开发，不自行增减**
- ✅ **优先实现 P0 优先级功能，P1/P2 后置**
- ✅ **所有数据操作必须同步到 localStorage**
- ✅ **移动端优先，触控区域 ≥ 44x44px**
- ✅ **语音朗读失败必须给出友好提示**
- ✅ **所有全局状态通过 Zustand 管理**
- ✅ **localStorage 持久化自动同步**
- ✅ **禁止在组件内直接操作 localStorage**

### 禁止行为
- ❌ 禁止使用 `any` 类型
- ❌ 禁止使用 `var`，只允许 `const` / `let`
- ❌ 禁止在组件内直接读写 localStorage
- ❌ 禁止自行添加需求文档外的功能
- ❌ 禁止使用 `!important` 覆盖样式

---

## 二、命名规范

### 文件命名
| 类型 | 规范 | 示例 |
|------|------|------|
| React 组件 | PascalCase + .tsx | `DictationPage.tsx` |
| 组件样式 | 同名 + .module.css | `DictationPage.module.css` |
| 类型文件 | PascalCase + .ts | `types/Textbook.ts` |
| 工具函数 | camelCase + .ts | `utils/storage.ts` |
| Hooks | camelCase + .ts | `hooks/useTTS.ts` |

### 代码命名
| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `TextbookCard` |
| 函数/变量 | camelCase | `handleSubmit` |
| 常量 | UPPER_SNAKE_CASE | `MAX_WORDS_COUNT` |
| 类型/接口 | PascalCase + I前缀 | `ITextbook` |
| 枚举 | PascalCase | `WordType` |
| 枚举值 | UPPER_SNAKE_CASE | `WordType.HANZI` |

---

## 三、React 组件规范

### 组件结构
```tsx
// 1. 类型定义（必须）
interface IProps {
  title: string;
}

// 2. 组件定义
const MyComponent: React.FC<IProps> = ({ title }) => {
  // 3. Hooks
  // 4. 状态
  // 5. 副作用
  // 6. 事件处理
  // 7. 渲染
  return <div>{title}</div>;
};

// 8. 默认 Props（可选）
MyComponent.defaultProps = {};

export default MyComponent;
```

### 规则
- 必须使用**函数组件 + Hooks**
- Props 必须定义 `interface`
- 组件文件与样式文件**同名**
- 组件导出使用 `export default`
- 事件处理函数以 `handle` 开头
- 布尔值变量使用 `is` / `has` / `can` 前缀

---

## 四、目录结构

```
ning-ting/
├── public/                 # 静态公共资源
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # 资源文件
│   │   └── images/
│   ├── components/          # 公共组件
│   │   ├── common/         # 通用组件（Button, Card, Modal）
│   │   └── layout/         # 布局组件
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useTTS.ts       # 语音朗读
│   │   ├── useCamera.ts    # 拍照
│   │   └── useLocalStorage.ts
│   ├── pages/              # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── TextbookPage.tsx
│   │   ├── LessonPage.tsx
│   │   ├── WordPage.tsx
│   │   ├── DictationPage.tsx
│   │   ├── GradingPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/              # Zustand 状态管理
│   │   ├── index.ts        # 导出所有 store
│   │   ├── textbookStore.ts
│   │   ├── lessonStore.ts
│   │   ├── wordStore.ts
│   │   ├── recordStore.ts
│   │   └── settingsStore.ts
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 所有类型汇总
│   ├── utils/              # 工具函数
│   │   └── sampleData.ts   # 示例数据
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   ├── index.css           # Tailwind 全局样式
│   └── vite-env.d.ts
├── .eslintrc.json          # ESLint 配置
├── .gitignore
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js       # PostCSS 配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.app.json       # TypeScript 应用配置
├── tsconfig.json           # TypeScript 主配置
├── tsconfig.node.json      # TypeScript Node 配置
├── vite.config.ts          # Vite 配置
└── PROJECT_RULES.md       # 项目约束规则
```

---

## 五、状态管理规范

### Zustand Store 结构
```typescript
// store/textbookStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ITextbook } from '@/types/textbook';

interface ITextbookStore {
  textbooks: ITextbook[];
  addTextbook: (textbook: Omit<ITextbook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTextbook: (id: string, data: Partial<ITextbook>) => void;
  deleteTextbook: (id: string) => void;
}

export const useTextbookStore = create<ITextbookStore>()(
  persist(
    (set) => ({
      textbooks: [],
      addTextbook: (data) =>
        set((state) => ({
          textbooks: [
            ...state.textbooks,
            {
              ...data,
              id: nanoid(),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          ],
        })),
      // ... 其他方法
    }),
    { name: 'textbook-storage' }
  )
);
```

### 规则
- 所有全局状态通过 **Zustand** 管理
- 使用 `persist` middleware 实现 localStorage 持久化
- **禁止**在组件内直接操作 localStorage
- Store 分割：按功能模块拆分（textbook/lesson/word 等）

---

## 六、样式规范

### Tailwind CSS
```tsx
// ✅ 正确使用 design token
<div className="bg-primary text-primary rounded-24px">

// ❌ 禁止硬编码颜色
<div className="bg-[#FF9A62] text-[#3C3C3C]">
```

### 圆角规范（按需求文档）
| 元素 | 圆角 |
|------|------|
| 大卡片 | `24px - 32px` → `rounded-3xl` |
| 按钮 | 全圆角 → `rounded-full` |
| 输入框 | `16px` → `rounded-2xl` |
| 图片/图标 | `12px - 16px` → `rounded-xl` |

### 触控区域
- 所有可点击元素 `min-h-11 min-w-11`（≥ 44x44px）

### 颜色系统（Design Token）
```javascript
// tailwind.config.js
colors: {
  primary: '#FF9A62',      // 蜜瓜橙-主色
  success: '#5FDD9D',      // 薄荷绿-正确
  info: '#88B9F2',         // 柔雾蓝-次要
  danger: '#FF8A8A',        // 珊瑚粉-错误
  background: '#F9F6F0',    // 背景主色
  'text-primary': '#3C3C3C', // 文字主色
  'text-secondary': '#9A9A9A', // 文字辅色
}
```

---

## 七、Git 提交规范

### 格式
```
<type>: <subject>

[optional body]

[optional footer]
```

### Type 类型
| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 文档修改 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

### 示例
```
feat: 添加课本管理模块
fix: 修复听写页语速调节失效问题
docs: 更新需求文档
style: 格式化代码
refactor: 重构 TTSService 封装
```

---

## 八、优先级定义

### 功能优先级
| 优先级 | 说明 | 开发顺序 |
|--------|------|----------|
| P0 | 核心功能，必须实现 | Sprint 1-2 |
| P1 | 重要功能，影响体验 | Sprint 3-4 |
| P2 | 优化功能，可延后 | Sprint 5 |

### 模块优先级
1. **课本管理** (P0) - 数据基础
2. **课程管理** (P0) - 数据基础
3. **词条管理** (P0) - 数据基础
4. **听写练习** (P0) - 核心功能
5. **批改统计** (P0) - 核心功能
6. **系统设置** (P1) - 次要
7. **统计图表** (P2) - 可选优化

---

## 九、错误处理规范

### 语音朗读失败
```typescript
const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    toast.show('浏览器不支持语音朗读，请使用 Chrome 或 Safari');
    return;
  }
  // ...
};
```

### 拍照失败
```typescript
const takePhoto = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // ...
  } catch (error) {
    toast.show('无法访问摄像头，请检查权限设置');
  }
};
```

### 数据校验
```typescript
const importData = (file: File) => {
  // 1. 读取文件
  // 2. JSON.parse 校验格式
  // 3. 校验必需字段
  // 4. 校验数据类型
  // 5. 失败时给出明确错误信息
};
```

---

## 十、验收标准

### 代码层面
- [ ] 无 `any` 类型
- [ ] 无 `var` 声明
- [ ] Props 都有类型定义
- [ ] 所有状态通过 Zustand 管理
- [ ] 组件有对应样式文件
- [ ] 触控区域 ≥ 44x44px

### 功能层面（按需求文档 8.1）
- [ ] 首次启动自动注入示例数据
- [ ] 课本 CRUD + 导入导出
- [ ] 课程 CRUD
- [ ] 词条 CRUD + 批量添加
- [ ] 听写朗读 + 调速 + 重复
- [ ] 拍照批改 + 手动标记
- [ ] 历史记录查看
- [ ] 数据清空 + 重置

---

> 本规则文档由开发团队共同遵守，如有修改需经团队讨论确认。
