import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Helper for timestamps and soft delete
const timestamps = {
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
};

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: ["admin", "user"] }).default("user").notNull(),
    ...timestamps,
});

export const clients = sqliteTable("clients", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    address: text("address"),
    ...timestamps,
});

export const people = sqliteTable("people", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    role: text("role"),
    email: text("email"),
    phone: text("phone"),
    status: text("status", { enum: ["hiring", "active", "inactive", "terminated"] }).default("hiring").notNull(),
    hourlyRate: integer("hourly_rate"),
    projectId: integer("project_id"), // Circular dependency if referencing projects directly here, usually people exist independently or linked via junction. But if needed: .references(() => projects.id) - careful with order.
    ...timestamps,
});

export const projects = sqliteTable("projects", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    description: text("description"),
    clientId: integer("client_id").references(() => clients.id),
    status: text("status", { enum: ["active", "completed", "archived", "on_hold"] }).default("active").notNull(),
    startDate: integer("start_date", { mode: "timestamp" }),
    endDate: integer("end_date", { mode: "timestamp" }),
    ...timestamps,
});

export const leads = sqliteTable("leads", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    contactMode: text("contact_mode"), // Email, Phone, LinkedIn, Referral, etc.
    description: text("description"),
    status: text("status", { enum: ["new", "contacted", "lost", "won"] }).default("new").notNull(),
    value: integer("value"), // Potential deal value in cents
    ...timestamps,
});

// Unified financial transactions - income (sales/invoices) and expenses
export const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type", { enum: ["income", "expense"] }).notNull(),

    // Common fields
    description: text("description").notNull(),
    amount: integer("amount").notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    category: text("category"), // "sales", "salary", "office", "equipment", etc.

    // Project and Client references
    projectId: integer("project_id").references(() => projects.id),
    clientId: integer("client_id").references(() => clients.id), // Nullable, can be inferred from project

    // Income specific (invoices/sales)
    invoiceNumber: text("invoice_number"),
    amountReceived: integer("amount_received").default(0),
    status: text("status", { enum: ["draft", "sent", "paid", "partial", "overdue", "cancelled"] }),
    dueDate: integer("due_date", { mode: "timestamp" }),

    // Expense specific
    personId: integer("person_id").references(() => people.id), // For salary
    paymentMethod: text("payment_method", { enum: ["cash", "bank", "card", "upi"] }),

    ...timestamps,
});

export const notes = sqliteTable("notes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").references(() => projects.id),
    title: text("title"),
    content: text("content").notNull(),
    ...timestamps,
});

export const tasks = sqliteTable("tasks", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    type: text("type", { enum: ["personal", "project"] }).default("personal").notNull(),
    status: text("status", { enum: ["todo", "in_progress", "done", "blocked"] }).default("todo").notNull(),
    priority: text("priority", { enum: ["low", "medium", "high"] }).default("medium"),
    dueDate: integer("due_date", { mode: "timestamp" }),
    projectId: integer("project_id").references(() => projects.id),
    assigneeId: integer("assignee_id").references(() => people.id),
    ...timestamps,
});

export const files = sqliteTable("files", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").references(() => projects.id),
    name: text("name").notNull(),
    key: text("key").notNull(), // R2 key
    size: integer("size").notNull(),
    type: text("type").notNull(),
    url: text("url"),
    uploadedBy: integer("uploaded_by").references(() => users.id),
    ...timestamps,
});

export const chatMessages = sqliteTable("chat_messages", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id").references(() => projects.id),
    userId: integer("user_id").references(() => users.id),
    content: text("content").notNull(),
    ...timestamps,
});
