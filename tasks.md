# Agency Management System - Task List

## ✅ Completed Features

### Initialization
- [x] Initialize Next.js project with TypeScript, Tailwind CSS, ESLint
- [x] Configure Cloudflare Pages and Wrangler
- [x] Set up Drizzle ORM and Cloudflare D1
- [x] Install shadcn/ui and core components

### Authentication
- [x] Design User schema (username, password_hash, role)
- [x] Implement Login page
- [x] Implement Session management (JWT/Cookies)
- [x] Implement Admin User Management (Create User)

### Core CRUD - Backend APIs
- [x] Clients API (GET, POST, PATCH, DELETE)
- [x] Projects API (GET, POST, PATCH, DELETE)
- [x] People API (GET, POST, PATCH, DELETE)
- [x] General Tasks API (GET, POST, PATCH, DELETE)
- [x] Project Tasks API (GET, POST, PATCH, DELETE)
- [x] Sales API (GET, POST, PATCH, DELETE)

### Core CRUD - Frontend UI
- [x] Clients Page (List, Create, Edit, Delete)
- [x] People Page (List, Create, Edit, Delete)
- [x] General Tasks Page (DataTable with Edit/Delete)
- [x] Projects List Page (View all projects)
- [x] Project Detail Page (Overview, Edit, Delete)
- [x] Project Tasks Tab (Create, Edit, Delete, Assign to People)
- [x] Sales Page (List, Create transactions)

### Sales & Finance
- [x] Support Invoice vs Direct Sale types
- [x] Auto-generate Invoice Numbers
- [x] Track amount received vs total amount
- [x] Ledger table for income/expense tracking
- [x] Update ledger on sale creation

### Project Features
- [x] Project Tasks with assignees
- [x] Files tab UI (upload/list/delete)
- [x] Chat tab UI (WebSocket-ready)
- [x] Notes tab placeholder

---

## 🐛 UI Bugs to Fix (Pre-Deployment)

### Topbar & Navigation
- [x] Rework topbar UI for cleaner appearance
- [x] Move Admin and Logout to 3-dot menu in top-right corner
- [x] Add Dashboard link to topbar navigation
- [x] Add Leads link to topbar navigation

### Clients Module
- [x] Simplify Clients page (can be managed from Projects page)
- [x] Add "Add Client" option inside Projects page

### Projects Page
- [x] Add stats cards similar to Leads page (total projects, active, completed, etc.)

### Project Detail - Tasks Tab
- [x] Fix "Add Task" functionality (currently not working)
- [x] Make task creation similar to user tasks page
- [x] Add filtering and search bar for both list and board view
- [x] Add quick "Mark as Done" check button near edit button
- [x] Remove regular checkbox selection
- [x] Replace 3-dot menu with inline buttons: Info, Done check, Edit pen, Delete
- [ ] Auto-populate user tasks page with all tasks assigned to current user from projects (requires auth/session context - future work)

---

## 🔧 Missing Features & Enhancements

### 1. Schema Enhancements
- [x] Add `clientId` foreign key to `projects` table (link projects to clients)
- [x] Add `clientId` to sales POST/PATCH APIs
- [x] Consider adding `notes` content field or separate table for project notes

### 2. Relationship Links - UI Missing
- [x] **Projects → Client**: Display which client owns the project
  - [x] Show client name in project detail page
  - [x] Add client selector when creating/editing projects
- [ ] **Clients → Projects**: Show list of projects for each client
  - [ ] Add "Projects" tab/section in client detail view
  - [ ] Or show project count on client cards
- [ ] **Clients → Sales**: Show sales/invoices for each client
  - [ ] Add "Sales" tab/section in client detail view
  - [ ] Or show total revenue on client cards

### 3. Sales Page Enhancements
- [x] Add Edit button for each sale/invoice row
- [x] Add Delete button for each sale/invoice row
- [x] Implement Edit Sale dialog (update amount, status, etc.)
- [x] Show client name in sales table (requires clientId in sales)
- [x] Add client filter/search in sales page

### 4. Projects List Page Enhancements
- [x] Add Edit button on project cards (currently only in detail page)
- [x] Add Delete button on project cards (currently only in detail page)
- [x] Show client name on project cards (requires clientId in projects)
- [x] Add status filter (active, completed, archived, on_hold)

### 5. Leads Module (Schema exists but no UI/API)
- [x] Create Leads API (GET, POST, PATCH, DELETE)
- [x] Create Leads Page UI
- [x] Link leads to clients
- [x] Track lead status (new, contacted, qualified, lost, won)
- [ ] Convert lead to client/project workflow

### 6. Notes Feature
- [x] Implement Notes API for projects
- [x] Build Notes UI in project detail page
- [x] Support create/edit/delete notes
- [x] Consider rich text editor for notes

### 7. Files & Storage (R2)
- [x] Setup R2 Binding in wrangler.json
- [x] Implement file upload API with R2 storage
- [x] Implement file download/delete APIs
- [x] Test file upload/download in project files tab

### 8. Chat (Durable Objects)
- [x] Setup Durable Object Binding in wrangler.json
- [x] Implement ChatRoom Durable Object
- [/] Connect WebSocket to Durable Object
- [ ] Test real-time chat functionality
- [ ] Store chat history in database

### 9. Dashboard & Analytics
- [x] Create main dashboard page with overview stats
- [x] Show total clients, projects, sales
- [ ] Revenue charts (monthly/yearly)
- [x] Recent activity feed
- [ ] Task completion metrics

### 10. UX Improvements
- [x] Add loading states for all data fetches
- [x] Add error handling and toast notifications
- [ ] Add confirmation dialogs for all delete actions
- [x] Add search/filter across all list pages
- [ ] Add pagination for large datasets
- [ ] Add sorting options on all tables

### 11. Data Validation
- [ ] Add form validation on all create/edit forms
- [ ] Validate email formats
- [ ] Validate date ranges (start date < end date)
- [ ] Prevent duplicate client emails
- [ ] Add required field indicators

### 12. People Enhancements
- [ ] Add phone field to people (currently only in clients)
- [ ] Show assigned projects for each person
- [ ] Show task count per person
- [ ] Add availability/capacity tracking

### 13. General Tasks Enhancements
- [x] Add due date field to general tasks (exists in schema)
- [ ] Add assignee to general tasks
- [ ] Link general tasks to projects (optional)

---

## 🚀 Future Enhancements

### Advanced Features
- [ ] Email notifications for task assignments
- [ ] Calendar view for tasks and project deadlines
- [ ] Time tracking for tasks
- [ ] Invoice PDF generation
- [ ] Payment tracking integration
- [ ] Client portal (view their projects/invoices)
- [ ] Team collaboration features
- [ ] Mobile responsive improvements
- [ ] Dark mode toggle

### Deployment & Testing
- [ ] Setup CI/CD pipeline
- [ ] Write unit tests for APIs
- [ ] Write integration tests
- [ ] Verify self-hosting flow (Wrangler local)
- [ ] Deploy to Cloudflare Pages
- [ ] Setup staging environment

---

## 📋 Priority Roadmap

### Phase 1: Critical Missing Links (High Priority)
- [x] Add clientId to projects schema and APIs <!-- id: 7 -->
- [x] Add clientId to sales schema and APIs   <!-- id: 8 -->
- [x] Show client-project relationships in UI <!-- id: 9 -->
- [x] Show client-sales relationships in UI <!-- id: 10 -->
- [x] Add edit/delete to sales page <!-- id: 11 -->
- [x] Add edit/delete to projects list page <!-- id: 12 -->

### Phase 2: Complete Existing Modules (Medium Priority)
- [x] Implement Leads module (API + UI)
- [x] Implement Notes feature for projects
- [x] Setup R2 for file storage
- [x] Setup Durable Objects for chat
- [x] Add due dates to general tasks UI

### Phase 3: Polish & UX (Medium Priority)
- [x] Add loading states and error handling
- [x] Add search/filter/pagination
- [ ] Add form validation
- [x] Add toast notifications
- [x] Create some important card with analytics on subpage if deemed helpfull.

### Phase 4: Advanced Features (Low Priority)
1. Email notifications
2. Calendar view
3. Time tracking
4. Invoice PDF generation
5. Client portal
