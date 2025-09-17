import React from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, UnistylesRuntime, useUnistyles } from 'react-native-unistyles';

import { Avatar, Badge, Button, Card, Input, Text } from '@/components/ui';

export default function DesignSystemScreen() {
  const { theme, rt } = useUnistyles();

  const insets = useSafeAreaInsets();

  const handleToggleTheme = () => {
    const nextTheme = UnistylesRuntime.themeName === 'dark' ? 'light' : 'dark';
    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme(nextTheme);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingBottom: theme.spacing.xl + insets.bottom }]}
    >
      <Card>
        <View style={styles.themeToggle}>
          <Text variant="heading" size="md">
            {`Tema ${rt.themeName === 'dark' ? 'Escuro' : 'Claro'}`}
          </Text>
          <Switch
            value={UnistylesRuntime.themeName === 'dark'}
            onValueChange={handleToggleTheme}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.background}
          />
        </View>
      </Card>

      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Tipografia
        </Text>
        <Card>
          <View style={styles.section}>
            <Text variant="heading" size="xl">
              Heading XL
            </Text>
            <Text variant="heading" size="lg">
              Heading LG
            </Text>
            <Text variant="heading" size="md">
              Heading MD
            </Text>
            <Text variant="body" size="lg">
              Body Large
            </Text>
            <Text variant="body" size="md">
              Body Medium
            </Text>
            <Text variant="body" size="sm">
              Body Small
            </Text>
            <Text variant="caption" size="md">
              Caption Medium
            </Text>
            <Text variant="caption" size="sm">
              Caption Small
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Cores
        </Text>
        <Card>
          <View style={styles.tokenGrid}>
            {Object.entries(theme.colors).map(([name, color]) => (
              <View key={name} style={styles.tokenItem}>
                <View style={[styles.colorSwatch, { backgroundColor: color }]} />
                <Text variant="caption" size="xs">
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Espaçamento
        </Text>
        <Card>
          <View style={styles.tokenGrid}>
            {Object.entries(theme.spacing).map(([name, value]) => (
              <View key={name} style={styles.tokenItem}>
                <View style={[styles.spacingBox, { width: value * 2, height: value * 2 }]} />
                <Text variant="caption" size="xs">
                  {name}
                </Text>
                <Text variant="caption" size="xs" color="muted">
                  {value}px
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Botões
        </Text>
        <Card>
          <View style={styles.section}>
            <Text variant="body" size="sm" color="muted">
              Variantes
            </Text>
            <View style={styles.row}>
              <Button variant="primary">Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </View>

            <Text variant="body" size="sm" color="muted">
              Tamanhos
            </Text>
            <View style={styles.row}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </View>

            <Text variant="body" size="sm" color="muted">
              Estados
            </Text>
            <View style={styles.row}>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Inputs
        </Text>
        <Card>
          <View style={styles.section}>
            <Input
              label="Campo Normal"
              value=""
              onChangeText={() => {}}
              placeholder="Digite algo..."
            />
            <Input
              label="Campo com Erro"
              value=""
              onChangeText={() => {}}
              error="Este campo é obrigatório"
            />
            <Input
              label="Campo com Ajuda"
              value=""
              onChangeText={() => {}}
              helperText="Texto de ajuda aqui"
            />
          </View>
        </Card>
      </View>

      {/* Badges */}
      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Badges
        </Text>
        <Card>
          <View style={styles.row}>
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Avatars
        </Text>
        <Card>
          <View style={styles.row}>
            <Avatar size="xs" source={{ uri: 'https://github.com/github.png' }} />
            <Avatar size="sm" source={{ uri: 'https://github.com/github.png' }} />
            <Avatar size="md" source={{ uri: 'https://github.com/github.png' }} />
            <Avatar size="lg" source={{ uri: 'https://github.com/github.png' }} />
            <Avatar size="xl" source={{ uri: 'https://github.com/github.png' }} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <Text variant="heading" size="lg">
          Cards
        </Text>
        <Card>
          <Text variant="heading" size="md">
            Card com Conteúdo
          </Text>
          <Text variant="body" size="sm" color="muted">
            Este é um exemplo de card com conteúdo. Cards são úteis para agrupar informações
            relacionadas.
          </Text>
        </Card>
        <Card onPress={() => {}}>
          <Text variant="heading" size="md">
            Card Clicável
          </Text>
          <Text variant="body" size="sm" color="muted">
            Este card pode ser pressionado e executar uma ação.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  tokenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tokenItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
    minWidth: 80,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  spacingBox: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
  },
}));
