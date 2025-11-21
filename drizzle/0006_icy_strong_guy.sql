-- Step 1: Create new leads table with updated schema
CREATE TABLE `leads_new` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `name` text NOT NULL,
    `contact_mode` text,
    `description` text,
    `status` text DEFAULT 'new' NOT NULL,
    `value` integer,
    `created_at` integer NOT NULL,
    `updated_at` integer NOT NULL,
    `deleted_at` integer
);-->statement-breakpoint

-- Step 2: Copy data from old table to new table (if any exists)
INSERT INTO `leads_new` (`id`, `name`, `contact_mode`, `description`, `status`, `value`, `created_at`, `updated_at`, `deleted_at`)
SELECT `id`, 'Unknown Lead', `source`, NULL, `status`, `value`, `created_at`, `updated_at`, `deleted_at`
FROM `leads`;-->statement-breakpoint

-- Step 3: Drop old table
DROP TABLE `leads`;-->statement-breakpoint

-- Step 4: Rename new table to original name
ALTER TABLE `leads_new` RENAME TO `leads`;-->statement-breakpoint

-- Step 5: Add project_id to transactions
ALTER TABLE `transactions` ADD `project_id` integer REFERENCES projects(id);