import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, Linking, RefreshControl, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useGetRepositoryIssues } from '@/api/queries';
import { IssueCard } from '@/components/IssueCard';
import { Button, Header, Text } from '@/components/ui';
import { GitHubIssue } from '@/models/GitHubIssue';

export default function IssuesScreen() {
  const { owner, repo } = useLocalSearchParams<{ owner: string; repo: string }>();

  const { theme } = useUnistyles();

  const insets = useSafeAreaInsets();

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
  } = useGetRepositoryIssues(owner!, repo!);

  const issues = useMemo(() => {
    return data?.pages.flatMap((page) => page || []);
  }, [data]);

  const handleIssuePress = (issue: GitHubIssue) => {
    Linking.openURL(issue.html_url);
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.empty}>
          <Text variant="body" size="md" color="muted">
            Carregando issues...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.empty}>
        <Text variant="heading" size="md" color="text">
          Nenhuma issue encontrada
        </Text>
        <Text variant="body" size="sm" color="muted">
          Este repositório não possui issues abertas
        </Text>
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.error}>
      <Text variant="body" size="md" color="danger">
        {(error as any)?.message || 'Erro ao carregar issues'}
      </Text>
      <Button variant="outline" onPress={() => refetch()}>
        Tentar novamente
      </Button>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Header.Root>
        <Header.BackButton />
        <Header.Title>Issues</Header.Title>
        <Header.ActionButton />
      </Header.Root>

      <View style={styles.content}>
        {isError ? (
          renderError()
        ) : (
          <FlatList
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              {
                paddingBottom: theme.spacing.lg + insets.bottom,
              },
            ]}
            data={issues}
            renderItem={({ item }) => (
              <IssueCard issue={item} onPress={() => handleIssuePress(item)} />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
}));
