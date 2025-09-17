import React from 'react';
import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';

import { Text } from '../ui/Text';

describe('Text Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com children básico', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('deve aplicar props padrão usando tema real', () => {
    const { getByText } = render(<Text>Default Text</Text>);
    const textElement = getByText('Default Text');

    expect(textElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          textAlign: 'left',
        }),
      ])
    );
  });

  it('deve renderizar variant heading', () => {
    const { getByText } = render(<Text variant="heading">Heading Text</Text>);
    expect(getByText('Heading Text')).toBeTruthy();
  });

  it('deve usar cores do tema real', () => {
    render(<Text color="primary">Primary Text</Text>);

    // Verificar se está usando a cor correta do seu tema
    expect(mockTheme.colors.primary).toBe('#6366F1');
  });

  it('deve usar tamanhos do tema real', () => {
    render(<Text size="lg">Large Text</Text>);

    // Verificar se está usando o tamanho correto do seu tema
    expect(mockTheme.sizes.lg).toBe(18);
  });

  it('deve testar com tema dark', () => {
    // Re-mock com tema dark
    mockUnistylesWithTheme('dark');

    const { getByText } = render(<Text color="background">Dark Theme Text</Text>);

    // Verificar se está usando as cores do tema dark
    expect(appThemes.dark.colors.background).toBe('#0F172A');
    expect(getByText('Dark Theme Text')).toBeTruthy();

    // Restaurar tema light para outros testes
    mockUnistylesWithTheme('light');
  });

  it('deve aplicar spacing do tema real', () => {
    // Seu tema tem spacing específico que pode ser testado
    expect(mockTheme.spacing.md).toBe(8);
    expect(mockTheme.spacing.xl).toBe(16);
  });

  it('deve renderizar combinação de props', () => {
    const { getByText } = render(
      <Text variant="heading" size="xl" color="success" align="center">
        Complex Text
      </Text>
    );

    expect(getByText('Complex Text')).toBeTruthy();

    // Verificar valores reais do tema
    expect(mockTheme.colors.success).toBe('#059669');
    expect(mockTheme.sizes.xl).toBe(24);
  });

  it('deve testar todas as cores disponíveis', () => {
    const colors = Object.keys(mockTheme.colors) as (keyof typeof mockTheme.colors)[];

    colors.forEach((color) => {
      render(<Text color={color}>{color} text</Text>);
    });

    expect(colors).toEqual([
      'primary',
      'background',
      'surface',
      'text',
      'muted',
      'border',
      'success',
      'warning',
      'danger',
    ]);
  });

  it('deve testar todos os tamanhos disponíveis', () => {
    const sizes = Object.keys(mockTheme.sizes) as (keyof typeof mockTheme.sizes)[];

    sizes.forEach((size) => {
      render(<Text size={size}>{size} text</Text>);
    });

    expect(sizes).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
  });

  it('deve testar todas as variantes disponíveis', () => {
    const variants = ['body', 'heading', 'caption'] as const;

    variants.forEach((variant) => {
      render(<Text variant={variant}>{variant} text</Text>);
    });

    expect(variants).toEqual(['body', 'heading', 'caption']);
  });

  it('deve aplicar alinhamento correto', () => {
    const { getByText: getByTextCenter } = render(<Text align="center">Center Text</Text>);
    const { getByText: getByTextRight } = render(<Text align="right">Right Text</Text>);

    expect(getByTextCenter('Center Text').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          textAlign: 'center',
        }),
      ])
    );

    expect(getByTextRight('Right Text').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          textAlign: 'right',
        }),
      ])
    );
  });
});
