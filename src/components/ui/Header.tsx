import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View, ViewProps } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Text, TextProps } from './Text';
import { TextToken } from './types';

type HeaderRootProps = ViewProps;

function HeaderRoot({ ...props }: HeaderRootProps) {
  return (
    <View
      {...props}
      style={[
        styles.container,
        props.children?.length > 1
          ? {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }
          : null,
      ]}
    />
  );
}

type HeaderActionButtonProps = TouchableOpacityProps;

const HeaderActionButton = memo(({ ...props }: HeaderActionButtonProps) => {
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      {...props}
      style={styles.actionButton}
      activeOpacity={0.9}
    />
  );
});

HeaderActionButton.displayName = 'HeaderActionButton';

type HeaderBackButtonProps = HeaderActionButtonProps;

const HeaderBackButton = memo(({ ...props }: HeaderBackButtonProps) => {
  const { theme } = useUnistyles();
  const { canGoBack, back } = useRouter();

  const handleGoBack = useCallback(() => {
    if (!canGoBack) return;

    back();
  }, [back, canGoBack]);

  return (
    <HeaderActionButton onPress={handleGoBack} {...props}>
      <Feather name="chevron-left" size={24} color={theme.colors.text} />
    </HeaderActionButton>
  );
});

HeaderBackButton.displayName = 'HeaderBackButton';

type HeaderTitleProps = Omit<TextProps, 'variant'> & {
  variant?: TextToken;
};

const HeaderTitle = memo(({ variant, ...props }: HeaderTitleProps) => {
  return (
    <Text {...props} variant="heading" align="center">
      {props.children}
    </Text>
  );
});

HeaderTitle.displayName = 'HeaderTitle';

export const Header = {
  Root: HeaderRoot,
  ActionButton: HeaderActionButton,
  BackButton: HeaderBackButton,
  Title: HeaderTitle,
};

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  actionButton: {
    width: theme.spacing['4xl'],
    height: theme.spacing['4xl'],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  actionPlaceholder: {
    width: theme.spacing['4xl'],
    height: theme.spacing['4xl'],
  },
}));
