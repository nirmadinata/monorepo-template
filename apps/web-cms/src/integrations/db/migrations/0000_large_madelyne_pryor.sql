CREATE TABLE `media_tags` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`media_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`media_id`) REFERENCES `medias`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_media_tags_media_id` ON `media_tags` (`media_id`);--> statement-breakpoint
CREATE INDEX `idx_media_tags_tag_id` ON `media_tags` (`tag_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_tags_media_id_tag_id_unique` ON `media_tags` (`media_id`,`tag_id`);--> statement-breakpoint
CREATE TABLE `medias` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`created_by` text,
	`updated_by` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mime_type_id` integer NOT NULL,
	`name` text,
	`description` text,
	`original_filename` text,
	`storage_key` text NOT NULL,
	`size_in_bytes` integer NOT NULL,
	`width` integer,
	`height` integer,
	`image_alt_text` text,
	`duration_seconds` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`mime_type_id`) REFERENCES `mime_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `medias_storage_key_unique` ON `medias` (`storage_key`);--> statement-breakpoint
CREATE INDEX `idx_medias_created_at` ON `medias` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_medias_mime_type_id` ON `medias` (`mime_type_id`);--> statement-breakpoint
CREATE INDEX `idx_medias_name` ON `medias` (`name`);--> statement-breakpoint
CREATE TABLE `mime_types` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`created_by` text,
	`updated_by` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`mime_type` text NOT NULL,
	`title` text,
	`description` text,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mime_types_mime_type_unique` ON `mime_types` (`mime_type`);--> statement-breakpoint
CREATE INDEX `idx_mime_types_mime_type` ON `mime_types` (`mime_type`);--> statement-breakpoint
CREATE TABLE `post_editors` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`editor_id` text NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`editor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_post_editors_post_id` ON `post_editors` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_post_editors_editor_id` ON `post_editors` (`editor_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_editors_post_id_editor_id_unique` ON `post_editors` (`post_id`,`editor_id`);--> statement-breakpoint
CREATE TABLE `post_tags` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_post_tags_post_id` ON `post_tags` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_post_tags_tag_id` ON `post_tags` (`tag_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_tags_post_id_tag_id_unique` ON `post_tags` (`post_id`,`tag_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`created_by` text,
	`updated_by` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`cover_image_id` integer,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`content_key` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`first_published_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`cover_image_id`) REFERENCES `medias`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `posts_content_key_unique` ON `posts` (`content_key`);--> statement-breakpoint
CREATE INDEX `idx_posts_slug` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_posts_status` ON `posts` (`status`);--> statement-breakpoint
CREATE TABLE `tags` (
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') as integer)),
	`created_by` text,
	`updated_by` text,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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