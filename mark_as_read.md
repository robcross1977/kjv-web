# Mark as Read System Implementation Plan

## Overview

Implement a contextual tools system that allows users to mark individual verses or entire search results as read, with data persisted to the database and tied to their Auth0 user account.

## Database Schema & Models

### [ ] Create ReadVerse Model

- [ ] Add Prisma schema for `ReadVerse` table
  - `id` (String, @id @default(cuid()))
  - `userId` (String) - Auth0 user ID
  - `book` (String) - Bible book name
  - `chapter` (Int) - Chapter number
  - `verse` (Int) - Verse number
  - `readAt` (DateTime, @default(now()))
  - `@@unique([userId, book, chapter, verse])` - Prevent duplicates

### [ ] Database Migration

- [ ] Run Prisma migration to create the table
- [ ] Test database connection and model

## API Routes

### [ ] Create Read Status API Routes

- [ ] `GET /api/verses/read-status` - Get read status for verses
  - Query params: `book`, `chapter`, `verses[]`, `userId`
  - Returns: Array of read verse objects
- [ ] `POST /api/verses/mark-read` - Mark verses as read
  - Body: `{ userId, verses: [{ book, chapter, verse }] }`
  - Returns: Success/error response
- [ ] `DELETE /api/verses/unmark-read` - Unmark verses as read
  - Body: `{ userId, verses: [{ book, chapter, verse }] }`
  - Returns: Success/error response

### [ ] Auth0 Integration

- [ ] Add middleware to verify Auth0 user in API routes
- [ ] Extract user ID from Auth0 session
- [ ] Handle unauthorized requests gracefully

## Frontend Components

### [ ] Tools System Infrastructure

- [ ] Create `ToolsProvider` context for managing tools state
- [ ] Create `useTools` hook for accessing tools functionality
- [ ] Create `useReadStatus` hook for managing read verse state

### [ ] Floating Tools Button

- [ ] Create `FloatingToolsButton` component
  - [ ] Position: fixed bottom-right
  - [ ] Toggle tools mode on/off
  - [ ] Keyboard shortcut support (`T` key)
  - [ ] Smooth animations

### [ ] Verse Selection System

- [ ] Modify verse display components to support selection
  - [ ] Add selection checkboxes (hidden by default)
  - [ ] Show checkboxes when tools mode is active
  - [ ] Handle individual verse selection
  - [ ] Visual feedback for selected verses

### [ ] Bulk Actions Toolbar

- [ ] Create `BulkActionsToolbar` component
  - [ ] "Select All Visible" checkbox
  - [ ] "Mark Selected as Read" button
  - [ ] "Unmark Selected" button
  - [ ] Appears when tools mode is active

### [ ] Tools Panel

- [ ] Create `ToolsPanel` component (slide-in from right)
  - [ ] Reading Progress section
  - [ ] Mark as Read controls
  - [ ] Future: Strong's, Commentary, AI sections
  - [ ] Close button and keyboard shortcuts

## Visual Indicators

### [ ] Read Verse Styling

- [ ] Add visual indicator for read verses
  - [ ] Light green left border
  - [ ] Slightly faded text (opacity: 0.7)
  - [ ] Small checkmark icon (optional)

### [ ] Selection State Styling

- [ ] Highlight selected verses
- [ ] Smooth transitions for state changes
- [ ] Hover effects for interactive elements

## State Management (fp-ts)

### [ ] Read Status Types

- [ ] Define `ReadVerse` type
- [ ] Define `ReadStatus` union type
- [ ] Define `ToolsState` type

### [ ] fp-ts Data Flow

- [ ] Use `TaskEither` for API calls
- [ ] Use `Option` for nullable read status
- [ ] Use `Array` module for verse collections
- [ ] Implement proper error handling with `Either`

### [ ] State Hooks

- [ ] `useReadStatus` - Manage read verse state
- [ ] `useVerseSelection` - Manage selected verses
- [ ] `useToolsMode` - Manage tools visibility

## Integration with Existing Components

### [ ] Update Search Results

- [ ] Modify `ChaptersDisplay` component
  - [ ] Add read status indicators
  - [ ] Add selection capabilities
  - [ ] Integrate with tools system

### [ ] Update Verse Components

- [ ] Modify `VersesDisplay` component
  - [ ] Add read status props
  - [ ] Add selection props
  - [ ] Handle click events for selection

### [ ] Update Search Sheet

- [ ] Add tools integration to search results
- [ ] Ensure tools work within the sheet context

## Performance Optimizations

### [ ] Efficient Data Loading

- [ ] Batch API calls for read status
- [ ] Cache read status in memory
- [ ] Debounce mark/unmark operations

### [ ] Optimistic Updates

- [ ] Update UI immediately on mark/unmark
- [ ] Handle API failures gracefully
- [ ] Sync state with server on success

## Testing

### [ ] Unit Tests

- [ ] Test read status hooks
- [ ] Test API route handlers
- [ ] Test fp-ts transformations

### [ ] Integration Tests

- [ ] Test full mark as read flow
- [ ] Test bulk operations
- [ ] Test Auth0 integration

### [ ] User Experience Testing

- [ ] Test tools mode activation
- [ ] Test verse selection UX
- [ ] Test visual indicators

## Future Enhancements (Phase 2)

### [ ] Reading Analytics

- [ ] Track reading progress over time
- [ ] Generate reading statistics
- [ ] Reading streaks and goals

### [ ] Advanced Features

- [ ] Reading notes on verses
- [ ] Reading plans integration
- [ ] Export reading history

### [ ] Performance

- [ ] Implement caching strategies
- [ ] Optimize database queries
- [ ] Add pagination for large datasets

## Implementation Order

1. **Database & API** (Backend foundation)
2. **Tools Infrastructure** (Context, hooks, types)
3. **Basic UI Components** (Floating button, tools panel)
4. **Verse Integration** (Selection, visual indicators)
5. **Bulk Operations** (Select all, bulk mark/unmark)
6. **Polish & Testing** (Animations, error handling, tests)

## Success Criteria

- [ ] Users can mark individual verses as read
- [ ] Users can mark all visible verses as read
- [ ] Read status persists across devices
- [ ] Tools mode doesn't interfere with reading experience
- [ ] System is extensible for future tools
- [ ] All operations follow fp-ts patterns
- [ ] Performance is smooth and responsive
