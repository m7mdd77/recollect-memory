CREATE TABLE `ai_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`payload` text,
	`status` text NOT NULL,
	`created` integer NOT NULL,
	`lease` integer DEFAULT 0 NOT NULL,
	`result` text
);
--> statement-breakpoint
CREATE INDEX `ai_jobs_pending` ON `ai_jobs` (`status`,`created`);--> statement-breakpoint
CREATE TABLE `ai_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ai_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`csrf` text NOT NULL,
	`expires` integer NOT NULL
);
