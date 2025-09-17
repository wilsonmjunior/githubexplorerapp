import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { GitHubRepository } from '@/models/GitHubRepository';
import { Avatar, Badge, Card, Text } from './ui';

interface RepositoryCardProps {
  repository: GitHubRepository;
  onPress: () => void;
}

export function RepositoryCard({ repository, onPress }: RepositoryCardProps) {
  const { theme } = useUnistyles();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Avatar size="sm" source={{ uri: repository.owner.avatar_url }} />
        <View style={styles.ownerInfo}>
          <Text variant="caption" size="sm" color="muted">
            {repository.owner.login}
          </Text>
        </View>
      </View>

      <View style={styles.repoName}>
        <Text variant="heading" size="md" color="text">
          {repository.name}
        </Text>
      </View>

      {repository.description && (
        <View style={styles.description}>
          <Text variant="body" size="sm" color="muted" numberOfLines={2}>
            {repository.description}
          </Text>
        </View>
      )}

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <MaterialIcons name="star" size={16} color={theme.colors.warning} />
          <Text variant="caption" size="sm" color="muted">
            {formatNumber(repository.stargazers_count)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <MaterialIcons name="call-split" size={16} color={theme.colors.muted} />
          <Text variant="caption" size="sm" color="muted">
            {formatNumber(repository.forks_count)}
          </Text>
        </View>

        <View style={styles.languageContainer}>
          {repository.language && <Badge>{repository.language}</Badge>}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  ownerInfo: {
    flex: 1,
  },
  repoName: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    marginBottom: theme.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  languageContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
}));
