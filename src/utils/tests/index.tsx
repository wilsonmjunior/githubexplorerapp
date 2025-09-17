import { render as rtlRender } from '@testing-library/react-native';
import React from 'react';

import { appThemes, mockTheme, mockUnistylesWithTheme } from './theme-mock';

// Wrapper customizado para render
function customRender(ui: React.ReactElement, options: any = {}) {
  const { wrapper: Wrapper = React.Fragment, ...renderOptions } = options;

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return <Wrapper>{children}</Wrapper>;
  }

  return rtlRender(ui, { wrapper: AllTheProviders, ...renderOptions });
}

// Funções utilitárias
export const createMockNavigation = (params = {}) => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  ...params,
});

export const createMockRoute = (params = {}) => ({
  params,
  name: 'TestScreen',
  key: 'test-key',
});

export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

// Re-export tudo
export * from '@testing-library/react-native';
export { appThemes, mockTheme, mockUnistylesWithTheme, customRender as render };

