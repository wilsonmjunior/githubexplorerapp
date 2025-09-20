import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useGetRepositoriesSearch } from '@/api/queries/useGetRepositoriesSearch';
import { RepositoryCard } from '@/components/RepositoryCard';
import { ListError, ListMessage } from '@/components/compound';
import { Header, Input, Loading } from '@/components/ui';
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
        <ListMessage>
          <ListMessage.Title variant="body" size="md" color="muted">
            Buscando repositórios...
          </ListMessage.Title>
        </ListMessage>
      );
    }

    if (searchQuery && !isError && !repositories?.length && !isLoading) {
      return (
        <ListMessage>
          <ListMessage.Title>Nenhum repositório encontrado</ListMessage.Title>
        </ListMessage>
      );
    }

    if (!searchQuery) {
      return (
        <ListMessage>
          <ListMessage.Title>GitHub Explorer</ListMessage.Title>
          <ListMessage.Subtitle>
            Busque por repositórios, explore detalhes e acompanhe issues
          </ListMessage.Subtitle>
        </ListMessage>
      );
    }

    return null;
  };

  const renderError = () => {
    return (
      <ListError>
        <ListError.Title>
          {(error as any)?.message || 'Erro ao buscar repositórios'}
        </ListError.Title>

        <ListError.Button onPress={() => refetch()}>Tentar Novamente</ListError.Button>
      </ListError>
    );
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return <Loading />;
    }

    if (!hasNextPage && repositories?.length && repositories.length > 0) {
      return (
        <ListMessage>
          <ListMessage.Title variant="caption" size="sm">
            Todos os repositórios foram carregados
          </ListMessage.Title>
        </ListMessage>
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

  list: {
    flex: 1,
  },
  listContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
}));
