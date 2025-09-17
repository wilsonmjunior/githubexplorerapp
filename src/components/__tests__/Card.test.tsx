import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';

import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

describe('Card Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com children básico', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  describe('Renderização sem onPress', () => {
    it('deve renderizar como View quando não há onPress', () => {
      const { UNSAFE_getByType } = render(
        <Card>
          <Text>Static Card</Text>
        </Card>
      );

      expect(() => UNSAFE_getByType(View)).not.toThrow();
    });

    it('deve renderizar children corretamente em View', () => {
      const { getByText } = render(
        <Card>
          <Text>View Content</Text>
        </Card>
      );

      expect(getByText('View Content')).toBeTruthy();
    });
  });

  describe('Renderização com onPress', () => {
    it('deve renderizar como TouchableOpacity quando há onPress', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <Card onPress={mockOnPress}>
          <Text>Touchable Card</Text>
        </Card>
      );

      expect(() => UNSAFE_getByType(TouchableOpacity)).not.toThrow();
    });

    it('deve renderizar children corretamente em TouchableOpacity', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Card onPress={mockOnPress}>
          <Text>Touchable Content</Text>
        </Card>
      );

      expect(getByText('Touchable Content')).toBeTruthy();
    });

    it('deve aplicar activeOpacity correto', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <Card onPress={mockOnPress}>
          <Text>Touchable Card</Text>
        </Card>
      );

      const touchable = UNSAFE_getByType(TouchableOpacity);
      expect(touchable.props.activeOpacity).toBe(0.7);
    });
  });

  describe('Funcionalidade onPress', () => {
    it('deve chamar onPress quando clicado', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Card onPress={mockOnPress}>
          <Text>Clickable Card</Text>
        </Card>
      );

      fireEvent.press(getByText('Clickable Card'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPress múltiplas vezes', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Card onPress={mockOnPress}>
          <Text>Multi Click Card</Text>
        </Card>
      );

      const card = getByText('Multi Click Card');
      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Diferentes tipos de children', () => {
    it('deve renderizar texto simples em Text', () => {
      const { getByText } = render(
        <Card>
          <Text>Simple Text</Text>
        </Card>
      );
      expect(getByText('Simple Text')).toBeTruthy();
    });

    it('deve renderizar múltiplos elementos', () => {
      const { getByText } = render(
        <Card>
          <Text>First Element</Text>
          <Text>Second Element</Text>
        </Card>
      );

      expect(getByText('First Element')).toBeTruthy();
      expect(getByText('Second Element')).toBeTruthy();
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.surface).toBe('#FFFFFF');
      expect(mockTheme.colors.border).toBe('#CBD5E1');
    });

    it('deve usar spacing do tema corretamente', () => {
      expect(mockTheme.spacing.md).toBe(8);
    });

    it('deve usar radius do tema corretamente', () => {
      expect(mockTheme.radius.lg).toBe(12);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const { getByText } = render(
        <Card>
          <Text>Dark Theme Card</Text>
        </Card>
      );
      expect(getByText('Dark Theme Card')).toBeTruthy();

      expect(appThemes.dark.colors.surface).toBe('#1E293B');
      expect(appThemes.dark.colors.border).toBe('#334155');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Casos extremos', () => {
    it('deve renderizar card vazio', () => {
      const result = render(<Card></Card>);
      expect(result).toBeTruthy();
    });

    it('deve renderizar card com null children', () => {
      const result = render(<Card>{null}</Card>);
      expect(result).toBeTruthy();
    });

    it('deve renderizar card com undefined children', () => {
      const result = render(<Card>{undefined}</Card>);
      expect(result).toBeTruthy();
    });

    it('deve funcionar com onPress como undefined explicitamente', () => {
      const { getByText, UNSAFE_getByType } = render(
        <Card onPress={undefined}>
          <Text>Undefined onPress</Text>
        </Card>
      );

      expect(getByText('Undefined onPress')).toBeTruthy();
      // Deve renderizar como View quando onPress é undefined
      expect(() => UNSAFE_getByType(View)).not.toThrow();
    });
  });
});
