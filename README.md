# 🚀 GitHub Explorer Mobile App

A modern React Native mobile application for exploring GitHub repositories and issues, built with Expo and powered by a robust design system.

## 📱 Features

- **Repository Search**: Browse and search GitHub repositories with real-time results
- **Issue Tracking**: View and explore repository issues with detailed information
- **Modern Design System**: Consistent UI components with light/dark theme support
- **Responsive Design**: Optimized for different screen sizes and orientations
- **Offline-Ready**: Built with React Query for intelligent caching and data management

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack React Query
- **Styling**: React Native Unistyles
- **UI Components**: Custom design system
- **API**: GitHub REST API

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version compatible with React 19.x)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd alymentegit
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_GITHUB_API_BASE=https://api.github.com
EXPO_PUBLIC_GITHUB_TOKEN=your_github_token_here (optional)
```

> **Note**: The GitHub token is optional but recommended to avoid API rate limits.

### 4. Start Development Server

```bash
npm start
# or
expo start
```

## 📱 Running on Devices

### Development Builds

```bash
# Android
npm run android
# or
expo run:android

# iOS (macOS only)
npm run ios
# or
expo run:ios

# Web
npm run web
# or
expo start --web
```

### Using Expo Go

1. Install **Expo Go** on your mobile device
2. Scan the QR code from the terminal/browser
3. The app will load directly on your device

## 🏗️ Architecture Overview

### **Design Patterns & Principles**

#### 1. **Component-Based Architecture**

The application follows a modular component-based approach with clear separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Design system components
│   └── business/       # Feature-specific components
├── app/                # File-based routing (Expo Router)
├── api/                # Data fetching and API logic
├── models/             # TypeScript interfaces and types
└── theme/              # Design tokens and styling
```

#### 2. **File-Based Routing (Expo Router)**

- **Why**: Simplifies navigation structure and provides better developer experience
- **Benefits**:
  - Automatic route generation
  - Type-safe navigation
  - Nested layouts support
  - Easy deep linking

#### 3. **Design System Architecture**

The UI follows atomic design principles:

```
components/ui/
├── Text.tsx           # Typography component
├── Button.tsx         # Action components
├── Badge.tsx          # Status indicators
├── Card.tsx           # Container components
├── Input.tsx          # Form components
├── Avatar.tsx         # Media components
└── Header.tsx         # Layout components
```

**Key Features**:

- **Variant-based styling** with React Native Unistyles
- **Type-safe theme tokens** for colors, spacing, and typography
- **Consistent component APIs** across the design system
- **Responsive design** with breakpoint support

#### 4. **State Management Strategy**

**TanStack React Query** for server state:

- **Why**: Specialized for server-state management with caching, background updates, and optimistic updates
- **Benefits**:
  - Automatic background refetching
  - Intelligent caching strategies
  - Loading and error states
  - Pagination support
  - Offline resilience

**React Hooks** for local state:

- Simple, predictable state management
- Reduces complexity for component-level state

#### 5. **Styling Architecture**

**React Native Unistyles**:

- **Why**: Provides powerful theming with type safety and performance
- **Features**:
  - Theme-aware styling with TypeScript support
  - Variant-based component styling
  - Responsive breakpoints
  - Runtime theme switching
  - Scoped themes support

**Design Token System**:

```typescript
const theme = {
  colors: { primary, background, surface, text, muted, ... },
  spacing: { xs, sm, md, lg, xl, ... },
  typography: { heading, body, caption },
  radius: { sm, md, lg },
}
```

#### 6. **API Architecture**

**Layered API Structure**:

```
api/
├── clients/           # HTTP clients and configuration
├── queries/           # React Query hooks for data fetching
├── mutations/         # React Query hooks for data modification
└── types/            # API response types
```

**Benefits**:

- **Separation of concerns** between data fetching and UI
- **Reusable query hooks** across components
- **Type-safe API responses**
- **Centralized error handling**

### **Key Architectural Decisions**

#### ✅ **React Native + Expo**

- **Faster development** with hot reload and OTA updates
- **Cross-platform compatibility** with single codebase
- **Rich ecosystem** of pre-built modules and tools
- **Easy deployment** to app stores

#### ✅ **TypeScript First**

- **Type safety** throughout the application
- **Better developer experience** with autocomplete and error detection
- **Self-documenting code** with interfaces and types
- **Refactoring confidence** with compile-time checks

#### ✅ **React Query for Data Management**

- **Specialized tool** for server-state challenges
- **Built-in caching** reduces API calls and improves performance
- **Background updates** keep data fresh automatically
- **Optimistic updates** for better user experience

#### ✅ **Custom Design System**

- **Consistent UI/UX** across the entire application
- **Maintainable styling** with centralized design tokens
- **Scalable component library** for future features
- **Type-safe theming** prevents styling inconsistencies

## 🎨 Design System

The app features a comprehensive design system with:

- **Typography Scale**: Consistent text sizing and hierarchy
- **Color Palette**: Semantic color tokens for light/dark themes
- **Spacing System**: Harmonious spacing scale for layouts
- **Component Variants**: Flexible component styling options
- **Responsive Breakpoints**: Adaptive layouts for different screen sizes

## 📝 Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Build and run on Android
npm run ios        # Build and run on iOS
npm run web        # Run as web application
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler
npm test           # Run unit tests with watch mode
npm run test:coverage # Run tests and generate coverage report
```

## 🧪 Testing

This project includes comprehensive unit tests for components and screens to ensure code quality and reliability.

### **Test Architecture**

The testing strategy focuses on:

- **Component Testing**: All UI components have corresponding unit tests
- **Screen Testing**: Main application screens are tested for user interactions
- **Testing Library**: Uses `@testing-library/react-native` for user-centric testing
- **Coverage Reports**: Generates detailed coverage reports for code quality tracking

### **Test Structure**

```
src/
├── app/__tests__/              # Screen tests
│   ├── IssuesScreen.test.tsx
│   ├── RepositoryScreen.test.tsx
│   └── SearchScreen.test.tsx
└── components/__tests__/       # Component tests
    ├── ui/                     # Design system component tests
    │   ├── Avatar.test.tsx
    │   ├── Badge.test.tsx
    │   ├── Button.test.tsx
    │   ├── Card.test.tsx
    │   ├── Header.test.tsx
    │   ├── Input.test.tsx
    │   └── Text.test.tsx
    ├── IssueCard.test.tsx      # Business component tests
    └── RepositoryCard.test.tsx
```

### **Running Tests**

#### **Development Mode (Watch)**

```bash
npm test
# or
jest --watchAll
```

This runs tests in watch mode, automatically re-running tests when files change.

#### **Single Run**

```bash
npx jest
```

#### **Generate Coverage Report**

```bash
npm run test:coverage
# or
jest --coverage
```

### **Coverage Reports**

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/lcov-report/index.html` - Interactive coverage browser
- **LCOV**: `coverage/lcov.info` - For CI/CD integration
- **JSON**: `coverage/coverage-final.json` - Machine-readable format
- **Clover**: `coverage/clover.xml` - XML format for tools integration

To view the HTML coverage report:

```bash
# Generate coverage and open in browser
npm run test:coverage && open coverage/lcov-report/index.html
```

### **Test Configuration**

Tests are configured in `package.json` with Jest preset for Expo:

```json
{
  "jest": {
    "preset": "jest-expo",
    "setupFiles": ["react-native-unistyles/mocks", "./src/theme/index.ts"],
    "collectCoverage": true,
    "collectCoverageFrom": [
      "**/*.{ts,tsx,js,jsx}",
      "!**/coverage/**",
      "!**/node_modules/**",
      "!**/babel.config.js",
      "!**/expo-env.d.ts",
      "!**/.expo/**"
    ]
  }
}
```

### **Writing Tests**

When adding new components or features, follow these testing guidelines:

1. **Create test files** alongside components: `ComponentName.test.tsx`
2. **Test user interactions** rather than implementation details
3. **Use descriptive test names** that explain the expected behavior
4. **Mock external dependencies** (APIs, native modules) appropriately
5. **Aim for high coverage** while focusing on critical user paths

Example test structure:

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { YourComponent } from '../YourComponent';

describe('YourComponent', () => {
  it('should render correctly with required props', () => {
    render(<YourComponent title="Test" />);
    expect(screen.getByText('Test')).toBeTruthy();
  });

  it('should handle user interactions', () => {
    const onPress = jest.fn();
    render(<YourComponent onPress={onPress} />);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React Native and Expo**
