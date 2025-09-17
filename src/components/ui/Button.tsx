import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Text } from './Text';

export type ButtonProps = {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  styles.useVariants({
    variant,
    size,
    isDisabled,
  });

  const { theme } = useUnistyles();

  const getTextColor = () => {
    if (disabled) return 'text';
    if (loading) return 'primary';

    return variant === 'primary' ? 'background' : 'primary';
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {loading && <ActivityIndicator size="small" color={theme.colors[getTextColor()]} />}
        <Text size={size === 'sm' ? 'sm' : 'md'} color={getTextColor()} variant="body">
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: {
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    variants: {
      variant: {
        primary: {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        },
        outline: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
      },
      size: {
        sm: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          height: theme.spacing['3xl'],
        },
        md: {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          height: theme.spacing['4xl'],
        },
        lg: {
          paddingHorizontal: theme.spacing.xl,
          paddingVertical: theme.spacing.md,
          height: theme.spacing['5xl'],
        },
      },
      isDisabled: {
        true: {
          opacity: 0.6,
        },
      },
    },
    compoundVariants: [
      {
        variant: 'primary',
        isDisabled: true,
        styles: {
          backgroundColor: theme.colors.muted,
        },
      },
      {
        variant: 'outline',
        isDisabled: true,
        styles: {
          borderColor: theme.colors.muted,
        },
      },
    ],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
}));
