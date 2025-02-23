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

## Order Management Technical Implementation

### Database Schema
```sql
-- Orders Table Structure
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  address_id uuid REFERENCES addresses NOT NULL,
  order_status order_status NOT NULL,
  payment_status payment_status NOT NULL,
  subtotal numeric NOT NULL,
  shipping_fee numeric NOT NULL,
  total numeric NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  notes text
);

-- RLS Policies
CREATE POLICY "Suppliers can view all orders" ON orders
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'supplier'
  ));

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppliers can update order status" ON orders
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'supplier'
  ));
```

### Status Management Implementation
```typescript
// Order Status Types
type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';

// Status Update Function
const handleUpdateStatus = async (newStatus: OrderStatus) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        order_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
    
    if (error) throw error;
    // Update UI and show success message
  } catch (error) {
    // Handle error and show error message
  }
};
```

### UI Components
1. Status Modal
   ```typescript
   const StatusModal = ({
     visible,
     currentStatus,
     onStatusSelect,
     onClose
   }) => {
     // Implementation details
   };
   ```

2. Status Display
   ```typescript
   const StatusBadge = ({
     status,
     size = 'medium'
   }) => {
     // Implementation details
   };
   ```

### Security Implementation
1. Role-Based Access Control
   ```typescript
   const checkSupplierAccess = async () => {
     const { data: profile } = await supabase
       .from('profiles')
       .select('role')
       .eq('id', userId)
       .single();
     
     return profile?.role === 'supplier';
   };
   ```

2. Data Access Control
   ```typescript
   // RLS policies ensure data security at database level
   // UI components respect user roles
   // All operations verify permissions
   ```

### State Management
1. Order State
   ```typescript
   interface OrderState {
     id: string;
     status: OrderStatus;
     updatedAt: string;
     // other fields
   }
   ```

2. UI State
   ```typescript
   interface UIState {
     isLoading: boolean;
     isModalVisible: boolean;
     error: Error | null;
     // other fields
   }
   ```

### Error Handling
```typescript
const handleError = (error: Error) => {
  console.error('Error:', error);
  Alert.alert('错误', '操作失败，请重试');
};
```

### Performance Considerations
1. Optimistic Updates
   - Update UI immediately
   - Revert on error
   - Show loading states

2. Data Fetching
   - Efficient queries
   - Proper indexing
   - Caching strategy 