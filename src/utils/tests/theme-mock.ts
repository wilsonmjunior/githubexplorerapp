// Importar tema real já que agora usamos mocks oficiais
import { appThemes } from '../../theme';

// Export do tema para uso nos testes
export { appThemes };
export const mockTheme = appThemes.light; // tema padrão para testes

// Função utilitária para mockar tema específico (para compatibilidade)
export const mockUnistylesWithTheme = (themeName: keyof typeof appThemes = 'light') => {
  // Os mocks oficiais do Unistyles cuidam da implementação
  console.log(`Theme switched to: ${themeName}`);
  return appThemes[themeName];
};
