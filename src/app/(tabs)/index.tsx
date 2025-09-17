import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useGetRepositoriesSearch } from '@/api/queries/useGetRepositoriesSearch';
import { RepositoryCard } from '@/components/RepositoryCard';
import { Button, Header, Input, Text } from '@/components/ui';
import { GitHubRepository } from '@/models/GitHubRepository';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const { theme } = useUnistyles();

  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useGetRepositoriesSearch(searchQuery, searchQuery.length > 0);

  const repositories = useMemo(() => {
    return data?.pages.flatMap((page) => page.items || []);
  }, [data]);

  const handleRepositoryPress = (repository: GitHubRepository) => {
    router.push({
      pathname: '/repository/[owner]/[repo]',
      params: {
        owner: repository.owner.login,
        repo: repository.name,
      },
    });
  };

  const renderEmpty = () => {
    if (isLoading && !repositories?.length) {
      return (
        <View style={styles.empty}>
          <Text variant="body" size="md" color="muted">
            Buscando repositórios...
          </Text>
        </View>
      );
    }

    if (searchQuery && !isError && !repositories?.length && !isLoading) {
      return (
        <View style={styles.empty}>
          <Text variant="body" size="md" color="muted">
            Nenhum repositório encontrado
          </Text>
        </View>
      );
    }

    if (!searchQuery) {
      return (
        <View style={styles.empty}>
          <Text variant="heading" size="lg" color="text">
            GitHub Explorer
          </Text>
          <Text variant="body" size="md" color="muted" align="center">
            Busque por repositórios, explore detalhes e acompanhe issues
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderError = () => {
    return (
      <View style={styles.error}>
        <Text variant="body" size="md" color="danger">
          {(error as any)?.message || 'Erro ao buscar repositórios'}
        </Text>
        <Button variant="outline" onPress={() => refetch()}>
          Tentar Novamente
        </Button>
      </View>
    );
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }

    if (!hasNextPage && repositories?.length && repositories.length > 0) {
      return (
        <View style={styles.footer}>
          <Text variant="caption" size="sm" color="muted">
            Todos os repositórios foram carregados
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <Header.Root>
        <Header.Title>Github Explorer</Header.Title>
      </Header.Root>

      <View style={styles.content}>
        <Input placeholder="Buscar repositório" value={searchQuery} onChangeText={setSearchQuery} />

        {isError ? (
          renderError()
        ) : (
          <FlatList
            data={repositories}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <RepositoryCard repository={item} onPress={() => handleRepositoryPress(item)} />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage && !isLoading) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
                tintColor={theme.colors.primary}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  footer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
}));
