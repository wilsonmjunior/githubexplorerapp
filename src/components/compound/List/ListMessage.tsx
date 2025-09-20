import { View } from 'react-native';

import { StyleSheet } from 'react-native-unistyles';
import { Text, TextProps } from '../../ui';

function ListMessage({ children }: { children: React.ReactNode }) {
  return <View style={styles.empty}>{children}</View>;
}

function ListMessageTitle({
  children,
  variant = 'heading',
  size = 'lg',
  color = 'text',
  ...props
}: TextProps) {
  return (
    <Text variant={variant} size={size} color={color} align="center" {...props}>
      {children}
    </Text>
  );
}

function ListMessageSubtitle({
  children,
  variant = 'body',
  size = 'md',
  color = 'muted',
  ...props
}: TextProps) {
  return (
    <Text variant={variant} size={size} color={color} align="center" {...props}>
      {children}
    </Text>
  );
}

ListMessage.Title = ListMessageTitle;
ListMessage.Subtitle = ListMessageSubtitle;

export { ListMessage };

export const styles = StyleSheet.create((theme) => ({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
}));
