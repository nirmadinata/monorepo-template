PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_media` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	`name` text NOT NULL,
	`key` text NOT NULL,
	`type` text NOT NULL,
	`file_format` text NOT NULL,
	`file_size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`duration` real,
	`thumbnail_key` text,
	`owner_id` text NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_media`("id", "created_at", "updated_at", "name", "key", "type", "file_format", "file_size", "width", "height", "duration", "thumbnail_key", "owner_id", "deleted_at") SELECT "id", "created_at", "updated_at", "name", "key", "type", "file_format", "file_size", "width", "height", "duration", "thumbnail_key", "owner_id", "deleted_at" FROM `media`;--> statement-breakpoint
DROP TABLE `media`;--> statement-breakpoint
ALTER TABLE `__new_media` RENAME TO `media`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `media_owner_id_idx` ON `media` (`owner_id`);--> statement-breakpoint
CREATE INDEX `media_type_idx` ON `media` (`type`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_key_unique` ON `media` (`key`);