import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { GitHubIssue } from '@/models/GitHubIssue';
import { formatRelativeTime } from '@/utils/date';
import { Avatar, Badge, Card, Text } from './ui';

interface IssueCardProps {
  issue: GitHubIssue;
  onPress: () => void;
}

export function IssueCard({ issue, onPress }: IssueCardProps) {
  const { theme } = useUnistyles();

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.issueIcon}>
          <MaterialIcons name="error-outline" size={20} color={theme.colors.success} />
        </View>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text variant="body" size="md" color="text">
              {issue.title}
            </Text>
          </View>

          <View style={styles.meta}>
            <Text variant="caption" size="sm" color="muted">
              #{issue.number}
            </Text>
            <Text variant="caption" size="sm" color="muted">
              •
            </Text>
            <View style={styles.author}>
              <Avatar size="xs" source={{ uri: issue.user.avatar_url }} />
              <Text variant="caption" size="sm" color="muted">
                {issue.user.login}
              </Text>
            </View>
            <Text variant="caption" size="sm" color="muted">
              •
            </Text>
            <Text variant="caption" size="sm" color="muted">
              {formatRelativeTime(issue.created_at)}
            </Text>
          </View>

          {issue.labels.length > 0 && (
            <View style={styles.labels}>
              {issue.labels.slice(0, 3).map((label) => (
                <Badge key={label.id}>{label.name}</Badge>
              ))}
              {issue.labels.length > 3 && (
                <Text variant="caption" size="xs" color="muted">
                  +{issue.labels.length - 3} mais
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  issueIcon: {
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  labels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
}));
