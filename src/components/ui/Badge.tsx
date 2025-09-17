import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { DesignTokens, Text } from './Text';

export type BadgeToken = 'success' | 'warning' | 'danger' | 'default';

export type BadgeProps = {
  variant?: BadgeToken;
  children: React.ReactNode;
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  styles.useVariants({ variant: variant === 'default' ? undefined : variant });

  const colorMap: Record<BadgeToken, keyof DesignTokens['colors']> = {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    default: 'primary',
  };

  const color = colorMap[variant];

  return (
    <View style={styles.badge}>
      <Text variant="caption" size="xs" color={color}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',

    variants: {
      variant: {
        success: {
          backgroundColor: `${theme.colors.success}20`,
          borderColor: theme.colors.success,
        },
        warning: {
          backgroundColor: `${theme.colors.warning}20`,
          borderColor: theme.colors.warning,
        },
        danger: {
          backgroundColor: `${theme.colors.danger}20`,
          borderColor: theme.colors.danger,
        },
        default: {
          backgroundColor: `${theme.colors.primary}20`,
          borderColor: theme.colors.primary,
        },
      },
    },
  },
}));
