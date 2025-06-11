# Tools Sheet - Unified Tools Interface

## Overview

Consolidate all tools (search, mark-as-read, bookmarks) into a single, organized sheet interface accessible from the header. This creates a cleaner UI and better user experience by grouping related functionality.

## Current State Analysis

### Existing Components

- ✅ Search functionality in separate `SearchSheet`
- ✅ Mark-as-read system with floating button
- ✅ Individual tool components scattered across UI

### Issues to Solve

- Multiple entry points for tools (search button, floating button)
- Inconsistent UI patterns between tools
- Cluttered interface with separate tool access points
- No unified tools experience

## Design Goals

### User Experience

- **Single Entry Point**: One "Tools" button in header
- **Organized Sections**: Clear separation of tool categories
- **Contextual Relevance**: Show relevant tools based on current page
- **Keyboard Shortcuts**: Maintain existing shortcuts (T for tools, / for search)
- **Responsive Design**: Works well on mobile and desktop

### Technical Goals

- **fp-ts Patterns**: Use functional programming throughout
- **Component Reusability**: Modular tool sections
- **State Management**: Unified tools state with context
- **Performance**: Lazy loading of tool sections
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Implementation Plan

### Phase 1: Tools Sheet Infrastructure ✅ Ready to Start

#### 1.1 Create Unified Tools Sheet Component

- [ ] `src/components/tools/tools-sheet.tsx`
  - Sheet container with sections for each tool type
  - Tabbed or accordion-style organization
  - Keyboard navigation support
  - Responsive layout

#### 1.2 Update Header Integration

- [ ] Replace "Search" button with "Tools" button
- [ ] Update button styling and icon (wrench or tools icon)
- [ ] Maintain keyboard shortcut functionality
- [ ] Add tooltip showing keyboard shortcut

#### 1.3 Tools Context Enhancement

- [ ] Extend `ToolsProvider` to manage sheet state
- [ ] Add `isToolsSheetOpen` state
- [ ] Add `activeToolSection` state for navigation
- [ ] Maintain backward compatibility with existing tools

### Phase 2: Search Integration ✅ Ready to Start

#### 2.1 Extract Search Components

- [ ] Move search logic from `SearchSheet` to reusable components
- [ ] Create `SearchSection` component for tools sheet
- [ ] Maintain existing search functionality
- [ ] Preserve search state when switching between tools

#### 2.2 Search Section Features

- [ ] Free text search (existing functionality)
- [ ] Book/Chapter/Verse selectors (existing functionality)
- [ ] Recent searches history
- [ ] Search shortcuts and tips
- [ ] Clear search functionality

### Phase 3: Mark-as-Read Integration ✅ Ready to Start

#### 3.1 Remove Floating Button

- [ ] Remove `FloatingToolsButton` component
- [ ] Move mark-as-read controls to tools sheet
- [ ] Maintain keyboard shortcut (T key) to open tools

#### 3.2 Mark-as-Read Section Features

- [ ] Current chapter context display
- [ ] "Mark All as Read" button
- [ ] "Mark All as Unread" button
- [ ] Reading progress indicator
- [ ] Quick verse selection interface

### Phase 4: Bookmarks Integration (Depends on Bookmark System)

#### 4.1 Bookmarks Section

- [ ] List of saved bookmarks
- [ ] Search/filter bookmarks
- [ ] Quick bookmark creation
- [ ] Bookmark organization (tags/categories)

## Component Architecture

### Tools Sheet Structure

```
ToolsSheet
├── ToolsHeader (title, close button)
├── ToolsNavigation (section tabs/buttons)
├── SearchSection
│   ├── FreeSearchForm
│   ├── SelectSearchForm
│   └── SearchResults
├── ReadingSection
│   ├── ChapterProgress
│   ├── MarkAllControls
│   └── QuickVerseSelector
└── BookmarksSection (future)
    ├── BookmarksList
    ├── BookmarkSearch
    └── CreateBookmarkForm
```

### State Management

```typescript
type ToolsSheetState = {
  isOpen: boolean;
  activeSection: "search" | "reading" | "bookmarks";
  searchState: SearchState;
  readingState: ReadingState;
  bookmarksState: BookmarksState;
};
```

## UI/UX Design

### Visual Design

- **Consistent Styling**: Match existing sheet components
- **Section Headers**: Clear visual separation between tools
- **Icons**: Meaningful icons for each section
- **Loading States**: Proper loading indicators
- **Empty States**: Helpful messages when no data

### Navigation Patterns

- **Tab Navigation**: Horizontal tabs for main sections
- **Breadcrumbs**: Show current location within tools
- **Quick Actions**: Prominent buttons for common actions
- **Keyboard Shortcuts**: Listed in help section

### Responsive Behavior

- **Mobile**: Stack sections vertically, collapsible headers
- **Tablet**: Side-by-side layout for some sections
- **Desktop**: Full feature set with optimal spacing

## Technical Implementation

### Component Props

```typescript
type ToolsSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSection?: ToolSection;
  currentContext?: {
    book?: string;
    chapter?: number;
    verses?: number[];
  };
};
```

### fp-ts Integration

```typescript
// State transformations
const updateToolsState = (
  state: ToolsSheetState,
  action: ToolsAction
): ToolsSheetState =>
  pipe(
    action,
    match({
      openSection: (section) => ({ ...state, activeSection: section }),
      closeSheet: () => ({ ...state, isOpen: false }),
      updateSearch: (searchState) => ({ ...state, searchState }),
    })
  );
```

## Migration Strategy

### Phase 1: Parallel Implementation

- Keep existing search sheet functional
- Build new tools sheet alongside
- Test all functionality in isolation

### Phase 2: Gradual Migration

- Update header to use tools button
- Redirect search functionality to tools sheet
- Remove old search sheet component

### Phase 3: Feature Enhancement

- Add new tools-specific features
- Optimize performance and UX
- Gather user feedback and iterate

## Testing Strategy

### Unit Tests

- [ ] Tools sheet component rendering
- [ ] Section navigation functionality
- [ ] State management with fp-ts patterns
- [ ] Keyboard shortcut handling

### Integration Tests

- [ ] Search functionality within tools sheet
- [ ] Mark-as-read integration
- [ ] Context switching between sections
- [ ] Mobile responsive behavior

### User Testing

- [ ] Navigation intuitiveness
- [ ] Feature discoverability
- [ ] Performance on different devices
- [ ] Accessibility compliance

## Success Metrics

### User Experience

- Reduced clicks to access tools
- Improved tool discoverability
- Consistent interaction patterns
- Positive user feedback

### Technical

- Reduced component complexity
- Better state management
- Improved performance
- Maintainable codebase

## Future Enhancements

### Advanced Features

- Tool usage analytics
- Customizable tool layout
- Tool-specific settings
- Integration with external services

### Performance Optimizations

- Lazy loading of tool sections
- Virtual scrolling for large lists
- Optimistic updates
- Caching strategies

## Dependencies

### Required for Implementation

- Existing `ToolsProvider` context
- Sheet component from UI library
- Icon library for tool icons
- Keyboard shortcut handling

### Blocked By

- None (can start immediately)

### Blocks

- Bookmark system implementation
- Advanced reading features
- Tool customization features

---

## Implementation Checklist

### Infrastructure

- [x] Create `ToolsSheet` component
- [x] Update `ToolsProvider` context
- [x] Add tools sheet state management
- [x] Implement section navigation

### Search Integration

- [x] Extract search components
- [x] Create `SearchSection` component
- [x] Migrate search functionality
- [ ] Remove old `SearchSheet`

### Reading Tools Integration

- [x] Create `ReadingSection` component
- [ ] Remove floating tools button
- [ ] Add reading progress features
- [ ] Implement quick actions

### Polish & Testing

- [x] Add keyboard shortcuts
- [x] Implement responsive design
- [x] Add loading and empty states
- [ ] Write comprehensive tests
- [ ] Update documentation

---

_This plan provides a comprehensive roadmap for creating a unified tools interface that will significantly improve the user experience while maintaining all existing functionality._
