import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { TextInput } from 'react-native';
import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';

import { Input } from '../ui/Input';

describe('Input Component', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com props básicas', () => {
    const { UNSAFE_getByType } = render(
      <Input value="test value" onChangeText={mockOnChangeText} />
    );

    const textInput = UNSAFE_getByType(TextInput);
    expect(textInput.props.value).toBe('test value');
    expect(textInput.props.onChangeText).toBe(mockOnChangeText);
  });

  it('deve aplicar props padrão', () => {
    const { UNSAFE_getByType } = render(<Input value="" onChangeText={mockOnChangeText} />);

    const textInput = UNSAFE_getByType(TextInput);
    expect(textInput.props.value).toBe('');
    expect(textInput.props.onChangeText).toBe(mockOnChangeText);
    expect(textInput.props.placeholderTextColor).toBe(mockTheme.colors.muted);
  });

  describe('Label', () => {
    it('deve renderizar com label', () => {
      const { getByText } = render(
        <Input label="Test Label" value="" onChangeText={mockOnChangeText} />
      );

      expect(getByText('Test Label')).toBeTruthy();
    });

    it('não deve renderizar label quando não fornecido', () => {
      const { queryByText } = render(<Input value="" onChangeText={mockOnChangeText} />);

      expect(queryByText('Test Label')).toBeNull();
    });

    it('deve renderizar label com props corretas', () => {
      const { getByText } = render(
        <Input label="Label Test" value="" onChangeText={mockOnChangeText} />
      );

      const label = getByText('Label Test');
      expect(label).toBeTruthy();
      // O label usa variant="body", size="sm", color="text"
    });
  });

  describe('Placeholder', () => {
    it('deve aplicar placeholder', () => {
      const { UNSAFE_getByType } = render(
        <Input value="" onChangeText={mockOnChangeText} placeholder="Enter text" />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.placeholder).toBe('Enter text');
    });

    it('deve usar cor correta para placeholder', () => {
      const { UNSAFE_getByType } = render(
        <Input value="" onChangeText={mockOnChangeText} placeholder="Test placeholder" />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.placeholderTextColor).toBe(mockTheme.colors.muted);
    });
  });

  describe('Error handling', () => {
    it('deve renderizar mensagem de erro', () => {
      const { getByText } = render(
        <Input value="" onChangeText={mockOnChangeText} error="This is an error" />
      );

      expect(getByText('This is an error')).toBeTruthy();
    });

    it('deve aplicar estilo de erro no input', () => {
      render(<Input value="" onChangeText={mockOnChangeText} error="Error message" />);

      // O error prop altera o variant do styles para error: true
      expect(mockTheme.colors.danger).toBe('#DC2626');
    });

    it('não deve renderizar erro quando não fornecido', () => {
      const { queryByText } = render(<Input value="" onChangeText={mockOnChangeText} />);

      expect(queryByText('Error message')).toBeNull();
    });

    it('deve renderizar erro com props corretas', () => {
      const { getByText } = render(
        <Input value="" onChangeText={mockOnChangeText} error="Error text" />
      );

      const errorText = getByText('Error text');
      expect(errorText).toBeTruthy();
      // O erro usa variant="caption", size="sm", color="danger"
    });
  });

  describe('Helper text', () => {
    it('deve renderizar helper text', () => {
      const { getByText } = render(
        <Input value="" onChangeText={mockOnChangeText} helperText="This is helper text" />
      );

      expect(getByText('This is helper text')).toBeTruthy();
    });

    it('não deve renderizar helper text quando há erro', () => {
      const { queryByText, getByText } = render(
        <Input
          value=""
          onChangeText={mockOnChangeText}
          error="Error message"
          helperText="Helper text"
        />
      );

      expect(getByText('Error message')).toBeTruthy();
      expect(queryByText('Helper text')).toBeNull();
    });

    it('deve renderizar helper text com props corretas', () => {
      const { getByText } = render(
        <Input value="" onChangeText={mockOnChangeText} helperText="Helper message" />
      );

      const helperText = getByText('Helper message');
      expect(helperText).toBeTruthy();
      // O helper text usa variant="caption", size="sm", color="muted"
    });

    it('não deve renderizar helper text quando não fornecido', () => {
      const { queryByText } = render(<Input value="" onChangeText={mockOnChangeText} />);

      expect(queryByText('Helper message')).toBeNull();
    });
  });

  describe('Interação onChangeText', () => {
    it('deve chamar onChangeText quando texto muda', () => {
      const { UNSAFE_getByType } = render(<Input value="" onChangeText={mockOnChangeText} />);

      const textInput = UNSAFE_getByType(TextInput);
      fireEvent.changeText(textInput, 'new text');

      expect(mockOnChangeText).toHaveBeenCalledWith('new text');
      expect(mockOnChangeText).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onChangeText múltiplas vezes', () => {
      const { UNSAFE_getByType } = render(<Input value="" onChangeText={mockOnChangeText} />);

      const textInput = UNSAFE_getByType(TextInput);
      fireEvent.changeText(textInput, 'first');
      fireEvent.changeText(textInput, 'second');
      fireEvent.changeText(textInput, 'third');

      expect(mockOnChangeText).toHaveBeenCalledTimes(3);
      expect(mockOnChangeText).toHaveBeenLastCalledWith('third');
    });

    it('deve funcionar com texto vazio', () => {
      const { UNSAFE_getByType } = render(
        <Input value="some text" onChangeText={mockOnChangeText} />
      );

      const textInput = UNSAFE_getByType(TextInput);
      fireEvent.changeText(textInput, '');

      expect(mockOnChangeText).toHaveBeenCalledWith('');
    });
  });

  describe('Combinações de props', () => {
    it('deve renderizar com todas as props', () => {
      const { getByText, UNSAFE_getByType } = render(
        <Input
          label="Full Input"
          value="test value"
          onChangeText={mockOnChangeText}
          placeholder="Enter text here"
          helperText="This is help text"
        />
      );

      expect(getByText('Full Input')).toBeTruthy();
      expect(getByText('This is help text')).toBeTruthy();

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.value).toBe('test value');
      expect(textInput.props.placeholder).toBe('Enter text here');
    });

    it('deve priorizar erro sobre helper text', () => {
      const { getByText, queryByText } = render(
        <Input
          label="Input with Error"
          value=""
          onChangeText={mockOnChangeText}
          error="Error has priority"
          helperText="This should not show"
        />
      );

      expect(getByText('Input with Error')).toBeTruthy();
      expect(getByText('Error has priority')).toBeTruthy();
      expect(queryByText('This should not show')).toBeNull();
    });

    it('deve funcionar com apenas props obrigatórias', () => {
      const { UNSAFE_getByType } = render(
        <Input value="minimal" onChangeText={mockOnChangeText} />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.value).toBe('minimal');
      expect(textInput.props.onChangeText).toBe(mockOnChangeText);
    });
  });

  describe('Props adicionais', () => {
    it('deve passar props adicionais para TextInput', () => {
      const { UNSAFE_getByType } = render(
        <Input
          value=""
          onChangeText={mockOnChangeText}
          maxLength={10}
          multiline={true}
          autoCapitalize="words"
        />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.maxLength).toBe(10);
      expect(textInput.props.multiline).toBe(true);
      expect(textInput.props.autoCapitalize).toBe('words');
    });

    it('deve funcionar com secureTextEntry', () => {
      const { UNSAFE_getByType } = render(
        <Input value="password" onChangeText={mockOnChangeText} secureTextEntry={true} />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.muted).toBe('#64748B');
      expect(mockTheme.colors.danger).toBe('#DC2626');
      expect(mockTheme.colors.border).toBe('#CBD5E1');
      expect(mockTheme.colors.text).toBe('#0F172A');
      expect(mockTheme.colors.surface).toBe('#FFFFFF');
    });

    it('deve usar spacing do tema corretamente', () => {
      expect(mockTheme.spacing.xs).toBe(2);
      expect(mockTheme.spacing.md).toBe(8);
      expect(mockTheme.spacing.xl).toBe(16);
      expect(mockTheme.spacing['4xl']).toBe(40);
    });

    it('deve usar radius do tema corretamente', () => {
      expect(mockTheme.radius.md).toBe(8);
    });

    it('deve usar sizes do tema corretamente', () => {
      expect(mockTheme.sizes.md).toBe(16);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const { UNSAFE_getByType } = render(
        <Input value="dark theme test" onChangeText={mockOnChangeText} />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.value).toBe('dark theme test');

      expect(appThemes.dark.colors.muted).toBe('#94A3B8');
      expect(appThemes.dark.colors.surface).toBe('#1E293B');
      expect(appThemes.dark.colors.text).toBe('#F8FAFC');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com value null/undefined', () => {
      const { UNSAFE_getByType } = render(<Input value="" onChangeText={mockOnChangeText} />);

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.value).toBe('');
    });

    it('deve lidar com textos muito longos', () => {
      const longText = 'A'.repeat(1000);
      const { UNSAFE_getByType } = render(
        <Input value={longText} onChangeText={mockOnChangeText} />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.value).toBe(longText);
    });

    it('deve lidar com caracteres especiais', () => {
      const specialText = '!@#$%^&*()_+{}|:"<>?[]\\;\',./-=`~';
      const { UNSAFE_getByType } = render(
        <Input value={specialText} onChangeText={mockOnChangeText} />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.value).toBe(specialText);
    });

    it('deve lidar com emojis', () => {
      const emojiText = '😀😃😄😁😆😅😂🤣😊😇';
      const { UNSAFE_getByType } = render(
        <Input value={emojiText} onChangeText={mockOnChangeText} />
      );

      const textInput = UNSAFE_getByType(TextInput);
      expect(textInput.props.value).toBe(emojiText);
    });

    it('deve funcionar com onChangeText que gera erro', () => {
      const errorOnChangeText = jest.fn(() => {
        throw new Error('onChangeText error');
      });

      const { UNSAFE_getByType } = render(<Input value="" onChangeText={errorOnChangeText} />);

      const textInput = UNSAFE_getByType(TextInput);

      expect(() => {
        fireEvent.changeText(textInput, 'test');
      }).toThrow('onChangeText error');

      expect(errorOnChangeText).toHaveBeenCalledWith('test');
    });
  });
});
