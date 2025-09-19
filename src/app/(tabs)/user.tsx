import { Input, Text } from '@/components/ui';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const TYPES = ['Todos', 'A', 'B', 'C', 'D'] as const;

type Type = (typeof TYPES)[number];

type UserData = {
  nmlabel: string;
  label: string;
  title: string;
  name: string;
  cpf: string;
  age: number;
  year: number;
  cdkey: string;
  id: string;
  type: Type;
};

type UseUserParams = {
  type: Type;
  search: string;
};

const MOCK_USERS_DATA: UserData[] = [
  {
    id: '1',
    nmlabel: 'João Silva',
    label: 'Developer',
    title: 'Senior Developer',
    name: 'João Silva',
    cpf: '123.456.789-00',
    age: 30,
    year: 2020,
    cdkey: 'DEV001',
    type: 'A',
  },
  {
    id: '2',
    nmlabel: 'Maria Santos',
    label: 'Designer',
    title: 'UI/UX Designer',
    name: 'Maria Santos',
    cpf: '987.654.321-00',
    age: 28,
    year: 2021,
    cdkey: 'DES001',
    type: 'B',
  },
  {
    id: '3',
    nmlabel: 'Pedro Lima',
    label: 'Manager',
    title: 'Project Manager',
    name: 'Pedro Lima',
    cpf: '456.789.123-00',
    age: 35,
    year: 2019,
    cdkey: 'MAN001',
    type: 'C',
  },
  {
    id: '4',
    nmlabel: 'Ana Costa',
    label: 'Analyst',
    title: 'Business Analyst',
    name: 'Ana Costa',
    cpf: '789.123.456-00',
    age: 27,
    year: 2022,
    cdkey: 'ANA001',
    type: 'D',
  },
  {
    id: '5',
    nmlabel: 'Carlos Mendes',
    label: 'Developer',
    title: 'Junior Developer',
    name: 'Carlos Mendes',
    cpf: '321.654.987-00',
    age: 25,
    year: 2023,
    cdkey: 'DEV002',
    type: 'A',
  },
];

function useUsers({ type, search }: UseUserParams) {
  const data = MOCK_USERS_DATA;

  const usersData = useMemo(() => {
    const filterAndSortMap: Record<
      string,
      {
        filterKey: keyof UserData;
        sortKey: keyof UserData;
      }
    > = {
      A: { filterKey: 'nmlabel', sortKey: 'age' },
      B: { filterKey: 'label', sortKey: 'age' },
      C: { filterKey: 'title', sortKey: 'year' },
      D: { filterKey: 'name', sortKey: 'year' },
      Todos: { filterKey: 'name', sortKey: 'age' }, // Campo padrão para busca geral
    };

    const config = filterAndSortMap[type];

    // Primeiro filtrar pelo tipo (se não for "Todos")
    let filteredData = type === 'Todos' ? data : data.filter((user) => user.type === type);

    // Se há busca, filtrar também pelo texto
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter((user) => {
        if (type === 'Todos') {
          // Para "Todos", buscar em múltiplos campos
          return (
            user.name.toLowerCase().includes(searchLower) ||
            user.nmlabel.toLowerCase().includes(searchLower) ||
            user.label.toLowerCase().includes(searchLower) ||
            user.title.toLowerCase().includes(searchLower) ||
            user.cpf.includes(search) ||
            user.cdkey.toLowerCase().includes(searchLower)
          );
        } else {
          // Para tipos específicos, usar o campo configurado
          const fieldValue = user[config.filterKey];
          console.log('label:fieldValue:: ', fieldValue, config.filterKey);
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(searchLower);
          }
          return String(fieldValue).toLowerCase().includes(searchLower);
        }
      });
    }

    // Ordenar os dados filtrados
    return filteredData.sort((a, b) => {
      const aValue = a[config.sortKey] as number;
      const bValue = b[config.sortKey] as number;
      return aValue - bValue;
    });
  }, [data, type, search]);

  return { usersData };
}

export default function UsersScreen() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<Type>('Todos');

  const { usersData } = useUsers({ type: selectedType, search });

  const getLabelAndKey = useCallback((item: UserData, index: number) => {
    let label = 'Unkown label';
    let key = index.toString();

    switch (item.type) {
      case 'A':
        label = item.nmlabel;
        key = item.cdkey;
        break;
      case 'B':
        label = item.label;
        key = item.id;
        break;
      case 'C':
        label = item.title;
        key = item.title;
        break;
      case 'D':
        label = item.name;
        key = item.cpf;
        break;
    }
    return { label, key };
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Input placeholder="Buscar usuário" value={search} onChangeText={handleSearch} />

          <View style={styles.typeButtonsWrapperContainer}>
            <Text variant="body" size="md">
              Tipo de usuário
            </Text>
            <View style={styles.typeButtonsWrapper}>
              {Object.values(TYPES).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, selectedType === type && styles.typeButtonSelected]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.title}>
            <Text variant="heading" size="lg">
              Lista de usuários
            </Text>
          </View>
        </View>

        <FlatList
          data={usersData}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item, index }) => {
            const { label, key } = getLabelAndKey(item, index);
            return (
              <View style={styles.userItem} key={key}>
                <View style={styles.userItemLabel}>
                  <Text>{label}</Text>
                  <Text>{key}</Text>
                </View>

                <Text>
                  <Text variant="heading" size="md">
                    Tipo:
                  </Text>{' '}
                  {item.type}
                </Text>
              </View>
            );
          }}
          style={styles.userList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginTop: theme.spacing.xl,
  },
  title: {
    marginTop: theme.spacing.xl,
  },

  typeButtonsWrapperContainer: {
    marginTop: theme.spacing.xl,
  },
  typeButtonsWrapper: {
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  typeButton: {
    minWidth: 40,
    padding: theme.spacing.md,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonSelected: {
    backgroundColor: theme.colors.primary,
  },

  userList: {
    flex: 1,
    marginTop: theme.spacing.xl,
  },
  userItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  userItemLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
