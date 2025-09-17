import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useGetRepository } from '@/api/queries';
import { Avatar, Badge, Button, Card, Header, Text } from '@/components/ui';

export default function RepositoryScreen() {
  const { owner, repo } = useLocalSearchParams<{ owner: string; repo: string }>();

  const { theme } = useUnistyles();

  const insets = useSafeAreaInsets();

  const { data: repository, isLoading, isError, error, refetch } = useGetRepository(owner!, repo!);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleOpenIssues = () => {
    router.push({
      pathname: '/repository/[owner]/[repo]/issues',
      params: { owner, repo },
    });
  };

  const handleOpenGitHub = () => {
    if (repository?.html_url) {
      Linking.openURL(repository.html_url);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loading}>
          <Text variant="body" size="md" color="muted">
            Carregando repositório...
          </Text>
        </View>
      </View>
    );
  }

  if (isError || !repository) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.error}>
          <Text variant="body" size="md" color="danger">
            {(error as any)?.message || 'Erro ao carregar repositório'}
          </Text>
          <Button variant="outline" onPress={() => refetch()}>
            Tentar novamente
          </Button>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header.Root>
        <Header.BackButton />
        <Header.Title>Repositório</Header.Title>
        <Header.ActionButton />
      </Header.Root>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: theme.spacing.xl + insets.bottom },
        ]}
      >
        <Card>
          <View style={styles.header}>
            <Avatar size="lg" source={{ uri: repository.owner.avatar_url }} />
            <View style={styles.ownerInfo}>
              <Text variant="caption" size="sm" color="muted">
                {repository.owner.login}
              </Text>
              <Text variant="heading" size="lg" color="text">
                {repository.name}
              </Text>
            </View>
          </View>

          {repository.description && (
            <View style={styles.description}>
              <Text variant="body" size="md" color="text">
                {repository.description}
              </Text>
            </View>
          )}

          {repository.language && <Badge>{repository.language}</Badge>}
        </Card>

        <View style={styles.statsGrid}>
          <Card>
            <View style={styles.statCard}>
              <MaterialIcons name="star" size={24} color={theme.colors.warning} />
              <Text variant="heading" size="lg" color="text">
                {formatNumber(repository.stargazers_count)}
              </Text>
              <Text variant="caption" size="sm" color="muted">
                Stars
              </Text>
            </View>
          </Card>

          <Card>
            <View style={styles.statCard}>
              <MaterialIcons name="call-split" size={24} color={theme.colors.primary} />
              <Text variant="heading" size="lg" color="text">
                {formatNumber(repository.forks_count)}
              </Text>
              <Text variant="caption" size="sm" color="muted">
                Forks
              </Text>
            </View>
          </Card>

          <Card>
            <View style={styles.statCard}>
              <MaterialIcons name="visibility" size={24} color={theme.colors.success} />
              <Text variant="heading" size="lg" color="text">
                {formatNumber(repository.watchers_count)}
              </Text>
              <Text variant="caption" size="sm" color="muted">
                Watching
              </Text>
            </View>
          </Card>
        </View>

        <Card>
          <View style={styles.actions}>
            <Button variant="primary" onPress={handleOpenIssues}>
              Ver Issues
            </Button>
            <Button variant="outline" onPress={handleOpenGitHub}>
              Abrir no GitHub
            </Button>
          </View>
        </Card>

        <Card>
          <View style={styles.infoContent}>
            <Text variant="heading" size="md" color="text">
              Informações
            </Text>
          </View>

          <View style={styles.metaInfo}>
            <View style={styles.metaRow}>
              <MaterialIcons name="calendar-today" size={16} color={theme.colors.muted} />
              <Text variant="body" size="sm" color="muted">
                Criado em {formatDate(repository.created_at)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <MaterialIcons name="update" size={16} color={theme.colors.muted} />
              <Text variant="body" size="sm" color="muted">
                Atualizado em {formatDate(repository.updated_at)}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContainer: {
    backgroundColor: theme.colors.background,
  },
  content: {
    gap: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  ownerInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  repoName: {
    marginBottom: theme.spacing.md,
  },
  description: {
    marginVertical: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actions: {
    gap: theme.spacing.md,
  },
  infoContent: {
    marginBottom: theme.spacing.md,
  },
  metaInfo: {
    gap: theme.spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
}));
