import React from 'react';
import { TextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Text } from './Text';

export type InputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  ...props
}: InputProps) {
  styles.useVariants({ error: !!error });

  const { theme } = useUnistyles();

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="body" size="sm" color="text">
          {label}
        </Text>
      )}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        {...props}
      />
      {error && (
        <Text variant="caption" size="sm" color="danger">
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text variant="caption" size="sm" color="muted">
          {helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,

    variants: {
      error: {
        true: {
          borderColor: theme.colors.danger,
        },
        false: {
          borderColor: theme.colors.border,
        },
      },
    },

    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.sizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    height: theme.spacing['4xl'] + 8,
  },
  focused: {
    borderColor: theme.colors.primary,
  },
}));
