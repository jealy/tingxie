/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C69',
        'primary-light': '#FFB299',
        'primary-dark': '#E67350',
        success: '#4CAF7D',
        'success-light': '#E8F5EF',
        info: '#6BA3E0',
        danger: '#E57373',
        'danger-light': '#FDECEC',
        background: '#FAFAFA',
        'card-bg': '#FFFFFF',
        'text-primary': '#2D2D2D',
        'text-secondary': '#8E8E93',
        'text-hint': '#C7C7CC',
        'border-color': '#F0F0F0',
      },
      borderRadius: {
        'card': '20px',
        'card-lg': '28px',
        'btn': '999px',
        'input': '12px',
        'img': '12px',
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"SF Pro Text"', '"Helvetica Neue"', 'sans-serif'],
        display: ['"SF Pro Display"', '"PingFang SC"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.1)',
        'btn': '0 2px 8px rgba(255,140,105,0.3)',
        'btn-primary': '0 4px 14px rgba(255,140,105,0.4)',
      },
      spacing: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      },
      minHeight: {
        'touch': '48px',
      },
    },
  },
  plugins: [],
};
