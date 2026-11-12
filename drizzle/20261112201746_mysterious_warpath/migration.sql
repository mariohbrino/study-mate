CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"student_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"course" varchar(255) NOT NULL,
	"due_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assignments_status_check" CHECK ("status" IN ('pending', 'in_progress', 'completed'))
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"clerk_id" varchar(255) NOT NULL,
	"timezone" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"student_id" uuid NOT NULL,
	"assignment_id" uuid,
	"title" varchar(200) NOT NULL,
	"subject" varchar(120),
	"scheduled_at" timestamp DEFAULT now() NOT NULL,
	"duration_minutes" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "assignments_title_key" ON "assignments" ("title","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "students_clerk_id_key" ON "students" ("clerk_id");--> statement-breakpoint
CREATE UNIQUE INDEX "study_sessions_title_key" ON "study_sessions" ("title","student_id");--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id");--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id");--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignments"("id");