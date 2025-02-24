# System Architecture and Patterns

## Database Structure
1. **Core Tables**
   - `products`: Main product information
   - `categories`: Product categories
   - `product_images`: Product image management
   - `orders`: Order tracking
   - `order_items`: Order line items
   - `profiles`: User profiles with synced auth data
   - `addresses`: Delivery addresses

2. **Key Relationships**
   - Products belong to categories
   - Products have multiple images
   - Orders belong to users
   - Order items belong to orders and products
   - Profiles link to auth.users with synced data

## Frontend Architecture
1. **Navigation**
   - Tab-based main navigation
   - Stack navigation for detailed views
   - Modal presentations for forms
   - Screen refresh using useFocusEffect

2. **Component Structure**
   - Atomic design pattern
   - Reusable UI components
   - Screen-specific components
   - Form components with validation
   - Product list components for management

3. **State Management**
   - Local component state for UI
   - Context for global state
   - Supabase real-time subscriptions
   - Auto-refresh patterns for consistency

## Design Patterns
1. **UI/UX Patterns**
   - Modern black-and-white theme
   - Consistent spacing and typography
   - Form validation patterns
   - Loading states and error handling
   - Image upload and preview
   - Card-based list views

2. **Code Organization**
   - Feature-based directory structure
   - Shared components library
   - Utility functions
   - Type definitions
   - Constants and configurations

3. **Data Flow**
   - Unidirectional data flow
   - Props drilling minimization
   - Event-based communication
   - API abstraction layer
   - Auto-refresh on navigation focus

## Security Patterns
1. **Authentication**
   - Supabase authentication
   - Role-based access control
   - Session management
   - Secure storage

2. **Data Access**
   - Row Level Security (RLS)
   - Role-based permissions
   - Data validation
   - Input sanitization
   - Data synchronization triggers

## Development Patterns
1. **Code Quality**
   - TypeScript for type safety
   - ESLint for code style
   - Prettier for formatting
   - Git flow for version control

2. **Testing Strategy**
   - Unit tests for utilities
   - Component testing
   - Integration testing
   - E2E testing plan

3. **Performance Optimization**
   - Image optimization
   - Lazy loading
   - Caching strategies
   - Bundle optimization
   - Efficient data fetching

## Order Management Patterns

### Order Status Management
1. Status Flow Pattern
   ```
   pending → confirmed → processing → shipping → delivered
   (cancelled can be set from any status)
   ```

2. Status Update Pattern
   - Role-based access control
   - Real-time UI updates
   - Database synchronization
   - Audit trail maintenance
   - Screen refresh on navigation

3. Security Pattern
   ```sql
   -- RLS Policy Pattern for Suppliers
   CREATE POLICY "Suppliers can update order status" ON public.orders
   FOR UPDATE TO authenticated
   USING (
     EXISTS (
       SELECT 1 FROM profiles
       WHERE profiles.id = auth.uid()
       AND profiles.role = 'supplier'
     )
   )
   ```

### UI Patterns

1. Status Display Pattern
   - Color coding for different statuses
   - Clear status labels
   - Visual status transitions
   - Loading states during updates

2. Modal Pattern for Updates
   - Bottom sheet modal for mobile
   - Status selection list
   - Current status indication
   - Confirmation before update

3. Error Handling Pattern
   - User-friendly error messages
   - Fallback UI states
   - Recovery options
   - Transaction rollback

### Data Update Patterns

1. Optimistic Updates
   - Update UI immediately
   - Confirm with backend
   - Rollback on failure
   - Show error feedback

2. Status Change Validation
   - Role verification
   - Status transition rules
   - Data integrity checks
   - Timestamp updates

3. Data Synchronization Pattern
   - Database triggers for consistency
   - Automatic field updates
   - Cross-table data synchronization
   - Default value handling

### Security Patterns

1. Role-Based Access
   - Supplier-specific actions
   - User-specific views
   - Action authorization
   - Data access control

2. Database Policies
   - Table-level security
   - Row-level security
   - Operation-specific policies
   - Role-based permissions

### State Management Patterns

1. Order State
   - Current status
   - Update history
   - User permissions
   - Related metadata

2. UI State
   - Loading states
   - Error states
   - Success feedback
   - Modal states

## Product Management Patterns

### Product List Pattern
1. List View Structure
   - Card-based product display
   - Image with product details
   - Action buttons for each product
   - Pull-to-refresh functionality

2. Navigation Pattern
   - Profile page entry point
   - Stack navigation to product list
   - Further navigation to edit pages
   - Back navigation with auto-refresh

3. Data Loading Pattern
   - Initial load on component mount
   - Pull-to-refresh for manual updates
   - Loading indicators during data fetch
   - Empty state handling

### Product Display Pattern
1. Card Layout
   - Primary image display
   - Key product information (name, price, stock)
   - Visual hierarchy for information
   - Action buttons at card bottom

2. Image Handling
   - Primary image detection
   - Image URL construction
   - Fallback for missing images
   - Proper image sizing and aspect ratio

### User Data Synchronization Pattern
1. Database Trigger Pattern
   ```sql
   CREATE OR REPLACE FUNCTION public.sync_user_info()
   RETURNS TRIGGER AS $$
   BEGIN
       UPDATE public.profiles
       SET 
           email = NEW.email,
           phone = NEW.phone,
           display_name = COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
           avatar_url = NEW.raw_user_meta_data->>'avatar_url',
           updated_at = NOW()
       WHERE id = NEW.id;
       
       RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

2. Data Fields Pattern
   - Essential user identification (email, name)
   - Contact information (phone)
   - Profile presentation (display_name, avatar)
   - Fallback values for missing data 