import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';

import { Button } from '../ui/Button';

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com children básico', () => {
    const { getByText } = render(<Button>Teste</Button>);
    expect(getByText('Teste')).toBeTruthy();
  });

  it('deve aplicar props padrão', () => {
    const { getByText } = render(<Button>Default Button</Button>);

    // Teste básico de renderização com props padrão
    expect(getByText('Default Button')).toBeTruthy();
  });

  describe('Variantes', () => {
    it('deve renderizar variant primary', () => {
      const { getByText } = render(<Button variant="primary">Primary Button</Button>);
      expect(getByText('Primary Button')).toBeTruthy();
    });

    it('deve renderizar variant outline', () => {
      const { getByText } = render(<Button variant="outline">Outline Button</Button>);
      expect(getByText('Outline Button')).toBeTruthy();
    });

    it('deve renderizar variant ghost', () => {
      const { getByText } = render(<Button variant="ghost">Ghost Button</Button>);
      expect(getByText('Ghost Button')).toBeTruthy();
    });
  });

  describe('Tamanhos', () => {
    it('deve renderizar size sm', () => {
      const { getByText } = render(<Button size="sm">Small Button</Button>);
      expect(getByText('Small Button')).toBeTruthy();
    });

    it('deve renderizar size md', () => {
      const { getByText } = render(<Button size="md">Medium Button</Button>);
      expect(getByText('Medium Button')).toBeTruthy();
    });

    it('deve renderizar size lg', () => {
      const { getByText } = render(<Button size="lg">Large Button</Button>);
      expect(getByText('Large Button')).toBeTruthy();
    });
  });

  describe('Estado Loading', () => {
    it('deve mostrar ActivityIndicator quando loading=true', () => {
      const { UNSAFE_getByType } = render(<Button loading>Loading Button</Button>);

      // ActivityIndicator deve estar presente
      expect(() => UNSAFE_getByType(ActivityIndicator)).not.toThrow();
    });

    it('não deve chamar onPress quando em loading', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Button loading onPress={mockOnPress}>
          Loading Button
        </Button>
      );

      fireEvent.press(getByText('Loading Button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Estado Disabled', () => {
    it('deve renderizar botão disabled', () => {
      const { getByText } = render(<Button disabled>Disabled Button</Button>);
      expect(getByText('Disabled Button')).toBeTruthy();
    });

    it('não deve chamar onPress quando disabled', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Button disabled onPress={mockOnPress}>
          Disabled Button
        </Button>
      );

      fireEvent.press(getByText('Disabled Button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Funcionalidade onPress', () => {
    it('deve chamar onPress quando clicado', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(<Button onPress={mockOnPress}>Clickable Button</Button>);

      fireEvent.press(getByText('Clickable Button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('deve funcionar sem onPress definido', () => {
      const { getByText } = render(<Button>Button Without onPress</Button>);

      expect(() => {
        fireEvent.press(getByText('Button Without onPress'));
      }).not.toThrow();
    });
  });

  describe('Combinações de estados', () => {
    it('deve renderizar loading e disabled juntos', () => {
      const { getByText } = render(
        <Button loading disabled>
          Loading Disabled Button
        </Button>
      );

      expect(getByText('Loading Disabled Button')).toBeTruthy();
    });

    it('deve renderizar variant outline com size lg', () => {
      const { getByText } = render(
        <Button variant="outline" size="lg">
          Large Outline Button
        </Button>
      );

      expect(getByText('Large Outline Button')).toBeTruthy();
    });

    it('deve renderizar todas as props customizadas', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Button variant="ghost" size="sm" loading onPress={mockOnPress}>
          Complex Button
        </Button>
      );

      expect(getByText('Complex Button')).toBeTruthy();
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.primary).toBe('#6366F1');
      expect(mockTheme.colors.background).toBe('#F8FAFC');
      expect(mockTheme.colors.text).toBe('#0F172A');
    });

    it('deve usar spacing do tema corretamente', () => {
      expect(mockTheme.spacing.sm).toBe(4);
      expect(mockTheme.spacing.md).toBe(8);
      expect(mockTheme.spacing.lg).toBe(12);
      expect(mockTheme.spacing.xl).toBe(16);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const { getByText } = render(<Button>Dark Theme Button</Button>);

      expect(appThemes.dark.colors.background).toBe('#0F172A');
      expect(getByText('Dark Theme Button')).toBeTruthy();

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });
});
