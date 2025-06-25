# KJV Web Enhancement Plan

## Phase 1: Last Location Tracking 📍

### 1.1 Database Schema & Types

- [x] Add `lastReference` field to User model in Prisma schema
- [x] Create and run database migration
- [x] Add TypeScript types for last reference tracking
- [x] **STOP & TEST**: Verify database schema changes work

### 1.2 Backend API Implementation

- [x] Create API route `api/user/last-reference` (GET/POST)
- [x] Implement fp-ts error handling for reference storage/retrieval
- [x] Add Auth0 user authentication validation
- [x] **STOP & TEST**: Test API endpoints with Postman/curl

### 1.3 Frontend Hook Implementation

- [x] Create `use-last-reference.ts` hook with fp-ts patterns
- [x] Implement optimistic updates for reference saving
- [x] Add automatic reference saving when user navigates
- [x] **STOP & TEST**: Verify hook saves/retrieves references correctly

### 1.4 Integration & Default Behavior

- [x] Modify main page to check for last reference on load
- [x] Implement John 1:1 default for new/logged-out users
- [x] Add automatic navigation to last reference for returning users
- [x] **STOP & TEST**: Full user flow testing (login, navigate, logout, login)
- [x] **BUG FIX**: Fixed race conditions in useEffect with SWR implementation
- [x] **BUG FIX**: Fixed verse range handling in LastReferenceNavigator
- [x] **ENHANCEMENT**: Added support for free-form search reference auto-saving

**✅ PHASE 1 COMPLETE**: Last location tracking works for both selection search and free-form search, including verse ranges!

## Phase 2: UI Repositioning 🎨

### 2.1 Move Tools Button

- [x] Remove floating tools button from current location
- [x] Add tools button next to bookmark button in search results
- [x] Ensure proper spacing and alignment (Tools | Bookmark)
- [x] **STOP & TEST**: Verify tools button works in new location

### 2.2 Update Responsive Design

- [x] Test tools/bookmark button layout on mobile devices
- [x] Adjust spacing and sizing for different screen sizes
- [x] Ensure accessibility (keyboard navigation, screen readers)
- [x] **STOP & TEST**: Cross-device testing (desktop, tablet, mobile)

**✅ PHASE 2 COMPLETE**: UI repositioning completed successfully with responsive design!

## Phase 3: Mastra Free Form Search 🔍

### 3.1 Mastra Setup & Configuration

- [x] Install Mastra dependencies (`npm install @mastra/core @mastra/mcp`)
- [x] Set up Mastra configuration file (`mastra.config.ts` and `src/mastra/index.ts`)
- [x] Configure project structure with agents, tools, and workflows directories
- [x] Create Bible search tool with placeholder implementation
- [x] Create Bible search agent with OpenAI GPT-4o-mini model
- [x] Create API route for testing Bible search (`/api/bible-search`)
- [x] Update TypeScript configuration for Mastra imports
- [x] Successfully built project with all new components

### 3.2 Bible Knowledge System

- [x] **ARCHITECTURE REDESIGN**: Implemented proper separation of concerns
  - **Mastra Agent**: Converts natural language queries to Bible references
  - **kingjames Package**: Used ONLY for retrieving verses by reference (not content search)
  - **Bible Search Tool**: Bridges agent-generated references to actual verse text
- [x] Enhanced Bible search tool to take Bible references and fetch actual verses using kingjames
- [x] Updated agent with comprehensive Bible knowledge and reference mapping
- [x] Implemented proper fp-ts functional programming patterns for data transformation
- [x] Added error handling and fallback responses for search failures
- [x] **TESTED**: Successfully tested with multiple queries:
  - "verses about love" → Generated john 3:16, 1 john 4:8, 1 corinthians 13:4-8, etc. → Retrieved actual KJV text
  - "comfort during difficult times" → Generated 2 corinthians 1:3-4, psalms 23, matthew 11:28-30 → Retrieved actual verses
- [x] Agent provides meaningful spiritual context and explanations with verse text

**✅ PHASE 3.2 COMPLETE**: Bible knowledge system working perfectly with proper architecture!

### 3.3 Mastra Agent Implementation

- [ ] Add OPENAI_API_KEY to environment variables for production deployment
- [ ] Integrate free-form search into main application UI
- [ ] Add search interface component for natural language Bible queries
- [ ] Implement search results display with verse formatting
- [ ] **STOP & TEST**: Test agent with complex spiritual questions

### 3.4 Search API Integration

- [ ] Create API route `api/search/free-form`
- [ ] Integrate Mastra agent with API endpoint
- [ ] Add input validation and rate limiting
- [ ] Implement fp-ts error handling for search failures
- [ ] **STOP & TEST**: API returns proper reference lists for test queries

### 3.5 Frontend Search Component

- [ ] Create `FreeFormSearch` component in new location (top of page)
- [ ] Add search input with loading states and error handling
- [ ] Implement debounced search to avoid excessive API calls
- [ ] Style search bar to match existing design system
- [ ] **STOP & TEST**: Search component renders and accepts input

### 3.6 Search Results Integration

- [ ] Connect free form search results to existing verse display system
- [ ] Add result formatting for multiple reference ranges
- [ ] Implement "Show Results" button to display found verses
- [ ] Add search history and recent searches functionality
- [ ] **STOP & TEST**: End-to-end search functionality works

### 3.7 Advanced Search Features

- [ ] Add search suggestions and autocomplete
- [ ] Implement search result ranking and relevance scoring
- [ ] Add filters for Old/New Testament, specific books
- [ ] Create search analytics and usage tracking
- [ ] **STOP & TEST**: Advanced features enhance user experience

## Phase 4: Polish & Performance 🚀

### 4.1 Error Handling & Edge Cases

- [ ] Add comprehensive error messages for all failure modes
- [ ] Implement fallback behavior when Mastra is unavailable
- [ ] Add proper loading states throughout the application
- [ ] Test with malformed or ambiguous search queries
- [ ] **STOP & TEST**: Application handles all error cases gracefully

### 4.2 Performance Optimization

- [ ] Implement search result caching with Redis/memory
- [ ] Add request deduplication for identical queries
- [ ] Optimize database queries with proper indexing
- [ ] Add performance monitoring and metrics
- [ ] **STOP & TEST**: Application performs well under load

### 4.3 User Experience Enhancements

- [ ] Add keyboard shortcuts for search (Ctrl+K, /)
- [ ] Implement search result highlighting and context
- [ ] Add "Did you mean?" suggestions for unclear queries
- [ ] Create onboarding tooltips for new features
- [ ] **STOP & TEST**: User testing with real users

## Testing Strategy 🧪

### Manual Testing Checkpoints

- [ ] Test with fresh user accounts
- [ ] Test with existing user data
- [ ] Test offline/network failure scenarios
- [ ] Test with various search query types
- [ ] Cross-browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] Accessibility compliance testing

### Automated Testing

- [ ] Unit tests for all new utilities and hooks
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Performance regression tests

## Deployment Strategy 🚀

### Pre-deployment

- [ ] Code review and fp-ts pattern compliance check
- [ ] Database migration testing on staging
- [ ] Environment variable configuration
- [ ] Feature flag setup for gradual rollout

### Deployment

- [ ] Deploy to staging environment
- [ ] Smoke tests on staging
- [ ] Production deployment
- [ ] Post-deployment monitoring and alerts

---

## Notes

- Each checkbox represents a complete, testable unit of work
- Stop and manually test after each major milestone
- Use fp-ts patterns throughout for consistency
- Maintain existing code quality and patterns
- Document any new environment variables or setup steps
