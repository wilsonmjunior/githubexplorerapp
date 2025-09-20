import React from 'react';
import { Text as RNText } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { RadiusToken, SizeToken, SpacingToken, TextToken } from './types';

export type DesignTokens = {
  spacing: Record<SpacingToken, number>;
  sizes: Record<SizeToken, number>;
  radius: Record<RadiusToken, number>;
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
};

export type TextProps = {
  variant?: TextToken;
  size?: SizeToken;
  color?: keyof DesignTokens['colors'];
  align?: 'center' | 'left' | 'right';
  children: React.ReactNode;
};

export function Text({
  variant = 'body',
  size = 'md',
  color = 'text',
  align = 'left',
  children,
  ...props
}: TextProps) {
  styles.useVariants({ variant, size, color });

  return (
    <RNText style={[styles.text, { textAlign: align }]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create((theme) => ({
  text: {
    fontWeight: '400',

    variants: {
      variant: {
        heading: {
          fontWeight: '600',
        },
        caption: {
          fontWeight: '400',
        },
        body: {
          fontWeight: '400',
        },
      },
      size: {
        xs: {
          fontSize: theme.sizes.xs,
          lineHeight: theme.sizes.xs * 1.4,
        },
        sm: {
          fontSize: theme.sizes.sm,
          lineHeight: theme.sizes.sm * 1.4,
        },
        md: {
          fontSize: theme.sizes.md,
          lineHeight: theme.sizes.md * 1.4,
        },
        lg: {
          fontSize: theme.sizes.lg,
          lineHeight: theme.sizes.lg * 1.4,
        },
        xl: {
          fontSize: theme.sizes.xl,
          lineHeight: theme.sizes.xl * 1.4,
        },
      },
      color: {
        primary: {
          color: theme.colors.primary,
        },
        background: {
          color: theme.colors.background,
        },
        surface: {
          color: theme.colors.surface,
        },
        text: {
          color: theme.colors.text,
        },
        muted: {
          color: theme.colors.muted,
        },
        border: {
          color: theme.colors.border,
        },
        success: {
          color: theme.colors.success,
        },
        warning: {
          color: theme.colors.warning,
        },
        danger: {
          color: theme.colors.danger,
        },
      },
    },

    compoundVariants: [
      {
        variant: 'heading',
        size: 'xs',
        styles: {
          lineHeight: theme.sizes.xs * 1.2,
        },
      },
      {
        variant: 'heading',
        size: 'sm',
        styles: {
          lineHeight: theme.sizes.sm * 1.2,
        },
      },
      {
        variant: 'heading',
        size: 'md',
        styles: {
          lineHeight: theme.sizes.md * 1.2,
        },
      },
      {
        variant: 'heading',
        size: 'lg',
        styles: {
          lineHeight: theme.sizes.lg * 1.2,
        },
      },
      {
        variant: 'heading',
        size: 'xl',
        styles: {
          lineHeight: theme.sizes.xl * 1.2,
        },
      },
      {
        variant: 'caption',
        size: 'xs',
        styles: {
          lineHeight: theme.sizes.xs * 1.3,
        },
      },
      {
        variant: 'caption',
        size: 'sm',
        styles: {
          lineHeight: theme.sizes.sm * 1.3,
        },
      },
      {
        variant: 'caption',
        size: 'md',
        styles: {
          lineHeight: theme.sizes.md * 1.3,
        },
      },
      {
        variant: 'caption',
        size: 'lg',
        styles: {
          lineHeight: theme.sizes.lg * 1.3,
        },
      },
      {
        variant: 'caption',
        size: 'xl',
        styles: {
          lineHeight: theme.sizes.xl * 1.3,
        },
      },
    ],
  },
}));
