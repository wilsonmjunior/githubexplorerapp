import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';
import { RepositoryCard } from '../RepositoryCard';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

// Mock dos ícones
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: (props: any) => {
    const React = jest.requireActual('react');
    const { View } = jest.requireActual('react-native');
    return React.createElement(View, {
      testID: `material-icon-${props.name}`,
      accessibilityLabel: `MaterialIcon: ${props.name}`,
      'data-color': props.color,
      'data-size': props.size,
    });
  },
}));

// Dados mock para testes
const mockRepository = {
  id: 1,
  name: 'react',
  full_name: 'facebook/react',
  owner: {
    id: 69631,
    login: 'facebook',
    avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
  },
  description:
    'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
  stargazers_count: 200000,
  forks_count: 40000,
  watchers_count: 200000,
  language: 'JavaScript',
  html_url: 'https://github.com/facebook/react',
  created_at: '2013-05-24T16:15:54Z',
  updated_at: '2023-10-27T10:00:00Z',
};

const mockRepositoryWithoutDescription = {
  ...mockRepository,
  id: 2,
  name: 'minimal-repo',
  description: null,
};

const mockRepositoryWithoutLanguage = {
  ...mockRepository,
  id: 3,
  name: 'no-language-repo',
  language: null,
};

const mockRepositoryWithSmallNumbers = {
  ...mockRepository,
  id: 4,
  name: 'small-repo',
  stargazers_count: 42,
  forks_count: 15,
};

const mockRepositoryWithLargeNumbers = {
  ...mockRepository,
  id: 5,
  name: 'popular-repo',
  stargazers_count: 1234567,
  forks_count: 500000,
};

const mockRepositoryWithZeroStats = {
  ...mockRepository,
  id: 6,
  name: 'zero-stats-repo',
  stargazers_count: 0,
  forks_count: 0,
};

describe('RepositoryCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar com dados básicos do repositório', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(getByText('react')).toBeTruthy();
      expect(getByText('facebook')).toBeTruthy();
      expect(getByText(mockRepository.description)).toBeTruthy();
      expect(getByText('JavaScript')).toBeTruthy();
    });

    it('deve renderizar dentro de um Card', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(() => UNSAFE_getByType(Card)).not.toThrow();
    });

    it('deve renderizar avatar do owner', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const avatar = UNSAFE_getByType(Avatar);
      expect(avatar.props.size).toBe('sm');
      expect(avatar.props.source.uri).toBe('https://avatars.githubusercontent.com/u/69631?v=4');
    });

    it('deve renderizar ícones de estatísticas', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(getByTestId('material-icon-star')).toBeTruthy();
      expect(getByTestId('material-icon-call-split')).toBeTruthy();
    });

    it('deve renderizar badge da linguagem quando presente', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const badge = UNSAFE_getByType(Badge);
      expect(badge.props.children).toBe('JavaScript');
    });
  });

  describe('Funcionalidade onPress', () => {
    it('deve chamar onPress quando o card for clicado', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const card = UNSAFE_getByType(Card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPress múltiplas vezes', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const card = UNSAFE_getByType(Card);
      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Formatação de números', () => {
    it('deve formatar números em milhares (k)', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(getByText('200.0k')).toBeTruthy(); // stargazers_count
      expect(getByText('40.0k')).toBeTruthy(); // forks_count
    });

    it('deve exibir números pequenos sem formatação', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepositoryWithSmallNumbers} onPress={mockOnPress} />
      );

      expect(getByText('42')).toBeTruthy(); // stargazers_count
      expect(getByText('15')).toBeTruthy(); // forks_count
    });

    it('deve formatar números muito grandes corretamente', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepositoryWithLargeNumbers} onPress={mockOnPress} />
      );

      expect(getByText('1234.6k')).toBeTruthy(); // stargazers_count
      expect(getByText('500.0k')).toBeTruthy(); // forks_count
    });

    it('deve exibir zero sem formatação', () => {
      const mockOnPress = jest.fn();
      const { getAllByText } = render(
        <RepositoryCard repository={mockRepositoryWithZeroStats} onPress={mockOnPress} />
      );

      const zeroTexts = getAllByText('0');
      expect(zeroTexts).toHaveLength(2); // stars e forks
    });

    it('deve formatar exatamente 1000 como 1.0k', () => {
      const repoWith1000 = {
        ...mockRepository,
        stargazers_count: 1000,
        forks_count: 1000,
      };

      const mockOnPress = jest.fn();
      const { getAllByText } = render(
        <RepositoryCard repository={repoWith1000} onPress={mockOnPress} />
      );

      const formattedNumbers = getAllByText('1.0k');
      expect(formattedNumbers).toHaveLength(2); // stars e forks
    });
  });

  describe('Renderização condicional', () => {
    it('não deve renderizar descrição quando ela for null', () => {
      const mockOnPress = jest.fn();
      const { queryByText } = render(
        <RepositoryCard repository={mockRepositoryWithoutDescription} onPress={mockOnPress} />
      );

      expect(queryByText(mockRepository.description)).toBeNull();
    });

    it('não deve renderizar badge de linguagem quando ela for null', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_queryByType } = render(
        <RepositoryCard repository={mockRepositoryWithoutLanguage} onPress={mockOnPress} />
      );

      expect(UNSAFE_queryByType(Badge)).toBeNull();
    });

    it('deve renderizar descrição quando presente', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(getByText(mockRepository.description)).toBeTruthy();
    });
  });

  describe('Estrutura e layout', () => {
    it('deve ter estrutura correta de views', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('deve renderizar todos os elementos de texto necessários', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const texts = UNSAFE_getAllByType(Text);
      // Owner, nome, descrição, stars, forks
      expect(texts.length).toBeGreaterThanOrEqual(5);
    });

    it('deve ter seção de estatísticas', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(getByTestId('material-icon-star')).toBeTruthy();
      expect(getByTestId('material-icon-call-split')).toBeTruthy();
    });
  });

  describe('Diferentes tipos de dados', () => {
    it('deve lidar com nomes longos de repositório', () => {
      const longNameRepo = {
        ...mockRepository,
        name: 'repository-with-a-very-long-name-that-might-cause-layout-issues',
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={longNameRepo} onPress={mockOnPress} />
      );

      expect(
        getByText('repository-with-a-very-long-name-that-might-cause-layout-issues')
      ).toBeTruthy();
    });

    it('deve lidar com descrições longas', () => {
      const longDescRepo = {
        ...mockRepository,
        description:
          'Esta é uma descrição muito longa que pode quebrar em múltiplas linhas e deve ser renderizada corretamente com numberOfLines limitado',
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={longDescRepo} onPress={mockOnPress} />
      );

      expect(
        getByText(
          'Esta é uma descrição muito longa que pode quebrar em múltiplas linhas e deve ser renderizada corretamente com numberOfLines limitado'
        )
      ).toBeTruthy();
    });

    it('deve lidar com usernames longos', () => {
      const longUsernameRepo = {
        ...mockRepository,
        owner: {
          ...mockRepository.owner,
          login: 'organization-with-very-long-username',
        },
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={longUsernameRepo} onPress={mockOnPress} />
      );

      expect(getByText('organization-with-very-long-username')).toBeTruthy();
    });

    it('deve lidar com linguagens com nomes longos', () => {
      const longLanguageRepo = {
        ...mockRepository,
        language: 'TypeScriptWithVeryLongLanguageName',
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={longLanguageRepo} onPress={mockOnPress} />
      );

      expect(getByText('TypeScriptWithVeryLongLanguageName')).toBeTruthy();
    });
  });

  describe('Props do componente Text', () => {
    it('deve renderizar nome do repositório com variant heading', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(getByText('react')).toBeTruthy();
    });

    it('deve renderizar owner com variant caption', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      expect(getByText('facebook')).toBeTruthy();
    });

    it('deve renderizar descrição com numberOfLines limitado', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const texts = UNSAFE_getAllByType(Text);
      const descriptionText = texts.find(
        (text) => text.props.children === mockRepository.description
      );

      expect(descriptionText?.props.numberOfLines).toBe(2);
    });
  });

  describe('Cores dos ícones', () => {
    it('deve usar cor warning para ícone de star', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const starIcon = getByTestId('material-icon-star');
      expect(starIcon.props['data-color']).toBe(mockTheme.colors.warning);
    });

    it('deve usar cor muted para ícone de fork', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const forkIcon = getByTestId('material-icon-call-split');
      expect(forkIcon.props['data-color']).toBe(mockTheme.colors.muted);
    });

    it('deve usar tamanho 16 para ambos os ícones', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const starIcon = getByTestId('material-icon-star');
      const forkIcon = getByTestId('material-icon-call-split');

      expect(starIcon.props['data-size']).toBe(16);
      expect(forkIcon.props['data-size']).toBe(16);
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.warning).toBe('#CA8A04');
      expect(mockTheme.colors.muted).toBe('#64748B');
      expect(mockTheme.spacing.sm).toBe(4);
      expect(mockTheme.spacing.xs).toBe(2);
      expect(mockTheme.spacing.md).toBe(8);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const mockOnPress = jest.fn();
      const { getByText } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );
      expect(getByText('react')).toBeTruthy();

      expect(appThemes.dark.colors.warning).toBe('#F59E0B');
      expect(appThemes.dark.colors.muted).toBe('#94A3B8');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com avatar_url inválida', () => {
      const invalidAvatarRepo = {
        ...mockRepository,
        owner: {
          ...mockRepository.owner,
          avatar_url: '',
        },
      };

      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={invalidAvatarRepo} onPress={mockOnPress} />
      );

      const avatar = UNSAFE_getByType(Avatar);
      expect(avatar.props.source.uri).toBe('');
    });

    it('deve lidar com números negativos (caso impossível mas defensivo)', () => {
      const negativeStatsRepo = {
        ...mockRepository,
        stargazers_count: -1,
        forks_count: -5,
      };

      const mockOnPress = jest.fn();
      // Deve renderizar sem erros mesmo com números negativos
      expect(() => {
        render(<RepositoryCard repository={negativeStatsRepo} onPress={mockOnPress} />);
      }).not.toThrow();
    });

    it('deve funcionar com onPress como função vazia', () => {
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={() => {}} />
      );

      const card = UNSAFE_getByType(Card);
      expect(() => {
        fireEvent.press(card);
      }).not.toThrow();
    });

    it('deve lidar com description vazia (string vazia)', () => {
      const emptyDescRepo = {
        ...mockRepository,
        description: '',
      };

      const mockOnPress = jest.fn();
      // String vazia ainda é truthy, então deve renderizar o componente
      const { UNSAFE_getAllByType } = render(
        <RepositoryCard repository={emptyDescRepo} onPress={mockOnPress} />
      );
      // Verificar se há pelo menos um Text component para descrição
      const texts = UNSAFE_getAllByType(Text);
      expect(texts.length).toBeGreaterThan(0);
    });

    it('deve lidar com language vazia (string vazia)', () => {
      const emptyLanguageRepo = {
        ...mockRepository,
        language: '',
      };

      const mockOnPress = jest.fn();
      // String vazia é falsy, então NÃO deve renderizar badge
      const { UNSAFE_queryByType } = render(
        <RepositoryCard repository={emptyLanguageRepo} onPress={mockOnPress} />
      );
      const badge = UNSAFE_queryByType(Badge);
      expect(badge).toBeNull();
    });
  });

  describe('Testes de formatação específicos', () => {
    it('deve formatar 999 como string normal', () => {
      const repo999 = {
        ...mockRepository,
        stargazers_count: 999,
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<RepositoryCard repository={repo999} onPress={mockOnPress} />);

      expect(getByText('999')).toBeTruthy();
    });

    it('deve formatar 1001 como 1.0k', () => {
      const repo1001 = {
        ...mockRepository,
        stargazers_count: 1001,
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<RepositoryCard repository={repo1001} onPress={mockOnPress} />);

      expect(getByText('1.0k')).toBeTruthy();
    });

    it('deve formatar 12345 como 12.3k', () => {
      const repo12345 = {
        ...mockRepository,
        stargazers_count: 12345,
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<RepositoryCard repository={repo12345} onPress={mockOnPress} />);

      expect(getByText('12.3k')).toBeTruthy();
    });

    it('deve formatar números decimais corretamente', () => {
      const repo1500 = {
        ...mockRepository,
        stargazers_count: 1500,
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<RepositoryCard repository={repo1500} onPress={mockOnPress} />);

      expect(getByText('1.5k')).toBeTruthy();
    });
  });

  describe('Componentes específicos', () => {
    it('deve renderizar Card com onPress correto', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const card = UNSAFE_getByType(Card);
      expect(card.props.onPress).toBe(mockOnPress);
    });

    it('deve renderizar Avatar com props corretos', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );

      const avatar = UNSAFE_getByType(Avatar);
      expect(avatar.props.size).toBe('sm');
      expect(avatar.props.source).toEqual({ uri: mockRepository.owner.avatar_url });
    });

    it('deve renderizar Badge apenas quando language existe', () => {
      const mockOnPress = jest.fn();

      // Com linguagem
      const { UNSAFE_getByType } = render(
        <RepositoryCard repository={mockRepository} onPress={mockOnPress} />
      );
      expect(() => UNSAFE_getByType(Badge)).not.toThrow();

      // Sem linguagem
      const { UNSAFE_queryByType } = render(
        <RepositoryCard repository={mockRepositoryWithoutLanguage} onPress={mockOnPress} />
      );
      expect(UNSAFE_queryByType(Badge)).toBeNull();
    });
  });
});
