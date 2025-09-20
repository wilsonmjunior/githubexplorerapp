import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button, ButtonProps, Text, TextProps } from '../../ui';

type ListErrorProps = {
  children: React.ReactNode;
};

function ListError({ children }: ListErrorProps) {
  return <View style={styles.error}>{children}</View>;
}

function ListErrorTitle({
  children,
  variant = 'body',
  size = 'md',
  color = 'danger',
  ...props
}: TextProps) {
  return (
    <Text variant={variant} size={size} color={color} {...props}>
      {children}
    </Text>
  );
}

function ListErrorButton({ children, ...props }: ButtonProps) {
  return (
    <Button variant="outline" {...props}>
      {children}
    </Button>
  );
}

ListError.Title = ListErrorTitle;
ListError.Button = ListErrorButton;

export { ListError };

const styles = StyleSheet.create((theme) => ({
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
}));
