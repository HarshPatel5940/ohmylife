ALTER TABLE `users` ADD `person_id` integer REFERENCES people(id);--> statement-breakpoint
ALTER TABLE `users` ADD `can_access_leads` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `can_access_finance` integer DEFAULT false;--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/