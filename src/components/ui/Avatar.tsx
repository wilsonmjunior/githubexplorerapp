import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { SizeToken } from './types';

export type AvatarProps = {
  size?: SizeToken;
  source: { uri: string };
};

export function Avatar({ size = 'md', source }: AvatarProps) {
  styles.useVariants({ size });

  return (
    <View style={styles.container}>
      <Image source={source} style={styles.image} contentFit="cover" transition={200} />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.colors.surface,

    variants: {
      size: {
        xs: {
          width: theme.spacing['2xl'],
          height: theme.spacing['2xl'],
          borderRadius: theme.spacing['2xl'] / 2,
        },
        sm: {
          width: theme.spacing['3xl'],
          height: theme.spacing['3xl'],
          borderRadius: theme.spacing['3xl'] / 2,
        },
        md: {
          width: theme.spacing['4xl'],
          height: theme.spacing['4xl'],
          borderRadius: theme.spacing['4xl'] / 2,
        },
        lg: {
          width: theme.spacing['5xl'],
          height: theme.spacing['5xl'],
          borderRadius: theme.spacing['5xl'] / 2,
        },
        xl: {
          width: theme.spacing['3xl'] * 2,
          height: theme.spacing['3xl'] * 2,
          borderRadius: (theme.spacing['3xl'] * 2) / 2,
        },
      },
    },

    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
}));
