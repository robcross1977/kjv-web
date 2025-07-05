# AI-Powered Bible Study Overlays Implementation Plan

## Overview

Implement AI-powered contextual overlays for Bible verses and chapters that provide Independent Baptist pastoral commentary, cultural context, and Strong's concordance data. The system will cache all AI responses in the database for instant retrieval on subsequent requests.

## Core Features

### Chapter Context Overlay

- **Modern English explanation** of the chapter's context
- **Speaker identification** (who is speaking/writing)
- **Main topics** and themes being discussed
- **Ancient cultural context** needed for understanding
- **Historical background** and setting
- **Independent Baptist pastoral perspective** on interpretation

### Verse Context Overlay

- **All chapter context features** (inherited)
- **Strong's concordance data** for each significant word
- **Word meanings** in original Hebrew/Greek
- **Grammatical analysis** (verb tenses, noun cases, etc.)
- **Cross-references** to related verses
- **Independent Baptist theological interpretation**

## Database Schema

### [ ] Create AI Commentary Tables

```sql
-- Chapter commentary cache
model ChapterCommentary {
  id          String   @id @default(cuid())
  book        String   // Normalized book name (e.g., "john")
  chapter     Int      // Chapter number

  // AI-generated content
  context     String   // Modern English explanation
  speaker     String?  // Who is speaking/writing
  topics      String[] // Main topics/themes
  culture     String?  // Ancient cultural context
  history     String?  // Historical background
  commentary  String   // Independent Baptist commentary

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  model       String   // AI model used (e.g., "gpt-4")
  version     String   // Commentary version for cache invalidation

  @@unique([book, chapter, version])
  @@map("chapter_commentary")
}

-- Verse commentary cache
model VerseCommentary {
  id          String   @id @default(cuid())
  book        String   // Normalized book name
  chapter     Int      // Chapter number
  verse       Int      // Verse number

  // AI-generated content
  context     String   // Verse-specific context
  strongs     Json     // Strong's concordance data
  words       Json     // Word meanings and analysis
  grammar     String?  // Grammatical analysis
  references  String[] // Cross-references
  commentary  String   // Independent Baptist commentary

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  model       String   // AI model used
  version     String   // Commentary version

  @@unique([book, chapter, verse, version])
  @@map("verse_commentary")
}
```

### [x] Database Migration

- [x] Create migration for new commentary tables
- [ ] Add indexes for fast lookups by book/chapter/verse
- [ ] Test database schema and relationships

## API Endpoints

### [x] Commentary API Routes

#### Chapter Commentary

- [x] `GET /api/commentary?book={book}&chapter={chapter}`
  - Check cache first, generate if missing
  - Return chapter context and commentary
  - Save to database for future requests

#### Verse Commentary

- [x] `GET /api/commentary?book={book}&chapter={chapter}&verse={verse}`
  - Check cache first, generate if missing
  - Include chapter context + verse-specific data
  - Return Strong's concordance and word analysis
  - Save to database for future requests

#### Cache Management

- [ ] `POST /api/commentary/regenerate` (admin only)
  - Force regeneration of specific commentary
  - Update version number to invalidate cache
- [ ] `GET /api/commentary/stats`
  - Show cache coverage statistics
  - Identify missing commentary entries

## Mastra AI Integration

### [x] Create Commentary Agent

```typescript
// src/mastra/agents/commentary-agent.ts
export const commentaryAgent = new Agent({
  name: "Independent Baptist Commentary Assistant",
  instructions: `You are an Independent Baptist pastor providing Bible commentary.
  
  Perspective: Independent Baptist theology and interpretation
  - Bible is literally true and inerrant
  - Salvation by grace through faith alone
  - Local church autonomy
  - Believer's baptism by immersion
  - No Catholic or denominational comparisons
  
  For chapters: Provide context, speaker, themes, culture, history
  For verses: Add Strong's numbers, word meanings, grammar, cross-references
  
  Be scholarly but accessible. Focus on practical application.`,

  model: openai("gpt-4"), // Use full model for quality
  tools: { strongsConcordanceTool, crossReferenceTool },
});
```

### [x] Create Strong's Concordance Tool

**COMPLETED**: Real AI agent implementation that provides authentic Strong's concordance data

- Uses GPT-4 for accurate Hebrew/Greek word meanings
- Provides Strong's numbers, transliterations, definitions, usage context
- Supports both Old Testament (Hebrew) and New Testament (Greek)
- Includes proper error handling and response parsing

### [x] Create Cross-Reference Tool

**COMPLETED**: Real AI agent implementation that finds authentic biblical cross-references

- Uses GPT-4 for accurate verse relationships and thematic connections
- Provides relationship types (parallel, fulfillment, theme, context, etc.)
- Includes relevance scoring and detailed explanations
- Supports filtering by testament and relationship types

## Frontend Components

### [ ] Commentary Overlay System

#### Base Overlay Component

- [ ] `CommentaryOverlay` - Base overlay with loading states
- [ ] `ChapterCommentaryOverlay` - Chapter-specific overlay
- [ ] `VerseCommentaryOverlay` - Verse-specific overlay with Strong's

#### Integration Points

- [ ] Add info icons to chapter headers
- [ ] Add info icons to verse numbers
- [ ] Add keyboard shortcuts (I for info)
- [ ] Add context menu options

### [ ] Mobile-Responsive Design

#### Overlay Behavior

- [ ] **Desktop**: Side panel overlay (non-blocking)
- [ ] **Mobile**: Full-screen modal with close button
- [ ] **Tablet**: Bottom sheet overlay
- [ ] **All**: Swipe gestures for navigation

#### Trigger Mechanisms

- [ ] **Tap/Click**: Info icon next to verse/chapter
- [ ] **Long Press**: Mobile long-press on verse text
- [ ] **Keyboard**: 'I' key when verse/chapter focused
- [ ] **Context Menu**: Right-click option

## UI/UX Integration Strategy

### Current System Analysis

Based on the codebase review, here's how to integrate intuitively:

#### 1. Chapter Header Integration

**Current**: Chapter headers show title, bookmark button, mark-all-read button
**Add**: Small info icon (ℹ️) next to chapter title

- **Desktop**: Hover shows tooltip "Chapter Commentary"
- **Mobile**: Always visible with text label
- **Click**: Opens chapter commentary overlay

#### 2. Verse Number Integration

**Current**: Verse numbers are clickable and show read status
**Add**: Small info icon next to verse number when hovered/focused

- **Desktop**: Appears on hover of verse number
- **Mobile**: Always visible as small icon
- **Touch**: Tap verse number for commentary
- **Long Press**: Mobile long-press for quick access

#### 3. Overlay Design System

**Consistent with existing UI**:

- Use existing card/sheet components
- Match current color scheme and typography
- Integrate with tools sheet design pattern
- Respect existing responsive breakpoints

### [ ] Specific UI Components

#### Chapter Commentary Trigger

```typescript
// Add to ChapterHeader component
<div className="flex items-center gap-2">
  <h1 className="text-4xl font-bold">Chapter {chapter}</h1>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setChapterCommentaryOpen(true)}
    className="opacity-60 hover:opacity-100"
  >
    <Info className="h-4 w-4" />
    <span className="ml-1 hidden sm:inline">Commentary</span>
  </Button>
</div>
```

#### Verse Commentary Trigger

```typescript
// Modify SelectableVerse component
<div className="flex items-center">
  <span className="font-semibold text-primary mr-2">{verse}</span>
  <Button
    variant="ghost"
    size="xs"
    onClick={() => setVerseCommentaryOpen(true)}
    className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
  >
    <Info className="h-3 w-3" />
  </Button>
</div>
```

### [ ] Overlay Layout Design

#### Desktop Layout (Side Panel)

```
┌─────────────────┬─────────────────┐
│                 │   Commentary    │
│   Bible Text    │     Panel       │
│                 │                 │
│   Chapter 3     │  📖 Context     │
│   1 In the...   │  👤 Speaker     │
│   2 For God...  │  🏛️ Culture     │
│                 │  📚 Topics      │
│                 │  ✝️ Commentary  │
└─────────────────┴─────────────────┘
```

#### Mobile Layout (Bottom Sheet)

```
┌─────────────────────────────────────┐
│           Bible Text                │
│                                     │
│   Chapter 3                         │
│   1 In the beginning...             │
│   2 For God so loved...             │
│                                     │
├─────────────────────────────────────┤
│   📖 Chapter 3 Commentary          │
│   ─────────────────────────────     │
│   Context: This chapter...          │
│   Speaker: John the Apostle...      │
│   [Scroll for more]                 │
└─────────────────────────────────────┘
```

### [ ] What to Change/Add

#### Existing Components to Modify

1. **ChapterHeader** (`src/components/chapter/chapter-header.tsx`)

   - Add commentary trigger button
   - Maintain existing bookmark/mark-read functionality

2. **SelectableVerse** (`src/components/verse/selectable-verse.tsx`)

   - Add verse commentary trigger on hover
   - Keep existing read status functionality

3. **Tools Sheet** (`src/components/tools/tools-sheet.tsx`)
   - Add new "Commentary" tab
   - Integrate with existing Reading/Bookmarks tabs

#### New Components to Create

1. **CommentaryOverlay** - Base overlay component
2. **ChapterCommentaryPanel** - Chapter-specific content
3. **VerseCommentaryPanel** - Verse-specific with Strong's
4. **StrongsWordDisplay** - Individual word analysis
5. **CrossReferenceList** - Related verses display

#### Integration Points

1. **Keyboard Shortcuts**

   - 'I' key for commentary (when verse/chapter focused)
   - 'Esc' to close overlays
   - Arrow keys to navigate between verses in overlay

2. **Context Menus**

   - Right-click on verse text shows "View Commentary"
   - Right-click on chapter title shows "Chapter Commentary"

3. **Mobile Gestures**
   - Long press on verse for quick commentary
   - Swipe up on chapter for chapter commentary
   - Swipe down to close overlays

### [ ] Performance Optimization

#### Caching Strategy

- [ ] Database cache for all AI responses
- [ ] Browser cache for recently viewed commentary
- [ ] Preload commentary for current chapter
- [ ] Background loading for adjacent chapters

#### Loading States

- [ ] Skeleton loading for commentary panels
- [ ] Progressive loading (context first, then details)
- [ ] Offline cache for previously viewed commentary
- [ ] Error states with retry options

## Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Database schema and migrations
- [ ] Basic API endpoints with caching
- [ ] Mastra agent and tools setup
- [ ] Basic overlay components

### Phase 2: Chapter Commentary (Week 2)

- [ ] Chapter commentary generation
- [ ] Chapter overlay integration
- [ ] Desktop responsive design
- [ ] Mobile responsive design

### Phase 3: Verse Commentary (Week 3)

- [ ] Verse commentary with Strong's
- [ ] Word analysis and cross-references
- [ ] Advanced overlay features
- [ ] Keyboard shortcuts and gestures

### Phase 4: Polish & Optimization (Week 4)

- [ ] Performance optimization
- [ ] Error handling and edge cases
- [ ] User testing and feedback
- [ ] Documentation and deployment

## Technical Considerations

### AI Model Selection

- **Primary**: GPT-4 for quality commentary
- **Fallback**: GPT-4-mini for cost efficiency
- **Caching**: Aggressive caching to minimize API calls

### Strong's Integration

- Use existing Strong's concordance databases
- Consider Blue Letter Bible API or similar
- Cache all Strong's data locally

### Cross-Reference Sources

- Treasury of Scripture References
- Nave's Topical Bible
- Matthew Henry's cross-references

### Error Handling

- Graceful degradation when AI unavailable
- Fallback to cached content
- Clear error messages for users
- Retry mechanisms with exponential backoff

## Success Metrics

### User Engagement

- [ ] Commentary overlay usage rates
- [ ] Time spent reading commentary
- [ ] Verse/chapter coverage with commentary

### Technical Performance

- [ ] Cache hit rates (target: >90%)
- [ ] API response times (target: <500ms cached, <3s generated)
- [ ] Mobile performance scores
- [ ] Error rates and recovery

### Content Quality

- [ ] User feedback on commentary accuracy
- [ ] Theological consistency reviews
- [ ] Strong's concordance accuracy validation
