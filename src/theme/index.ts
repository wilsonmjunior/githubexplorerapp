import { StyleSheet } from 'react-native-unistyles';

const lightTheme = {
  colors: {
    primary: '#6366F1',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#CBD5E1',
    success: '#059669',
    warning: '#CA8A04',
    danger: '#DC2626',
  },
  gap: (v: number) => v * 8,
} as const;

const darkTheme = {
  colors: {
    primary: '#6366F1',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F8FAFC',
    muted: '#94A3B8',
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  gap: (v: number) => v * 8,
} as const;

const baseTheme = {
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 56,
    '6xl': 72,
    '7xl': 88,
    '8xl': 120,
  },
  border: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 999,
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
  },
};

const breakpoints = {
  xs: 0,
  sm: 300,
  md: 500,
  lg: 800,
  xl: 1200,
};

const appThemes = {
  light: { ...lightTheme, ...baseTheme },
  dark: { ...darkTheme, ...baseTheme },
};

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof appThemes;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  settings: {
    adaptiveThemes: true,
  },
  themes: appThemes,
  breakpoints,
});
