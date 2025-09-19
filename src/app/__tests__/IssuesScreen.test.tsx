import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator, FlatList, Linking, RefreshControl } from 'react-native';

import { appThemes, mockTheme, mockUnistylesWithTheme, render } from '../../utils/tests';
import IssuesScreen from '../repository/[owner]/[repo]/issues';

// Mock do expo-router
const mockUseLocalSearchParams = jest.fn();

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
};

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

// Mock do useGetRepositoryIssues
const mockUseGetRepositoryIssues = jest.fn();
jest.mock('../../api/queries', () => ({
  useGetRepositoryIssues: (owner: string, repo: string) => mockUseGetRepositoryIssues(owner, repo),
}));

// Mock do IssueCard
jest.mock('../../components/IssueCard', () => ({
  IssueCard: ({ issue, onPress }: any) => {
    const React = require('react');
    const { TouchableOpacity } = require('react-native');
    const { Text } = require('../../components/ui/Text');

    return React.createElement(
      TouchableOpacity,
      {
        onPress,
        testID: `issue-card-${issue.id}`,
      },
      React.createElement(Text, {}, `#${issue.number} - ${issue.title}`)
    );
  },
}));

// Mock do react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, props, children);
  },
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

// Dados mock para testes
const mockIssue1 = {
  id: 1,
  number: 123,
  title: 'Bug: Application crashes on startup',
  user: {
    id: 123,
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

const mockIssue2 = {
  id: 2,
  number: 124,
  title: 'Feature request: Add dark mode support',
  user: {
    id: 456,
    login: 'developer2',
    avatar_url: 'https://github.com/developer2.png',
  },
  labels: [
    {
      id: 3,
      name: 'enhancement',
      color: 'blue',
      description: 'New feature or request',
    },
  ],
  state: 'open' as const,
  created_at: '2023-12-02T08:00:00Z',
  updated_at: '2023-12-02T09:00:00Z',
  body: 'It would be great to have dark mode...',
  html_url: 'https://github.com/facebook/react/issues/124',
};

const mockIssueWithoutLabels = {
  id: 3,
  number: 125,
  title: 'Documentation update needed',
  user: {
    id: 789,
    login: 'developer3',
    avatar_url: 'https://github.com/developer3.png',
  },
  labels: [],
  state: 'open' as const,
  created_at: '2023-12-03T12:00:00Z',
  updated_at: '2023-12-03T12:30:00Z',
  body: null,
  html_url: 'https://github.com/facebook/react/issues/125',
};

describe('IssuesScreen', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // Mock do Linking usando spy
    jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

    // Mock padrão dos parâmetros da rota
    mockUseLocalSearchParams.mockReturnValue({
      owner: 'facebook',
      repo: 'react',
    });

    // Mock padrão do hook
    mockUseGetRepositoryIssues.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: jest.fn(),
      isRefetching: false,
    });
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
  };

  describe('Renderização inicial', () => {
    it('deve renderizar header corretamente', () => {
      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('Issues')).toBeTruthy();
    });

    it('deve chamar hook com parâmetros corretos', () => {
      renderWithQueryClient(<IssuesScreen />);
      expect(mockUseGetRepositoryIssues).toHaveBeenCalledWith('facebook', 'react');
    });
  });

  describe('Estados de loading', () => {
    it('deve mostrar loading quando carregando issues', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('Carregando issues...')).toBeTruthy();
    });

    it('deve mostrar loading no footer durante paginação', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: true,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { UNSAFE_getByType } = renderWithQueryClient(<IssuesScreen />);
      expect(() => UNSAFE_getByType(ActivityIndicator)).not.toThrow();
    });

    it('não deve mostrar footer quando não está carregando próxima página', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { queryByTestId } = renderWithQueryClient(<IssuesScreen />);
      expect(queryByTestId('loading-footer')).toBeNull();
    });
  });

  describe('Exibição de issues', () => {
    it('deve renderizar lista de issues', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1, mockIssue2]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);

      expect(getByText('#123 - Bug: Application crashes on startup')).toBeTruthy();
      expect(getByText('#124 - Feature request: Add dark mode support')).toBeTruthy();
    });

    it('deve mostrar mensagem quando nenhuma issue for encontrada', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);

      expect(getByText('Nenhuma issue encontrada')).toBeTruthy();
      expect(getByText('Este repositório não possui issues abertas')).toBeTruthy();
    });

    it('deve mesclar issues de múltiplas páginas', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1], [mockIssue2]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);

      expect(getByText('#123 - Bug: Application crashes on startup')).toBeTruthy();
      expect(getByText('#124 - Feature request: Add dark mode support')).toBeTruthy();
    });
  });

  describe('Interação com issues', () => {
    beforeEach(() => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1, mockIssue2]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
    });

    it('deve abrir URL da issue quando clicada', async () => {
      const { getByTestId } = renderWithQueryClient(<IssuesScreen />);
      const issueCard = getByTestId('issue-card-1');

      fireEvent.press(issueCard);

      await waitFor(() => {
        expect(Linking.openURL).toHaveBeenCalledWith(
          'https://github.com/facebook/react/issues/123'
        );
      });
    });

    it('deve abrir URL correta para diferentes issues', async () => {
      const { getByTestId } = renderWithQueryClient(<IssuesScreen />);
      const issueCard2 = getByTestId('issue-card-2');

      fireEvent.press(issueCard2);

      await waitFor(() => {
        expect(Linking.openURL).toHaveBeenCalledWith(
          'https://github.com/facebook/react/issues/124'
        );
      });
    });
  });

  describe('Estados de erro', () => {
    it('deve mostrar erro quando a requisição falha', () => {
      const mockError = new Error('Failed to fetch issues');
      mockUseGetRepositoryIssues.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: mockError,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('Failed to fetch issues')).toBeTruthy();
      expect(getByText('Tentar novamente')).toBeTruthy();
    });

    it('deve mostrar erro genérico quando não há mensagem específica', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('Erro ao carregar issues')).toBeTruthy();
    });

    it('deve chamar refetch quando botão "Tentar novamente" for pressionado', () => {
      const mockRefetch = jest.fn();
      mockUseGetRepositoryIssues.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error('Test error'),
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: mockRefetch,
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      const retryButton = getByText('Tentar novamente');

      fireEvent.press(retryButton);
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Paginação infinita', () => {
    it('deve chamar fetchNextPage quando chegar ao fim da lista', () => {
      const mockFetchNextPage = jest.fn();
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { UNSAFE_getByType } = renderWithQueryClient(<IssuesScreen />);
      const flatList = UNSAFE_getByType(FlatList);

      fireEvent(flatList, 'onEndReached');

      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar fetchNextPage quando não há próxima página', () => {
      const mockFetchNextPage = jest.fn();
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { UNSAFE_getByType } = renderWithQueryClient(<IssuesScreen />);
      const flatList = UNSAFE_getByType(FlatList);

      fireEvent(flatList, 'onEndReached');

      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it('não deve chamar fetchNextPage quando já está carregando próxima página', () => {
      const mockFetchNextPage = jest.fn();
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: true,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { UNSAFE_getByType } = renderWithQueryClient(<IssuesScreen />);
      const flatList = UNSAFE_getByType(FlatList);

      fireEvent(flatList, 'onEndReached');

      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });
  });

  describe('Pull to refresh', () => {
    it('deve chamar refetch quando pull to refresh for acionado', () => {
      const mockRefetch = jest.fn();
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: mockRefetch,
        isRefetching: false,
      });

      const { UNSAFE_getByType } = renderWithQueryClient(<IssuesScreen />);
      const refreshControl = UNSAFE_getByType(RefreshControl);

      fireEvent(refreshControl, 'onRefresh');
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('deve mostrar estado de refreshing corretamente', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: true,
      });

      const { UNSAFE_getByType } = renderWithQueryClient(<IssuesScreen />);
      const refreshControl = UNSAFE_getByType(RefreshControl);

      expect(refreshControl.props.refreshing).toBe(true);
    });
  });

  describe('Parâmetros da rota', () => {
    it('deve usar parâmetros corretos da rota', () => {
      mockUseLocalSearchParams.mockReturnValue({
        owner: 'microsoft',
        repo: 'vscode',
      });

      renderWithQueryClient(<IssuesScreen />);

      expect(mockUseGetRepositoryIssues).toHaveBeenCalledWith('microsoft', 'vscode');
    });

    it('deve lidar com parâmetros undefined', () => {
      mockUseLocalSearchParams.mockReturnValue({
        owner: undefined,
        repo: undefined,
      });

      renderWithQueryClient(<IssuesScreen />);

      expect(mockUseGetRepositoryIssues).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('Valores do tema', () => {
    beforeEach(() => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
    });

    it('deve usar cores do tema corretamente', () => {
      expect(mockTheme.colors.surface).toBe('#FFFFFF');
      expect(mockTheme.colors.background).toBe('#F8FAFC');
      expect(mockTheme.colors.primary).toBe('#6366F1');
    });

    it('deve usar spacing do tema corretamente', () => {
      expect(mockTheme.spacing.xl).toBe(16);
      expect(mockTheme.spacing.lg).toBe(12);
      expect(mockTheme.spacing.md).toBe(8);
    });

    it('deve testar com tema dark', () => {
      mockUnistylesWithTheme('dark');

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('Issues')).toBeTruthy();

      expect(appThemes.dark.colors.surface).toBe('#1E293B');
      expect(appThemes.dark.colors.background).toBe('#0F172A');

      // Restaurar tema light
      mockUnistylesWithTheme('light');
    });
  });

  describe('Casos extremos', () => {
    it('deve lidar com data undefined', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('Nenhuma issue encontrada')).toBeTruthy();
    });

    it('deve lidar com páginas null', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [null, [mockIssue1]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('#123 - Bug: Application crashes on startup')).toBeTruthy();
    });

    it('deve lidar com issue sem labels', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [[mockIssueWithoutLabels]],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('#125 - Documentation update needed')).toBeTruthy();
    });

    it('deve lidar com lista vazia quando não está carregando', () => {
      mockUseGetRepositoryIssues.mockReturnValue({
        data: {
          pages: [],
        },
        isLoading: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      const { getByText } = renderWithQueryClient(<IssuesScreen />);
      expect(getByText('Nenhuma issue encontrada')).toBeTruthy();
    });
  });
});
