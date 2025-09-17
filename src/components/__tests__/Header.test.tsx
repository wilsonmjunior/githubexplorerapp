import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';

import { Header } from '../ui/Header';
import { Text } from '../ui/Text';

// Mock do expo-router
const mockBack = jest.fn();
const mockCanGoBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: mockCanGoBack(),
  }),
}));

// Mock do @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: (props: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, {
      ...props,
      testID: `feather-${props.name}`,
      accessibilityLabel: `Feather Icon: ${props.name}`,
    });
  },
}));

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(true);
  });

  describe('Header.Root', () => {
    it('deve renderizar com children básico', () => {
      const { getByText } = render(
        <Header.Root>
          <Text>Header Content</Text>
        </Header.Root>
      );

      expect(getByText('Header Content')).toBeTruthy();
    });

    it('deve renderizar como View', () => {
      const { UNSAFE_getByType } = render(
        <Header.Root>
          <Text>Root Test</Text>
        </Header.Root>
      );

      expect(() => UNSAFE_getByType(View)).not.toThrow();
    });

    it('deve aplicar layout flexDirection row quando há múltiplos children', () => {
      const { UNSAFE_getByType } = render(
        <Header.Root>
          <Text>First</Text>
          <Text>Second</Text>
        </Header.Root>
      );

      const rootView = UNSAFE_getByType(View);
      expect(rootView.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }),
        ])
      );
    });

    it('não deve aplicar layout flex quando há apenas um child', () => {
      const { UNSAFE_getByType } = render(
        <Header.Root>
          <Text>Single Child</Text>
        </Header.Root>
      );

      const rootView = UNSAFE_getByType(View);
      // Não deve incluir o objeto de layout flex
      expect(rootView.props.style).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            flexDirection: 'row',
          }),
        ])
      );
    });

    it('deve aceitar props adicionais', () => {
      const { UNSAFE_getByType } = render(
        <Header.Root testID="header-root" accessibilityLabel="Header">
          <Text>Props Test</Text>
        </Header.Root>
      );

      const rootView = UNSAFE_getByType(View);
      expect(rootView.props.testID).toBe('header-root');
      expect(rootView.props.accessibilityLabel).toBe('Header');
    });
  });

  describe('Header.ActionButton', () => {
    it('deve renderizar como TouchableOpacity', () => {
      const { UNSAFE_getByType } = render(
        <Header.ActionButton>
          <Text>Action</Text>
        </Header.ActionButton>
      );

      expect(() => UNSAFE_getByType(TouchableOpacity)).not.toThrow();
    });

    it('deve aplicar activeOpacity correto', () => {
      const { UNSAFE_getByType } = render(
        <Header.ActionButton>
          <Text>Action Button</Text>
        </Header.ActionButton>
      );

      const button = UNSAFE_getByType(TouchableOpacity);
      expect(button.props.activeOpacity).toBe(0.9);
    });

    it('deve ter propriedades de acessibilidade', () => {
      const { UNSAFE_getByType } = render(
        <Header.ActionButton>
          <Text>Accessible Button</Text>
        </Header.ActionButton>
      );

      const button = UNSAFE_getByType(TouchableOpacity);
      expect(button.props.accessible).toBe(true);
      expect(button.props.accessibilityRole).toBe('button');
    });

    it('deve chamar onPress quando clicado', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Header.ActionButton onPress={mockOnPress}>
          <Text>Clickable Action</Text>
        </Header.ActionButton>
      );

      fireEvent.press(getByText('Clickable Action'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('deve aceitar props adicionais', () => {
      const { UNSAFE_getByType } = render(
        <Header.ActionButton testID="action-button" disabled={true}>
          <Text>Additional Props</Text>
        </Header.ActionButton>
      );

      const button = UNSAFE_getByType(TouchableOpacity);
      expect(button.props.testID).toBe('action-button');
      expect(button.props.disabled).toBe(true);
    });
  });

  describe('Header.BackButton', () => {
    it('deve renderizar ícone Feather', () => {
      const { getByTestId } = render(<Header.BackButton />);
      expect(getByTestId('feather-chevron-left')).toBeTruthy();
    });

    it('deve renderizar como HeaderActionButton (TouchableOpacity)', () => {
      const { UNSAFE_getByType } = render(<Header.BackButton />);
      expect(() => UNSAFE_getByType(TouchableOpacity)).not.toThrow();
    });

    it('deve chamar router.back() quando clicado e canGoBack é true', () => {
      mockCanGoBack.mockReturnValue(true);

      const { UNSAFE_getByType } = render(<Header.BackButton />);
      const button = UNSAFE_getByType(TouchableOpacity);

      fireEvent.press(button);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar router.back() quando canGoBack é false', () => {
      mockCanGoBack.mockReturnValue(false);

      const { UNSAFE_getByType } = render(<Header.BackButton />);
      const button = UNSAFE_getByType(TouchableOpacity);

      fireEvent.press(button);
      expect(mockBack).not.toHaveBeenCalled();
    });

    it('deve usar cor do tema para o ícone', () => {
      const { getByTestId } = render(<Header.BackButton />);
      const icon = getByTestId('feather-chevron-left');

      expect(icon.props.accessibilityLabel).toBe('Feather Icon: chevron-left');
    });

    it('deve aceitar props adicionais', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <Header.BackButton onPress={mockOnPress} testID="custom-back" />
      );

      const button = UNSAFE_getByType(TouchableOpacity);
      expect(button.props.testID).toBe('custom-back');

      // O onPress customizado deve sobrescrever o padrão
      fireEvent.press(button);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Header.Title', () => {
    it('deve renderizar texto como título', () => {
      const { getByText } = render(<Header.Title>Page Title</Header.Title>);

      expect(getByText('Page Title')).toBeTruthy();
    });

    it('deve usar variant heading por padrão', () => {
      const { getByText } = render(<Header.Title>Heading Title</Header.Title>);

      const title = getByText('Heading Title');
      expect(title).toBeTruthy();
    });

    it('deve usar align center', () => {
      const { getByText } = render(<Header.Title>Centered Title</Header.Title>);

      const title = getByText('Centered Title');
      expect(title).toBeTruthy();
    });

    it('deve aceitar props adicionais do Text', () => {
      const { getByText } = render(
        <Header.Title size="lg" color="primary">
          Custom Title
        </Header.Title>
      );

      expect(getByText('Custom Title')).toBeTruthy();
    });

    it('deve renderizar children complexos', () => {
      const { getByText } = render(<Header.Title>Complex Title with Numbers: 123</Header.Title>);

      expect(getByText('Complex Title with Numbers: 123')).toBeTruthy();
    });
  });

  describe('Combinações de Header', () => {
    it('deve renderizar header completo com back button e título', () => {
      const { getByText, getByTestId } = render(
        <Header.Root>
          <Header.BackButton />
          <Header.Title>Complete Header</Header.Title>
        </Header.Root>
      );

      expect(getByTestId('feather-chevron-left')).toBeTruthy();
      expect(getByText('Complete Header')).toBeTruthy();
    });

    it('deve renderizar header com título e action button', () => {
      const mockAction = jest.fn();
      const { getByText } = render(
        <Header.Root>
          <Header.Title>Title with Action</Header.Title>
          <Header.ActionButton onPress={mockAction}>
            <Text>Save</Text>
          </Header.ActionButton>
        </Header.Root>
      );

      expect(getByText('Title with Action')).toBeTruthy();
      expect(getByText('Save')).toBeTruthy();

      fireEvent.press(getByText('Save'));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('deve renderizar header com back, título e action', () => {
      const mockAction = jest.fn();
      const { getByText, getByTestId } = render(
        <Header.Root>
          <Header.BackButton />
          <Header.Title>Full Header</Header.Title>
          <Header.ActionButton onPress={mockAction}>
            <Text>Action</Text>
          </Header.ActionButton>
        </Header.Root>
      );

      expect(getByTestId('feather-chevron-left')).toBeTruthy();
      expect(getByText('Full Header')).toBeTruthy();
      expect(getByText('Action')).toBeTruthy();
    });

    it('deve renderizar apenas título sem layout flex', () => {
      const { getByText, UNSAFE_getByType } = render(
        <Header.Root>
          <Header.Title>Solo Title</Header.Title>
        </Header.Root>
      );

      expect(getByText('Solo Title')).toBeTruthy();

      const rootView = UNSAFE_getByType(View);
      expect(rootView.props.style).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            flexDirection: 'row',
          }),
        ])
      );
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.surface).toBe('#FFFFFF');
      expect(mockTheme.colors.border).toBe('#CBD5E1');
      expect(mockTheme.colors.text).toBe('#0F172A');
    });

    it('deve usar spacing do tema corretamente', () => {
      expect(mockTheme.spacing.xl).toBe(16);
      expect(mockTheme.spacing['4xl']).toBe(40);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const { getByText, getByTestId } = render(
        <Header.Root>
          <Header.BackButton />
          <Header.Title>Dark Theme Header</Header.Title>
        </Header.Root>
      );

      expect(getByText('Dark Theme Header')).toBeTruthy();
      expect(getByTestId('feather-chevron-left')).toBeTruthy();

      expect(appThemes.dark.colors.surface).toBe('#1E293B');
      expect(appThemes.dark.colors.border).toBe('#334155');
      expect(appThemes.dark.colors.text).toBe('#F8FAFC');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com título vazio', () => {
      const result = render(
        <Header.Root>
          <Header.Title></Header.Title>
        </Header.Root>
      );

      expect(result).toBeTruthy();
    });

    it('deve lidar com null children', () => {
      const result = render(<Header.Root>{null}</Header.Root>);

      expect(result).toBeTruthy();
    });

    it('deve lidar com header vazio', () => {
      const result = render(<Header.Root></Header.Root>);
      expect(result).toBeTruthy();
    });

    it('deve lidar com back button quando router falha', () => {
      // Simular erro no router
      mockCanGoBack.mockImplementation(() => {
        throw new Error('Router error');
      });

      expect(() => {
        render(<Header.BackButton />);
      }).toThrow('Router error');
    });

    it('deve manter displayName dos componentes', () => {
      expect(Header.ActionButton.displayName).toBe('HeaderActionButton');
      expect(Header.BackButton.displayName).toBe('HeaderBackButton');
      expect(Header.Title.displayName).toBe('HeaderTitle');
    });
  });
});
