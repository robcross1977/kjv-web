# Bookmark System - Personal Bible Reference Management

## Overview

Create a comprehensive bookmark system that allows users to save, organize, and quickly navigate to specific Bible passages. Users can create named bookmarks with Bible references (e.g., "1 John 3:4-9") and access them through a searchable interface within the unified tools sheet.

## Core Features

### Bookmark Creation

- **Named Bookmarks**: User-defined names for easy identification
- **Bible References**: Support various reference formats
- **Quick Creation**: Add bookmarks from current reading context
- **Bulk Import**: Import bookmarks from text/CSV files

### Reference Parsing

- **Flexible Formats**: Support multiple Bible reference formats
- **Range Support**: Single verses, verse ranges, multiple chapters
- **Validation**: Ensure references exist in KJV
- **Normalization**: Convert to consistent internal format

### Organization & Search

- **Searchable**: Search by name, reference, or tags
- **Categories/Tags**: Organize bookmarks by topic
- **Sorting**: By name, date created, book order, frequency
- **Filtering**: By book, testament, category

## Supported Reference Formats

### Single References

- `John 3:16` - Single verse
- `1 John 3:16` - Books with numbers
- `Psalm 23` - Entire chapter
- `Genesis 1:1` - Standard format

### Range References

- `John 3:16-18` - Verse range within chapter
- `John 3:16-4:2` - Cross-chapter range
- `1 John 3:4-9` - Range in numbered book
- `Psalm 23:1-6` - Psalm verse range

### Multiple References

- `John 3:16, 17, 19` - Multiple verses
- `John 3:16; Romans 6:23` - Multiple passages
- `Genesis 1:1-3, 26-27` - Multiple ranges

### Complex References

- `Matthew 5-7` - Multiple chapters
- `1 Corinthians 13` - Entire chapter
- `Romans 8:28-39; Ephesians 2:8-10` - Multiple ranges

## Database Schema

### Bookmark Model Extension

```sql
-- Extend existing Bookmark model
model Bookmark {
  id          String   @id @default(cuid())
  name        String   -- User-defined bookmark name
  description String?  -- Optional description

  -- Reference components (normalized)
  book        String   -- Normalized book name
  startChapter Int     -- Starting chapter
  endChapter   Int?    -- Ending chapter (for ranges)
  startVerse   Int?    -- Starting verse (null for entire chapters)
  endVerse     Int?    -- Ending verse (for ranges)

  -- Original reference for display
  originalRef String   -- Original user input
  normalizedRef String -- Normalized reference for display

  -- Organization
  tags        String[] -- Array of tags for categorization
  category    String?  -- Primary category
  color       String?  -- Color coding

  -- Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  accessCount Int      @default(0) -- Track usage frequency
  lastAccessed DateTime? -- Last time bookmark was used

  -- User relationship
  user        User     @relation(fields: [userId], references: [uid])
  userId      String

  @@unique([userId, name]) -- Unique bookmark names per user
  @@map("bookmark")
}
```

### Categories/Tags System

```sql
model BookmarkCategory {
  id          String @id @default(cuid())
  name        String
  color       String?
  icon        String?
  userId      String
  user        User   @relation(fields: [userId], references: [uid])

  @@unique([userId, name])
  @@map("bookmark_category")
}
```

## API Endpoints

### Bookmark Management

```typescript
// GET /api/bookmarks - List user bookmarks
// POST /api/bookmarks - Create new bookmark
// PUT /api/bookmarks/[id] - Update bookmark
// DELETE /api/bookmarks/[id] - Delete bookmark
// GET /api/bookmarks/search - Search bookmarks
```

### Reference Parsing

```typescript
// POST /api/bookmarks/parse-reference - Parse and validate reference
// GET /api/bookmarks/suggestions - Get reference suggestions
```

## Component Architecture

### Bookmark Components

```
BookmarksSection (in ToolsSheet)
├── BookmarksList
│   ├── BookmarkItem
│   ├── BookmarkActions
│   └── BookmarkCategories
├── BookmarkSearch
│   ├── SearchInput
│   ├── FilterControls
│   └── SortControls
├── CreateBookmarkForm
│   ├── ReferenceInput
│   ├── NameInput
│   ├── CategorySelect
│   └── TagsInput
└── BookmarkImport
    ├── FileUpload
    ├── TextImport
    └── FormatHelp
```

### Reference Parser

```
ReferenceParser
├── FormatDetector
├── BookNameResolver
├── RangeValidator
├── ReferenceNormalizer
└── ErrorHandler
```

## Implementation Plan

### Phase 1: Core Infrastructure ✅ Ready to Start

#### 1.1 Database Schema

- [ ] Update Prisma schema with Bookmark model
- [ ] Create migration for bookmark tables
- [ ] Add bookmark categories support
- [ ] Set up proper indexes for search

#### 1.2 Reference Parser

- [ ] `src/lib/reference-parser.ts`
  - Parse various reference formats
  - Validate against KJV book/chapter/verse structure
  - Normalize references for storage
  - Handle edge cases and errors

#### 1.3 API Endpoints

- [ ] `src/app/api/bookmarks/route.ts` - CRUD operations
- [ ] `src/app/api/bookmarks/search/route.ts` - Search functionality
- [ ] `src/app/api/bookmarks/parse-reference/route.ts` - Reference parsing
- [ ] Error handling with fp-ts patterns

### Phase 2: UI Components ✅ Ready to Start

#### 2.1 Bookmark Management

- [ ] `src/components/bookmarks/bookmarks-section.tsx`
- [ ] `src/components/bookmarks/bookmark-item.tsx`
- [ ] `src/components/bookmarks/create-bookmark-form.tsx`
- [ ] `src/components/bookmarks/bookmark-actions.tsx`

#### 2.2 Search & Organization

- [ ] `src/components/bookmarks/bookmark-search.tsx`
- [ ] `src/components/bookmarks/bookmark-filters.tsx`
- [ ] `src/components/bookmarks/bookmark-categories.tsx`
- [ ] Advanced search with multiple criteria

#### 2.3 Reference Input

- [ ] `src/components/bookmarks/reference-input.tsx`
  - Auto-complete for book names
  - Real-time validation
  - Format suggestions
  - Error display

### Phase 3: Advanced Features ✅ After Core

#### 3.1 Quick Actions

- [ ] "Bookmark This" button on verses/chapters
- [ ] Context menu for quick bookmark creation
- [ ] Keyboard shortcuts for bookmark actions
- [ ] Quick bookmark from URL parameters

#### 3.2 Import/Export

- [ ] Import from text files
- [ ] Export bookmarks to various formats
- [ ] Backup and restore functionality
- [ ] Share bookmarks with others

#### 3.3 Smart Features

- [ ] Bookmark suggestions based on reading history
- [ ] Related verse recommendations
- [ ] Reading plan integration
- [ ] Bookmark analytics and insights

## Reference Parser Implementation

### Core Parser Logic

```typescript
type ParsedReference = {
  book: string;
  startChapter: number;
  endChapter?: number;
  startVerse?: number;
  endVerse?: number;
  originalInput: string;
  normalizedDisplay: string;
};

const parseReference = (input: string): E.Either<string, ParsedReference> =>
  pipe(
    input,
    sanitizeInput,
    E.chain(detectFormat),
    E.chain(parseComponents),
    E.chain(validateReference),
    E.map(normalizeReference)
  );
```

### Book Name Resolution

```typescript
const resolveBookName = (input: string): O.Option<string> =>
  pipe(
    input.toLowerCase(),
    (name) => bookAliases[name] || name,
    O.fromPredicate(isValidBook)
  );

// Support various book name formats
const bookAliases = {
  "1jn": "1 john",
  "1john": "1 john",
  firstjohn: "1 john",
  ps: "psalm",
  psalms: "psalm",
  // ... more aliases
};
```

### Range Validation

```typescript
const validateRange = (
  book: string,
  chapter: number,
  verse?: number
): E.Either<string, boolean> =>
  pipe(
    getBookStructure(book),
    E.fromOption(() => `Invalid book: ${book}`),
    E.chain((structure) =>
      chapter > structure.chapters
        ? E.left(`Chapter ${chapter} doesn't exist in ${book}`)
        : verse && verse > structure.versesPerChapter[chapter - 1]
        ? E.left(`Verse ${verse} doesn't exist in ${book} ${chapter}`)
        : E.right(true)
    )
  );
```

## UI/UX Design

### Bookmark List Interface

- **Card Layout**: Each bookmark as a card with name, reference, tags
- **Quick Actions**: Edit, delete, navigate buttons
- **Visual Indicators**: Color coding, category icons, usage frequency
- **Responsive**: Stack on mobile, grid on desktop

### Search Interface

- **Instant Search**: Real-time filtering as user types
- **Advanced Filters**: By book, testament, category, date
- **Sort Options**: Name, date, book order, usage frequency
- **Search History**: Remember recent searches

### Creation Form

- **Smart Input**: Auto-complete and validation
- **Reference Preview**: Show parsed reference before saving
- **Quick Templates**: Common reference patterns
- **Batch Creation**: Add multiple bookmarks at once

## Integration with Tools Sheet

### Bookmarks Section Layout

```typescript
const BookmarksSection = () => (
  <div className="space-y-4">
    <BookmarkSearch />
    <BookmarkFilters />
    <BookmarksList />
    <CreateBookmarkButton />
  </div>
);
```

### Context Integration

- **Current Reading**: Quick bookmark from current chapter
- **Search Results**: Bookmark search results
- **Reading Progress**: Bookmark reading milestones
- **Cross-References**: Link related bookmarks

## Performance Considerations

### Database Optimization

- **Indexes**: On userId, book, createdAt, accessCount
- **Full-Text Search**: For bookmark names and descriptions
- **Pagination**: For large bookmark collections
- **Caching**: Frequently accessed bookmarks

### Client-Side Optimization

- **Virtual Scrolling**: For large bookmark lists
- **Debounced Search**: Reduce API calls during typing
- **Optimistic Updates**: Immediate UI feedback
- **Lazy Loading**: Load bookmark details on demand

## Testing Strategy

### Reference Parser Tests

- [ ] Test all supported reference formats
- [ ] Edge cases and error conditions
- [ ] Book name resolution accuracy
- [ ] Range validation correctness

### API Tests

- [ ] CRUD operations for bookmarks
- [ ] Search functionality accuracy
- [ ] Reference parsing endpoint
- [ ] Error handling and validation

### UI Tests

- [ ] Bookmark creation flow
- [ ] Search and filter functionality
- [ ] Navigation to bookmarked passages
- [ ] Mobile responsiveness

## Security & Privacy

### Data Protection

- **User Isolation**: Bookmarks private to each user
- **Input Sanitization**: Prevent XSS in bookmark names
- **Rate Limiting**: Prevent bookmark spam
- **Data Validation**: Server-side validation of all inputs

### Access Control

- **Authentication Required**: All bookmark operations require login
- **User Ownership**: Users can only access their bookmarks
- **Audit Trail**: Track bookmark modifications
- **Data Export**: Users can export their data

## Future Enhancements

### Advanced Organization

- **Nested Categories**: Hierarchical bookmark organization
- **Smart Collections**: Auto-generated bookmark groups
- **Bookmark Sharing**: Share bookmarks with other users
- **Collaborative Lists**: Group bookmark collections

### Integration Features

- **Reading Plans**: Integrate with structured reading plans
- **Study Notes**: Link bookmarks to personal notes
- **Cross-References**: Automatic related passage suggestions
- **External Services**: Sync with other Bible apps

### Analytics & Insights

- **Reading Patterns**: Analyze bookmark usage
- **Favorite Passages**: Identify most-bookmarked verses
- **Reading Progress**: Track coverage of Bible books
- **Recommendations**: Suggest new passages to explore

---

## Implementation Checklist

### Database & API

- [ ] Update Prisma schema
- [ ] Create database migration
- [ ] Implement reference parser
- [ ] Create API endpoints
- [ ] Add comprehensive error handling

### Core Components

- [ ] BookmarksSection component
- [ ] BookmarkItem component
- [ ] CreateBookmarkForm component
- [ ] BookmarkSearch component
- [ ] Reference input validation

### Integration

- [ ] Add to ToolsSheet
- [ ] Update ToolsProvider context
- [ ] Add keyboard shortcuts
- [ ] Implement navigation logic

### Polish & Testing

- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Write comprehensive tests
- [ ] Add accessibility features
- [ ] Performance optimization

---

_This comprehensive bookmark system will provide users with powerful tools to organize and navigate their Bible study, making it easy to save, find, and return to important passages._
