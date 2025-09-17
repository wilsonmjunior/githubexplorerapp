import { Image } from 'expo-image';
import React from 'react';
import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';

import { Avatar } from '../ui/Avatar';

describe('Avatar Component', () => {
  const mockSource = { uri: 'https://example.com/avatar.jpg' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com source básico', () => {
    const { UNSAFE_getByType } = render(<Avatar source={mockSource} />);
    expect(() => UNSAFE_getByType(Image)).not.toThrow();
  });

  it('deve aplicar props padrão', () => {
    const { UNSAFE_getByType } = render(<Avatar source={mockSource} />);
    const image = UNSAFE_getByType(Image);

    expect(image.props.source).toEqual(mockSource);
    expect(image.props.contentFit).toBe('cover');
    expect(image.props.transition).toBe(200);
  });

  describe('Tamanhos', () => {
    it('deve renderizar size xs', () => {
      const { UNSAFE_getByType } = render(<Avatar size="xs" source={mockSource} />);
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });

    it('deve renderizar size sm', () => {
      const { UNSAFE_getByType } = render(<Avatar size="sm" source={mockSource} />);
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });

    it('deve renderizar size md (padrão)', () => {
      const { UNSAFE_getByType } = render(<Avatar size="md" source={mockSource} />);
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });

    it('deve renderizar size lg', () => {
      const { UNSAFE_getByType } = render(<Avatar size="lg" source={mockSource} />);
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });

    it('deve renderizar size xl', () => {
      const { UNSAFE_getByType } = render(<Avatar size="xl" source={mockSource} />);
      expect(() => UNSAFE_getByType(Image)).not.toThrow();
    });
  });

  describe('Props da imagem', () => {
    it('deve usar a source fornecida', () => {
      const customSource = { uri: 'https://example.com/custom.png' };
      const { UNSAFE_getByType } = render(<Avatar source={customSource} />);
      const image = UNSAFE_getByType(Image);

      expect(image.props.source).toEqual(customSource);
    });

    it('deve aplicar contentFit como cover', () => {
      const { UNSAFE_getByType } = render(<Avatar source={mockSource} />);
      const image = UNSAFE_getByType(Image);

      expect(image.props.contentFit).toBe('cover');
    });

    it('deve aplicar transition de 200ms', () => {
      const { UNSAFE_getByType } = render(<Avatar source={mockSource} />);
      const image = UNSAFE_getByType(Image);

      expect(image.props.transition).toBe(200);
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.surface).toBe('#FFFFFF');
      expect(mockTheme.colors.border).toBe('#CBD5E1');
    });

    it('deve usar spacing do tema corretamente', () => {
      expect(mockTheme.spacing['2xl']).toBe(24);
      expect(mockTheme.spacing['3xl']).toBe(32);
      expect(mockTheme.spacing['4xl']).toBe(40);
      expect(mockTheme.spacing['5xl']).toBe(56);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const { UNSAFE_getByType } = render(<Avatar source={mockSource} />);
      expect(() => UNSAFE_getByType(Image)).not.toThrow();

      expect(appThemes.dark.colors.surface).toBe('#1E293B');
      expect(appThemes.dark.colors.border).toBe('#334155');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Combinações de props', () => {
    it('deve renderizar todas as combinações de size', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

      sizes.forEach((size) => {
        const { UNSAFE_getByType } = render(<Avatar size={size} source={mockSource} />);
        expect(() => UNSAFE_getByType(Image)).not.toThrow();
      });
    });

    it('deve funcionar com diferentes sources', () => {
      const sources = [
        { uri: 'https://example.com/avatar1.jpg' },
        { uri: 'https://example.com/avatar2.png' },
        { uri: 'https://example.com/avatar3.gif' },
      ];

      sources.forEach((source) => {
        const { UNSAFE_getByType } = render(<Avatar source={source} />);
        const image = UNSAFE_getByType(Image);
        expect(image.props.source).toEqual(source);
      });
    });
  });
});
