# Excalidraw Integration Plan

## Overview

This document outlines the plan to integrate Excalidraw (a virtual whiteboard/drawing tool) into the OhMyLife project management platform, similar to how project files are currently handled.

## Current Architecture Analysis

### Existing File Management System

- **Database Schema**: `files` table in SQLite (D1) stores metadata
- **Storage**: Cloudflare R2 bucket (`ohmylife-files`) for actual file storage
- **API Routes**: `/api/projects/[id]/files` for upload/download/delete
- **UI Component**: `ProjectFiles.tsx` handles file upload, listing, and deletion
- **Tech Stack**: Next.js 14 (App Router), OpenNext Cloudflare, Drizzle ORM

### Existing Infrastructure

- **Cloudflare R2**: Already configured for file storage
- **Cloudflare D1**: SQLite database for metadata
- **Durable Objects**: Already configured (`ChatRoom` for project chat)
- **WebSocket Support**: Available via Durable Objects

---

## Integration Options

### Option 1: Simple R2 Storage (Recommended for MVP)

**Priority: HIGH** | **Complexity: LOW** | **Implementation Time: 2-3 hours**

This approach treats Excalidraw drawings as regular files, storing the JSON data in R2.

#### Pros

- ✅ Simple implementation, mirrors existing file system
- ✅ No additional infrastructure needed
- ✅ Easy to backup and version
- ✅ Works with existing authentication and permissions
- ✅ Low operational complexity

#### Cons

- ❌ No real-time collaboration
- ❌ Manual save required
- ❌ No concurrent editing support

#### Implementation Details

**1. Database Schema Changes**
Add a new table for Excalidraw drawings:

```sql
CREATE TABLE excalidraw_drawings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER REFERENCES projects(id),
  name TEXT NOT NULL,
  key TEXT NOT NULL,              -- R2 storage key
  thumbnail_key TEXT,             -- Optional: PNG thumbnail in R2
  created_by INTEGER REFERENCES users(id),
  created_at INTEGER,
  updated_at INTEGER,
  deleted_at INTEGER
);
```

**2. API Routes**
Create new routes following existing pattern:

- `GET /api/projects/[id]/excalidraw` - List all drawings for a project
- `POST /api/projects/[id]/excalidraw` - Create new drawing
- `GET /api/projects/[id]/excalidraw/[drawingId]` - Load specific drawing
- `PUT /api/projects/[id]/excalidraw/[drawingId]` - Update drawing (save)
- `DELETE /api/projects/[id]/excalidraw/[drawingId]` - Delete drawing
- `GET /api/projects/[id]/excalidraw/[drawingId]/export` - Export as PNG/SVG

**3. Data Storage Format**
Store in R2 as JSON:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "ohmylife",
  "elements": [...],
  "appState": {...},
  "files": {...}
}
```

**4. UI Components**

**a. ProjectExcalidraw.tsx** (List View)
Similar to `ProjectFiles.tsx`:

- Button: "New Excalidraw Drawing"
- List of existing drawings with thumbnails
- Actions: Open, Rename, Delete, Export

**b. ExcalidrawEditor.tsx** (Editor Component)

- Dynamic import (required for Next.js SSR compatibility)
- Full-screen or modal dialog
- Auto-save functionality (debounced onChange)
- Save button with loading state
- Export options (PNG, SVG, JSON)

**5. Package Installation**

```bash
npm install @excalidraw/excalidraw
```

**6. Next.js Integration**
Use dynamic import to avoid SSR issues:

```typescript
const Excalidraw = dynamic(async () => (await import("@excalidraw/excalidraw")).Excalidraw, {
  ssr: false,
});
```

---

### Option 2: Real-time Collaboration with Durable Objects

**Priority: LOW** | **Complexity: HIGH** | **Implementation Time: 8-12 hours**

This approach adds real-time collaboration using Cloudflare Durable Objects.

#### Pros

- ✅ Real-time multi-user collaboration
- ✅ Live cursor tracking
- ✅ Automatic conflict resolution
- ✅ Modern collaborative experience

#### Cons

- ❌ Significantly more complex
- ❌ Higher operational costs (Durable Objects usage)
- ❌ More difficult to debug
- ❌ Requires WebSocket management
- ❌ State synchronization complexity

#### Implementation Details

**1. Durable Object Class**
Create `ExcalidrawRoom` Durable Object:

```typescript
export class ExcalidrawRoom {
  state: DurableObjectState;
  sessions: Set<WebSocket>;
  currentDrawing: ExcalidrawData;

  async fetch(request: Request) {
    // Handle WebSocket upgrade
    // Broadcast changes to all connected clients
    // Merge incoming changes with version numbers
  }
}
```

**2. wrangler.json Updates**

```json
{
  "durable_objects": {
    "bindings": [
      {
        "name": "CHAT_ROOM",
        "class_name": "ChatRoom"
      },
      {
        "name": "EXCALIDRAW_ROOM",
        "class_name": "ExcalidrawRoom"
      }
    ]
  },
  "migrations": [
    {
      "tag": "v2",
      "new_sqlite_classes": ["ExcalidrawRoom"]
    }
  ]
}
```

**3. State Synchronization**

- Use Excalidraw's built-in `version` and `versionNonce` fields
- Implement operational transformation or CRDT-like merging
- Broadcast changes via WebSocket
- Handle reconnection and state recovery

**4. Persistence Strategy**

- Keep active state in Durable Object memory
- Periodically save to R2 (every 30 seconds or on disconnect)
- Load from R2 on first connection
- Store in D1 for metadata and discovery

**5. Client-Side Integration**

```typescript
// Connect to Durable Object WebSocket
const ws = new WebSocket(`wss://api/excalidraw/room/${drawingId}`);

// Handle incoming changes
ws.onmessage = (event) => {
  const changes = JSON.parse(event.data);
  // Merge with local state
};

// Send local changes
const handleChange = (elements, appState, files) => {
  ws.send(JSON.stringify({ elements, appState, files }));
};
```

---

## Recommended Implementation Approach

### Phase 1: MVP with R2 Storage (Option 1)

**Timeline: Week 1**

1. **Day 1-2: Backend Setup**
   - [ ] Add `excalidraw_drawings` table to schema
   - [ ] Generate and run database migration
   - [ ] Create API routes for CRUD operations
   - [ ] Implement R2 storage logic

2. **Day 3-4: Frontend Components**
   - [ ] Install `@excalidraw/excalidraw` package
   - [ ] Create `ExcalidrawEditor.tsx` with dynamic import
   - [ ] Create `ProjectExcalidraw.tsx` list component
   - [ ] Add "Excalidraw" tab/section to project detail page

3. **Day 5: Polish & Testing**
   - [ ] Implement auto-save with debouncing
   - [ ] Add export functionality (PNG, SVG)
   - [ ] Add thumbnail generation for list view
   - [ ] Test create, edit, save, delete flows
   - [ ] Handle edge cases and errors

### Phase 2: Real-time Collaboration (Option 2) - OPTIONAL

**Timeline: Week 2-3** (Only if Phase 1 is successful and there's demand)

1. **Week 2: Durable Objects Setup**
   - [ ] Create `ExcalidrawRoom` Durable Object
   - [ ] Implement WebSocket connection handling
   - [ ] Add state synchronization logic
   - [ ] Update wrangler.json configuration

2. **Week 3: Client Integration & Testing**
   - [ ] Integrate WebSocket in ExcalidrawEditor
   - [ ] Implement conflict resolution
   - [ ] Add presence indicators (who's viewing)
   - [ ] Test multi-user scenarios
   - [ ] Performance optimization

---

## Technical Considerations

### 1. Excalidraw Package Size

- The `@excalidraw/excalidraw` package is ~1.5MB gzipped
- Use dynamic imports to avoid increasing initial page load
- Consider code splitting for the editor route

### 2. Data Storage Limits

- Excalidraw JSON can be large (especially with embedded images)
- R2 has no practical size limits for our use case
- Consider compression for large drawings (gzip before R2 upload)

### 3. Browser Compatibility

- Excalidraw requires modern browsers (ES2020+)
- Works on Chrome, Firefox, Safari, Edge
- Mobile support is good but touch interactions may need testing

### 4. Security

- Validate drawing JSON on server before saving
- Sanitize user input in drawing names
- Enforce project-level permissions (reuse existing auth)
- Consider rate limiting for save operations

### 5. Performance

- Debounce auto-save (e.g., 2-3 seconds after last change)
- Use optimistic UI updates
- Lazy load drawing list thumbnails
- Consider pagination if many drawings per project

---

## File Structure

```
src/
├── app/
│   └── api/
│       └── projects/
│           └── [id]/
│               └── excalidraw/
│                   ├── route.ts              # List & Create
│                   └── [drawingId]/
│                       ├── route.ts          # Get, Update, Delete
│                       └── export/
│                           └── route.ts      # Export as PNG/SVG
├── components/
│   └── project/
│       ├── ProjectExcalidraw.tsx            # List view
│       └── ExcalidrawEditor.tsx             # Editor component
├── db/
│   └── schema.ts                            # Add excalidraw_drawings table
└── lib/
    └── excalidraw/
        ├── storage.ts                       # R2 save/load utilities
        └── export.ts                        # Export utilities

# Optional for Phase 2
src/
└── durable-objects/
    └── ExcalidrawRoom.ts                    # Durable Object for collaboration
```

---

## Cost Analysis

### Option 1 (R2 Storage Only)

- **R2 Storage**: ~$0.015/GB/month (negligible for drawings)
- **R2 Operations**: Class A (write) $4.50/million, Class B (read) $0.36/million
- **Estimated Monthly Cost**: < $1 for typical usage

### Option 2 (With Durable Objects)

- **Durable Objects**: $0.15/million requests + $12.50/million GB-s
- **WebSocket Connections**: Included in DO pricing
- **R2 Costs**: Same as Option 1
- **Estimated Monthly Cost**: $5-20 depending on collaboration usage

---

## Migration Path

If starting with Option 1 and later moving to Option 2:

1. Keep R2 as the source of truth
2. Durable Objects become a "live editing cache"
3. Periodically sync DO state back to R2
4. Existing drawings work without changes
5. New drawings can opt-in to collaboration

---

## Alternatives Considered

### 1. Excalidraw+ (SaaS)

- **Pros**: No backend needed, collaboration built-in
- **Cons**: External dependency, data not in our control, recurring costs
- **Verdict**: ❌ Not suitable for self-hosted project

### 2. Tldraw

- **Pros**: Similar features, good API
- **Cons**: Less mature, smaller community
- **Verdict**: ⚠️ Excalidraw is more established

### 3. Fabric.js / Konva.js

- **Pros**: Full control, lightweight
- **Cons**: Need to build entire drawing UI from scratch
- **Verdict**: ❌ Too much work for this use case

---

## Recommendation

**Start with Option 1 (Simple R2 Storage)** for the following reasons:

1. ✅ **Quick to implement**: Can be done in 2-3 days
2. ✅ **Low risk**: Mirrors existing file system architecture
3. ✅ **Proven pattern**: Uses infrastructure already in place
4. ✅ **User value**: Provides immediate value without collaboration complexity
5. ✅ **Iterative**: Can add collaboration later if needed

**Defer Option 2 (Durable Objects Collaboration)** unless:

- Users explicitly request real-time collaboration
- Multiple team members need to work on same drawing simultaneously
- Budget allows for increased operational complexity

---

## Next Steps

1. **Review this plan** and confirm approach
2. **Create database migration** for `excalidraw_drawings` table
3. **Install Excalidraw package** and verify Next.js compatibility
4. **Build API routes** following existing file patterns
5. **Create UI components** with dynamic imports
6. **Test end-to-end flow** in development
7. **Deploy to staging** for user testing

---

## References

- [Excalidraw Documentation](https://docs.excalidraw.com)
- [Excalidraw Next.js Integration](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration#nextjs)
- [Excalidraw GitHub Examples](https://github.com/excalidraw/excalidraw/tree/master/examples/with-nextjs)
- [Cloudflare Durable Objects Docs](https://developers.cloudflare.com/durable-objects/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

---

**Last Updated**: 2025-11-23
**Status**: Draft - Awaiting Review
