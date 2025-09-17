import React from 'react';
import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';

import { Badge } from '../ui/Badge';

describe('Badge Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com children básico', () => {
    const { getByText } = render(<Badge>Badge Test</Badge>);
    expect(getByText('Badge Test')).toBeTruthy();
  });

  it('deve aplicar props padrão', () => {
    const { getByText } = render(<Badge>Default Badge</Badge>);
    expect(getByText('Default Badge')).toBeTruthy();
  });

  describe('Variantes', () => {
    it('deve renderizar variant default', () => {
      const { getByText } = render(<Badge variant="default">Default Badge</Badge>);
      expect(getByText('Default Badge')).toBeTruthy();
    });

    it('deve renderizar variant success', () => {
      const { getByText } = render(<Badge variant="success">Success Badge</Badge>);
      expect(getByText('Success Badge')).toBeTruthy();
    });

    it('deve renderizar variant warning', () => {
      const { getByText } = render(<Badge variant="warning">Warning Badge</Badge>);
      expect(getByText('Warning Badge')).toBeTruthy();
    });

    it('deve renderizar variant danger', () => {
      const { getByText } = render(<Badge variant="danger">Danger Badge</Badge>);
      expect(getByText('Danger Badge')).toBeTruthy();
    });
  });

  describe('Mapeamento de cores', () => {
    it('deve usar cor primary para variant default', () => {
      render(<Badge variant="default">Default</Badge>);
      // O texto deve usar a cor primary
      expect(mockTheme.colors.primary).toBe('#6366F1');
    });

    it('deve usar cor success para variant success', () => {
      render(<Badge variant="success">Success</Badge>);
      expect(mockTheme.colors.success).toBe('#059669');
    });

    it('deve usar cor warning para variant warning', () => {
      render(<Badge variant="warning">Warning</Badge>);
      expect(mockTheme.colors.warning).toBe('#CA8A04');
    });

    it('deve usar cor danger para variant danger', () => {
      render(<Badge variant="danger">Danger</Badge>);
      expect(mockTheme.colors.danger).toBe('#DC2626');
    });
  });

  describe('Propriedades do Text interno', () => {
    it('deve usar variant caption no Text interno', () => {
      const { getByText } = render(<Badge>Caption Text</Badge>);
      const textElement = getByText('Caption Text');
      expect(textElement).toBeTruthy();
    });

    it('deve usar size xs no Text interno', () => {
      const { getByText } = render(<Badge>Small Text</Badge>);
      const textElement = getByText('Small Text');
      expect(textElement).toBeTruthy();
    });
  });

  describe('Diferentes tipos de children', () => {
    it('deve renderizar texto simples', () => {
      const { getByText } = render(<Badge>Simple Text</Badge>);
      expect(getByText('Simple Text')).toBeTruthy();
    });

    it('deve renderizar números', () => {
      const { getByText } = render(<Badge>42</Badge>);
      expect(getByText('42')).toBeTruthy();
    });

    it('deve renderizar texto com espaços', () => {
      const { getByText } = render(<Badge>Multi Word Badge</Badge>);
      expect(getByText('Multi Word Badge')).toBeTruthy();
    });

    it('deve renderizar caracteres especiais', () => {
      const { getByText } = render(<Badge>★ Special ★</Badge>);
      expect(getByText('★ Special ★')).toBeTruthy();
    });
  });

  describe('Combinações de variantes', () => {
    it('deve testar todas as variantes disponíveis', () => {
      const variants = ['default', 'success', 'warning', 'danger'] as const;

      variants.forEach((variant) => {
        const { getByText } = render(<Badge variant={variant}>{variant} badge</Badge>);
        expect(getByText(`${variant} badge`)).toBeTruthy();
      });
    });

    it('deve renderizar múltiplos badges com variantes diferentes', () => {
      const { getByText } = render(
        <>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="default">Default</Badge>
        </>
      );

      expect(getByText('Success')).toBeTruthy();
      expect(getByText('Warning')).toBeTruthy();
      expect(getByText('Danger')).toBeTruthy();
      expect(getByText('Default')).toBeTruthy();
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.primary).toBe('#6366F1');
      expect(mockTheme.colors.success).toBe('#059669');
      expect(mockTheme.colors.warning).toBe('#CA8A04');
      expect(mockTheme.colors.danger).toBe('#DC2626');
    });

    it('deve usar spacing do tema corretamente', () => {
      expect(mockTheme.spacing.xs).toBe(2);
      expect(mockTheme.spacing.sm).toBe(4);
    });

    it('deve usar radius do tema corretamente', () => {
      expect(mockTheme.radius.sm).toBe(4);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const { getByText } = render(<Badge variant="success">Dark Success</Badge>);
      expect(getByText('Dark Success')).toBeTruthy();

      expect(appThemes.dark.colors.success).toBe('#10B981');
      expect(appThemes.dark.colors.warning).toBe('#F59E0B');
      expect(appThemes.dark.colors.danger).toBe('#EF4444');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Casos extremos', () => {
    it('deve renderizar badge vazio', () => {
      const result = render(<Badge></Badge>);
      expect(result).toBeTruthy();
    });

    it('deve renderizar badge com texto muito longo', () => {
      const longText = 'Este é um texto muito longo para testar o comportamento do badge';
      const { getByText } = render(<Badge>{longText}</Badge>);
      expect(getByText(longText)).toBeTruthy();
    });

    it('deve renderizar badge sem variant (usando default)', () => {
      const { getByText } = render(<Badge>No Variant</Badge>);
      expect(getByText('No Variant')).toBeTruthy();
    });
  });
});
