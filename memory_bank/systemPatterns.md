# System Architecture and Patterns

## Database Structure
1. **Core Tables**
   - `products`: Main product information
   - `categories`: Product categories
   - `product_images`: Product image management
   - `orders`: Order tracking
   - `order_items`: Order line items
   - `profiles`: User profiles
   - `addresses`: Delivery addresses

2. **Key Relationships**
   - Products belong to categories
   - Products have multiple images
   - Orders belong to users
   - Order items belong to orders and products

## Frontend Architecture
1. **Navigation**
   - Tab-based main navigation
   - Stack navigation for detailed views
   - Modal presentations for forms

2. **Component Structure**
   - Atomic design pattern
   - Reusable UI components
   - Screen-specific components
   - Form components with validation

3. **State Management**
   - Local component state for UI
   - Context for global state
   - Supabase real-time subscriptions

## Design Patterns
1. **UI/UX Patterns**
   - Modern black-and-white theme
   - Consistent spacing and typography
   - Form validation patterns
   - Loading states and error handling
   - Image upload and preview

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