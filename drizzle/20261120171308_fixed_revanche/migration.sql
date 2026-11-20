CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7(),
	"student_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "courses_student_id_name_key" ON "courses" ("student_id","name");