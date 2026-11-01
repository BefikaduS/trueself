CREATE TABLE "daily_checkins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anonymous_id" text NOT NULL,
	"checkin_date" text NOT NULL,
	"energy_drain" text,
	"went_well" text,
	"avoiding" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friend_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"permission" text DEFAULT 'blind' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"opened_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friend_perspectives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"from_name" text NOT NULL,
	"underestimated_strength" text NOT NULL,
	"deserves_more_credit" text NOT NULL,
	"improvement_suggestion" text NOT NULL,
	"revealed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personal_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anonymous_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"category" text DEFAULT 'note' NOT NULL,
	"linked_insight" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"item_key" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"skipped_reason" text,
	"note" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report_counters" (
	"anonymous_id" text PRIMARY KEY NOT NULL,
	"total_reports" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anonymous_id" text NOT NULL,
	"name" text NOT NULL,
	"answers" jsonb NOT NULL,
	"analysis" jsonb NOT NULL,
	"source" text DEFAULT 'demo' NOT NULL,
	"is_demo" boolean DEFAULT false NOT NULL,
	"pattern_confirmed" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "values_compass" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"report_id" uuid NOT NULL,
	"weights" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
