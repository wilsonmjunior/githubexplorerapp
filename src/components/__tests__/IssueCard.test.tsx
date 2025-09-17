import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';
import { IssueCard } from '../IssueCard';
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
    });
  },
}));

// Dados mock para testes
const mockIssue = {
  id: 1,
  number: 123,
  title: 'Bug: Application crashes on startup',
  user: {
    id: 456,
    login: 'developer1',
    avatar_url: 'https://github.com/developer1.png',
  },
  labels: [
    {
      id: 1,
      name: 'bug',
      color: 'red',
      description: "Something isn't working",
    },
    {
      id: 2,
      name: 'high priority',
      color: 'orange',
      description: 'High priority issue',
    },
  ],
  state: 'open' as const,
  created_at: '2023-12-01T10:00:00Z',
  updated_at: '2023-12-01T15:30:00Z',
  body: 'The application crashes when starting up...',
  html_url: 'https://github.com/facebook/react/issues/123',
};

const mockIssueWithManyLabels = {
  ...mockIssue,
  id: 2,
  number: 124,
  title: 'Feature request with many labels',
  labels: [
    { id: 1, name: 'enhancement', color: 'blue', description: 'New feature' },
    { id: 2, name: 'good first issue', color: 'green', description: 'Good for newcomers' },
    { id: 3, name: 'help wanted', color: 'yellow', description: 'Extra attention is needed' },
    { id: 4, name: 'documentation', color: 'purple', description: 'Improvements to documentation' },
    { id: 5, name: 'question', color: 'pink', description: 'Further information is requested' },
  ],
};

const mockIssueWithoutLabels = {
  ...mockIssue,
  id: 3,
  number: 125,
  title: 'Simple issue without labels',
  labels: [],
};

const mockIssueOldDate = {
  ...mockIssue,
  id: 4,
  number: 126,
  title: 'Old issue from years ago',
  created_at: '2020-01-15T08:30:00Z',
};

describe('IssueCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock da data atual para testes consistentes de tempo relativo
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2023-12-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Renderização básica', () => {
    it('deve renderizar com dados básicos da issue', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      expect(getByText('Bug: Application crashes on startup')).toBeTruthy();
      expect(getByText('#123')).toBeTruthy();
      expect(getByText('developer1')).toBeTruthy();
    });

    it('deve renderizar dentro de um Card', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      expect(() => UNSAFE_getByType(Card)).not.toThrow();
    });

    it('deve renderizar ícone da issue', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      expect(getByTestId('material-icon-error-outline')).toBeTruthy();
    });

    it('deve renderizar avatar do usuário', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      const avatar = UNSAFE_getByType(Avatar);
      expect(avatar.props.size).toBe('xs');
      expect(avatar.props.source.uri).toBe('https://github.com/developer1.png');
    });
  });

  describe('Funcionalidade onPress', () => {
    it('deve chamar onPress quando o card for clicado', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      const card = UNSAFE_getByType(Card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onPress múltiplas vezes', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      const card = UNSAFE_getByType(Card);
      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });
  });

  describe('Formatação de tempo relativo', () => {
    it('deve mostrar "agora há pouco" para issues muito recentes', () => {
      const recentIssue = {
        ...mockIssue,
        created_at: '2023-12-01T11:30:00Z', // 30 minutos atrás
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={recentIssue} onPress={mockOnPress} />);

      expect(getByText('agora há pouco')).toBeTruthy();
    });

    it('deve mostrar horas para issues de algumas horas atrás', () => {
      const hoursAgoIssue = {
        ...mockIssue,
        created_at: '2023-12-01T08:00:00Z', // 4 horas atrás
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={hoursAgoIssue} onPress={mockOnPress} />);

      expect(getByText('4h atrás')).toBeTruthy();
    });

    it('deve mostrar dias para issues de alguns dias atrás', () => {
      const daysAgoIssue = {
        ...mockIssue,
        created_at: '2023-11-28T10:00:00Z', // 3 dias atrás
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={daysAgoIssue} onPress={mockOnPress} />);

      expect(getByText('3d atrás')).toBeTruthy();
    });

    it('deve mostrar semanas para issues de algumas semanas atrás', () => {
      const weeksAgoIssue = {
        ...mockIssue,
        created_at: '2023-11-17T10:00:00Z', // 2 semanas atrás
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={weeksAgoIssue} onPress={mockOnPress} />);

      expect(getByText('2sem atrás')).toBeTruthy();
    });

    it('deve mostrar data formatada para issues muito antigas', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={mockIssueOldDate} onPress={mockOnPress} />);

      expect(getByText('15/01/2020')).toBeTruthy();
    });
  });

  describe('Exibição de labels', () => {
    it('deve renderizar labels quando existem', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      expect(getByText('bug')).toBeTruthy();
      expect(getByText('high priority')).toBeTruthy();
    });

    it('não deve renderizar seção de labels quando não há labels', () => {
      const mockOnPress = jest.fn();
      const { queryByText } = render(
        <IssueCard issue={mockIssueWithoutLabels} onPress={mockOnPress} />
      );

      // Não deve haver badges
      expect(queryByText('bug')).toBeNull();
      expect(queryByText('enhancement')).toBeNull();
    });

    it('deve limitar exibição a 3 labels e mostrar contador', () => {
      const mockOnPress = jest.fn();
      const { getByText, queryByText } = render(
        <IssueCard issue={mockIssueWithManyLabels} onPress={mockOnPress} />
      );

      // Deve mostrar apenas os 3 primeiros
      expect(getByText('enhancement')).toBeTruthy();
      expect(getByText('good first issue')).toBeTruthy();
      expect(getByText('help wanted')).toBeTruthy();

      // Não deve mostrar o 4º e 5º
      expect(queryByText('documentation')).toBeNull();
      expect(queryByText('question')).toBeNull();

      // Deve mostrar contador "+2 mais"
      expect(getByText('+2 mais')).toBeTruthy();
    });

    it('deve renderizar badges corretamente', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getAllByType } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      const badges = UNSAFE_getAllByType(Badge);
      expect(badges).toHaveLength(2);
    });
  });

  describe('Estrutura e layout', () => {
    it('deve ter estrutura correta de views', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getAllByType } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      const views = UNSAFE_getAllByType(View);
      expect(views.length).toBeGreaterThan(0);
    });

    it('deve renderizar todos os elementos de texto necessários', () => {
      const mockOnPress = jest.fn();
      const { UNSAFE_getAllByType } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      const texts = UNSAFE_getAllByType(Text);
      // Título, número, separadores, usuário, tempo, labels
      expect(texts.length).toBeGreaterThan(5);
    });

    it('deve renderizar separadores "•"', () => {
      const mockOnPress = jest.fn();
      const { getAllByText } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      const separators = getAllByText('•');
      expect(separators).toHaveLength(2);
    });
  });

  describe('Diferentes tipos de dados', () => {
    it('deve lidar com títulos longos', () => {
      const longTitleIssue = {
        ...mockIssue,
        title:
          'Este é um título muito longo que pode quebrar em múltiplas linhas e deve ser renderizado corretamente',
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={longTitleIssue} onPress={mockOnPress} />);

      expect(
        getByText(
          'Este é um título muito longo que pode quebrar em múltiplas linhas e deve ser renderizado corretamente'
        )
      ).toBeTruthy();
    });

    it('deve lidar com usernames longos', () => {
      const longUsernameIssue = {
        ...mockIssue,
        user: {
          ...mockIssue.user,
          login: 'very-long-username-that-might-cause-layout-issues',
        },
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={longUsernameIssue} onPress={mockOnPress} />);

      expect(getByText('very-long-username-that-might-cause-layout-issues')).toBeTruthy();
    });

    it('deve lidar com números de issue grandes', () => {
      const highNumberIssue = {
        ...mockIssue,
        number: 999999,
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={highNumberIssue} onPress={mockOnPress} />);

      expect(getByText('#999999')).toBeTruthy();
    });
  });

  describe('Renderização de texto', () => {
    it('deve renderizar o título corretamente', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      expect(getByText('Bug: Application crashes on startup')).toBeTruthy();
    });

    it('deve renderizar número da issue corretamente', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);

      expect(getByText('#123')).toBeTruthy();
    });

    it('deve renderizar contador de labels quando há mais de 3', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <IssueCard issue={mockIssueWithManyLabels} onPress={mockOnPress} />
      );

      expect(getByText('+2 mais')).toBeTruthy();
    });
  });

  describe('Valores do tema', () => {
    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.success).toBe('#059669');
      expect(mockTheme.spacing.sm).toBe(4);
      expect(mockTheme.spacing.xs).toBe(2);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={mockIssue} onPress={mockOnPress} />);
      expect(getByText('Bug: Application crashes on startup')).toBeTruthy();

      expect(appThemes.dark.colors.success).toBe('#10B981');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com avatar_url inválida', () => {
      const invalidAvatarIssue = {
        ...mockIssue,
        user: {
          ...mockIssue.user,
          avatar_url: '',
        },
      };

      const mockOnPress = jest.fn();
      const { UNSAFE_getByType } = render(
        <IssueCard issue={invalidAvatarIssue} onPress={mockOnPress} />
      );

      const avatar = UNSAFE_getByType(Avatar);
      expect(avatar.props.source.uri).toBe('');
    });

    it('deve lidar com data inválida', () => {
      const invalidDateIssue = {
        ...mockIssue,
        created_at: 'invalid-date',
      };

      const mockOnPress = jest.fn();
      // Deve renderizar sem erros mesmo com data inválida
      expect(() => {
        render(<IssueCard issue={invalidDateIssue} onPress={mockOnPress} />);
      }).not.toThrow();
    });

    it('deve lidar com exatamente 3 labels (sem mostrar contador)', () => {
      const exactlyThreeLabelsIssue = {
        ...mockIssue,
        labels: [
          { id: 1, name: 'bug', color: 'red', description: 'Bug' },
          { id: 2, name: 'urgent', color: 'orange', description: 'Urgent' },
          { id: 3, name: 'frontend', color: 'blue', description: 'Frontend' },
        ],
      };

      const mockOnPress = jest.fn();
      const { getByText, queryByText } = render(
        <IssueCard issue={exactlyThreeLabelsIssue} onPress={mockOnPress} />
      );

      expect(getByText('bug')).toBeTruthy();
      expect(getByText('urgent')).toBeTruthy();
      expect(getByText('frontend')).toBeTruthy();
      expect(queryByText('+0 mais')).toBeNull();
    });

    it('deve lidar com apenas 1 label', () => {
      const oneLabel = {
        ...mockIssue,
        labels: [{ id: 1, name: 'documentation', color: 'blue', description: 'Documentation' }],
      };

      const mockOnPress = jest.fn();
      const { getByText, queryByText } = render(
        <IssueCard issue={oneLabel} onPress={mockOnPress} />
      );

      expect(getByText('documentation')).toBeTruthy();
      expect(queryByText('+0 mais')).toBeNull();
    });

    it('deve funcionar com onPress como função vazia', () => {
      const { UNSAFE_getByType } = render(<IssueCard issue={mockIssue} onPress={() => {}} />);

      const card = UNSAFE_getByType(Card);
      expect(() => {
        fireEvent.press(card);
      }).not.toThrow();
    });
  });

  describe('Testes de tempo específicos', () => {
    it('deve lidar com issue criada exatamente 1 hora atrás', () => {
      const oneHourAgo = {
        ...mockIssue,
        created_at: '2023-12-01T11:00:00Z',
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={oneHourAgo} onPress={mockOnPress} />);

      expect(getByText('1h atrás')).toBeTruthy();
    });

    it('deve lidar com issue criada exatamente 1 dia atrás', () => {
      const oneDayAgo = {
        ...mockIssue,
        created_at: '2023-11-30T12:00:00Z',
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={oneDayAgo} onPress={mockOnPress} />);

      expect(getByText('1d atrás')).toBeTruthy();
    });

    it('deve lidar com issue criada exatamente 1 semana atrás', () => {
      const oneWeekAgo = {
        ...mockIssue,
        created_at: '2023-11-24T12:00:00Z',
      };

      const mockOnPress = jest.fn();
      const { getByText } = render(<IssueCard issue={oneWeekAgo} onPress={mockOnPress} />);

      expect(getByText('1sem atrás')).toBeTruthy();
    });
  });
});
