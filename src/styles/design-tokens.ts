// 이음다리 디자인 토큰
// Tailwind CSS v4 @theme에서 사용하는 브랜드 컬러 및 토큰 정의

export const colors = {
  brand: {
    50: '#EFF5FF',
    100: '#DAE8FD',
    200: '#BEDBFC',
    300: '#93C2F9',
    400: '#6199F0',
    500: '#3B75E3',
    600: '#1E56A0',
    700: '#1A4A8A',
    800: '#1B3E72',
    900: '#1C345F',
    950: '#132140',
  },
  accent: {
    50: '#fef5f1',
    100: '#fee8de',
    200: '#facebc',
    300: '#f7ac8e',
    400: '#f18f65',
    500: '#E8835A',
    600: '#d16837',
    700: '#ae512a',
    800: '#8c4226',
    900: '#733923',
    950: '#3e1b10',
  },
  warmGray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  success: {
    light: '#22c55e',
    DEFAULT: '#16a34a',
    dark: '#15803d',
  },
  warning: {
    light: '#facc15',
    DEFAULT: '#eab308',
    dark: '#ca8a04',
  },
  danger: {
    light: '#f87171',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
} as const;

export const fontFamily = {
  sans: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
} as const;

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
} as const;
