CREATE TABLE `media_tags` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`id` integer PRIMARY KEY,
	`media_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`media_id`) REFERENCES `medias`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `medias` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`created_by` integer,
	`updated_by` integer,
	`id` integer PRIMARY KEY,
	`mediaMimeTypeId` integer NOT NULL,
	`name` text,
	`description` text,
	`storage_key` text NOT NULL,
	`size_in_bytes` integer NOT NULL,
	`image_width` integer,
	`image_height` integer,
	`image_alt_text` text,
	`duration` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`mediaMimeTypeId`) REFERENCES `mime_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medias_storage_key_unique` ON `medias` (`storage_key`);--> statement-breakpoint
CREATE INDEX `idx_medias_name` ON `medias` (`name`);--> statement-breakpoint
CREATE TABLE `mime_types` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`created_by` integer,
	`updated_by` integer,
	`id` integer PRIMARY KEY,
	`mime_type` text NOT NULL,
	`title` text,
	`description` text,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mime_types_mime_type_unique` ON `mime_types` (`mime_type`);--> statement-breakpoint
CREATE INDEX `idx_mime_types_mime_type` ON `mime_types` (`mime_type`);--> statement-breakpoint
CREATE TABLE `tags` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`created_by` integer,
	`updated_by` integer,
	`id` integer PRIMARY KEY,
	`name` text(100) NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_slug_unique` ON `tags` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_tags_name` ON `tags` (`name`);--> statement-breakpoint
CREATE INDEX `idx_tags_slug` ON `tags` (`slug`);--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	`access_token` text,
	`access_token_expires_at` integer,
	`account_id` text NOT NULL,
	`id_token` text,
	`password` text,
	`provider_id` text NOT NULL,
	`refresh_token` text,
	`refresh_token_expires_at` integer,
	`scope` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_provider_account_unique` ON `accounts` (`provider_id`,`account_id`);--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`impersonated_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text,
	`banned` integer,
	`ban_reason` text,
	`ban_expires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	`expires_at` integer NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verifications` (`identifier`);