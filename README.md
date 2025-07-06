# PopTrack Frontend

A modern React-based property management and listing application built with TypeScript, featuring a public property browsing interface and an admin dashboard for property management.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Backend API** running on `http://localhost:5000` (see API_SETUP.md for backend setup)

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/reymark-labrador/poptrack-frontend.git
   cd poptrack-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 📸 Screenshots

### Public Property Listing Page

![Property Listing Page](screenshots/property-listing.png)
_Main property browsing interface with advanced filters and search functionality_

### Property Details Page

![Property Details Page](screenshots/property-details.png)
_Detailed property view with image carousel, map integration, and inquiry form_

### Admin Dashboard - Property Management

![Admin Dashboard](screenshots/admin-dashboard.png)
_Admin interface for managing properties with CRUD operations and bulk actions_

### Property Creation/Edit Form

![Property Form](screenshots/property-form.png)
_Comprehensive form for creating and editing property listings with map picker_

### Inquiries Management

![Inquiries Page](screenshots/inquiries.png)
_Admin interface for managing property inquiries with scheduling capabilities_

### Viewing Schedule Management

![Viewing Schedule](screenshots/viewing-schedule.png)
_Interface for scheduling and managing property viewings with status tracking_

### Video Demo

_[Placeholder for video demo - would show user interactions and key features]_

## 🎯 Assumptions Made

1. **Authentication**: Assumed JWT-based authentication with Bearer token in Authorization header
2. **Image Handling**: Assumed property images are stored as URLs and served from a CDN or file server
3. **Geolocation**: Assumed property coordinates are stored as [longitude, latitude] arrays
4. **Pagination**: Assumed backend supports pagination with metadata (total, page, limit, totalPages)
5. **Property Types**: Limited to "rent" and "sale" as the primary property types
6. **Responsive Design**: Designed for desktop-first with mobile responsiveness
7. **Error Handling**: Assumed backend returns consistent error response format

## 🛠️ Technical Choices & Architecture

### Frontend Framework & Language

- **React 19** with **TypeScript**: Chosen for type safety, better developer experience, and modern React features
- **Vite**: Fast build tool with excellent HMR and development experience

### State Management

- **Zustand**: Lightweight state management for UI state (filters, pagination, modals)
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **URL State Sync**: Custom hooks to sync filter state with URL parameters for shareable links

### UI & Styling

- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Headless UI components for accessibility and customization
- **Lucide React**: Modern icon library
- **Custom Component Library**: Built reusable components following design system principles

### Routing & Navigation

- **React Router v7**: Modern routing with lazy loading for code splitting
- **Layout-based Architecture**: Separate layouts for public and admin sections

### Data Fetching & API

- **Axios**: HTTP client with interceptors for authentication and error handling
- **Custom API Layer**: Organized API calls by feature with TypeScript interfaces
- **Error Boundaries**: Graceful error handling with user-friendly messages

### Maps & Geolocation

- **Leaflet**: Open-source mapping library for property location display
- **React Leaflet**: React wrapper for Leaflet integration
- **Interactive Map Picker**: Click-to-select location functionality for property creation

### Form Handling

- **Manual State Management**: Custom form state with useState hooks
- **Custom Validation**: Built-in validation with error messaging
- **Image Upload**: Drag-and-drop image upload with preview and management

### Code Organization

- **Feature-based Architecture**: Organized code by business features (properties, inquiries, viewings)
- **Custom Hooks**: Reusable logic extraction for data fetching and UI state
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures

## 🔮 Future Plans & Improvements

### Short-term Enhancements (1-2 weeks)

1. **Authentication System**: Implement login/register pages with proper auth flow
2. **Real Image Upload**: Replace placeholder image generation with actual file upload
3. **Advanced Search**: Implement full-text search with filters (price range, bedrooms, etc.)
4. **Email Notifications**: Add email notifications for inquiries and viewing confirmations
5. **Property Favorites**: Allow users to save favorite properties

### Medium-term Features (1-2 months)

1. **Real-time Updates**: WebSocket integration for live property updates
2. **Analytics Dashboard**: Property view analytics and inquiry tracking
3. **Multi-language Support**: Internationalization (i18n) for global markets
4. **Advanced Filtering**: Map-based property search with radius selection
5. **Property Comparison**: Side-by-side property comparison tool
6. **Virtual Tours**: Integration with 360° virtual tour providers
7. **Real-time Chat**: Live chat between clients and agents for instant communication

### Long-term Vision (3-6 months)

1. **AI-powered Recommendations**: Machine learning for property recommendations
2. **Chatbot Integration**: AI assistant for property inquiries
3. **Payment Integration**: Online rent/deposit payments
4. **Tenant Portal**: Separate interface for tenants to manage their properties
5. **API Documentation**: Comprehensive API documentation with Swagger
6. **Performance Optimization**: Service workers, lazy loading, and CDN integration

## 🎯 Stretch Goals & Bonus Features Attempted

### UI/UX Excellence

1. **Beautiful Interface Design**: Modern, clean UI with professional styling and smooth animations
2. **Responsive Design**: Mobile-first responsive design with breakpoint optimization
3. **Loading States**: Skeleton loading and progress indicators throughout the app
4. **Error Handling**: Comprehensive error boundaries and user-friendly error messages

### Advanced Functionality

5. **Advanced Filtering System**: Comprehensive filtering with URL state sync and real-time updates
6. **Image Carousel**: Custom image carousel with navigation controls and dot indicators
7. **Map Integration**: Leaflet.js maps for property location visualization and interactive map picker
8. **URL State Management**: Shareable URLs with filter state preservation
9. **Image Upload System**: Drag-and-drop image upload with preview and management
10. **Inquiry Management**: Complete inquiry workflow with scheduling capabilities
11. **Viewing Management**: Full viewing scheduling and status tracking system

### Planned Bonus Features (Not Implemented Due to Time Constraints)

12. **Internationalization (i18n)**: Multi-language support for global markets
13. **Real-time Chat**: Live chat system between clients and agents

## 🚧 Planned Features (Not Implemented Due to Time Constraints)

1. **Internationalization (i18n)**: Multi-language support for global markets
2. **Real-time Chat**: Live chat system between clients and agents

## ⚡ Shortcuts & Compromises

1. **Mock Data**: Used placeholder data during development when backend wasn't ready
2. **Authentication Infrastructure**: Prepared Axios interceptors for token-based auth but no actual auth system implemented
3. **Placeholder Images**: Used random image generation instead of actual file upload for demo purposes
4. **Simple Error Messages**: Generic error messages instead of specific API error handling
5. **No Unit Tests**: Focused on functionality over test coverage (would add in production)
6. **Basic SEO**: Minimal meta tags and SEO optimization
7. **No PWA Features**: Skipped service worker and offline functionality
8. **Simple State Management**: Used Zustand instead of more complex Redux setup

## ⏱️ Time Spent

- **Total Development Time**: ~25-30 hours
- **Planning & Architecture**: 2-3 hours
- **Core Development**: 18-22 hours
- **UI/UX Polish**: 3-4 hours
- **Testing & Bug Fixes**: 2-3 hours

**Breakdown by Feature:**

- Property listing & details: 8 hours
- Admin dashboard: 10 hours
- Forms & CRUD operations: 5 hours
- Filtering & search: 4 hours
- Maps integration: 3 hours
- UI components & styling: 5 hours
- Error handling & polish: 2 hours

## 🛠️ Technologies & Tools Used

### Core Technologies

- **React 19** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router 7** - Routing

### State Management

- **Zustand 5** - Client state
- **TanStack Query 5** - Server state
- **Immer 10** - Immutable updates

### UI Components

- **Radix UI** - Headless components
- **Lucide React** - Icons
- **React Day Picker** - Date picker
- **React Leaflet** - Maps

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package manager

### Libraries

- **Axios** - HTTP client
- **date-fns** - Date utilities
- **class-variance-authority** - Component variants
- **clsx** - Conditional classes

## 💡 Additional Notes

### Performance Considerations

- Implemented lazy loading for route-based code splitting
- Used useMemo for expensive computations and debounced filters
- Optimized re-renders with proper dependency arrays
- Implemented virtual scrolling for large property lists (planned)

### Security Measures

- Input validation on all forms (required fields, data types, range validation)
- React's built-in XSS protection (automatic content escaping, no dangerouslySetInnerHTML)
- Basic Axios interceptors for token handling and error responses
- Prepared token infrastructure but no actual authentication system implemented

---
