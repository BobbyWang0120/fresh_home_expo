# System Patterns

## Architecture Overview
1. **Frontend Architecture**
   - Expo-based React Native application
   - Tab-based navigation structure
   - Component-based UI architecture
   - Context-based state management

2. **Data Flow**
   - Supabase for data persistence
   - Local state management with Context API
   - AsyncStorage for offline data
   - Real-time updates where applicable

## Key Technical Decisions
1. **Framework Choice**
   - Expo for rapid development and easy deployment
   - React Native for cross-platform compatibility
   - TypeScript for type safety
   - Supabase for backend services

2. **UI/UX Patterns**
   - Reusable component architecture
   - Consistent theming system
   - Haptic feedback integration
   - Responsive layouts
   - Native-feeling animations

3. **State Management**
   - React Context for global state
   - Local component state where appropriate
   - Persistent storage with AsyncStorage
   - Real-time data sync with Supabase

## Code Organization
1. **Directory Structure**
   - Feature-based organization in `/app`
   - Shared components in `/components`
   - Business logic in contexts and hooks
   - Utility functions in `/lib`
   - Configuration in root directory

2. **Naming Conventions**
   - PascalCase for components
   - camelCase for functions and variables
   - Descriptive, purpose-indicating names
   - Consistent file naming patterns

3. **Component Patterns**
   - Functional components with hooks
   - Separation of concerns
   - Reusable UI components
   - Consistent prop interfaces 