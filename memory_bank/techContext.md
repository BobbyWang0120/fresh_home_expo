# Technical Context

## Technology Stack
1. **Frontend**
   - React Native with Expo
   - TypeScript for type safety
   - React Navigation for routing
   - Expo Router for file-based routing
   - Expo Image Picker for media selection

2. **Backend**
   - Supabase for backend services
   - PostgreSQL database
   - Row Level Security (RLS)
   - Supabase Storage for images
   - Real-time subscriptions

3. **Development Tools**
   - VS Code as primary IDE
   - ESLint for code linting
   - Prettier for code formatting
   - Git for version control
   - npm for package management

## Database Schema
1. **Core Tables**
   ```sql
   -- Products table
   CREATE TABLE products (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     discounted_price DECIMAL(10,2) NOT NULL,
     unit TEXT NOT NULL,
     origin TEXT NOT NULL,
     description TEXT,
     stock INTEGER NOT NULL DEFAULT 0,
     category TEXT REFERENCES categories(name),
     supplier_id UUID REFERENCES auth.users(id),
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Product Images table
   CREATE TABLE product_images (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     product_id UUID REFERENCES products(id) ON DELETE CASCADE,
     storage_path TEXT NOT NULL,
     is_primary BOOLEAN DEFAULT false,
     sort_order INTEGER NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Categories table
   CREATE TABLE categories (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT UNIQUE NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

## Development Setup
1. **Environment Requirements**
   - Node.js 16+
   - npm or yarn
   - Expo CLI
   - iOS Simulator/Android Emulator
   - Supabase CLI

2. **Configuration Files**
   - `.env` for environment variables
   - `app.json` for Expo configuration
   - `tsconfig.json` for TypeScript
   - `package.json` for dependencies

3. **Key Dependencies**
   - @supabase/supabase-js
   - expo-router
   - expo-image-picker
   - react-native-safe-area-context
   - @react-navigation/native

## Technical Constraints
1. **Mobile Platform**
   - iOS 13+ support
   - Android API level 21+ support
   - Expo managed workflow limitations

2. **Performance**
   - Image optimization requirements
   - Network bandwidth considerations
   - Mobile device memory constraints

3. **Security**
   - RLS policies implementation
   - User authentication requirements
   - Data access control

## Deployment
1. **Development**
   - Local development with Expo Go
   - Supabase local development

2. **Testing**
   - Jest for unit testing
   - React Native Testing Library
   - E2E testing with Detox

3. **Production**
   - App Store deployment
   - Play Store deployment
   - Supabase cloud hosting 