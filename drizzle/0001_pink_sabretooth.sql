CREATE TABLE "bank" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(20) NOT NULL,
	"bic" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contractor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"email" varchar NOT NULL,
	"vat" varchar,
	"iban" varchar,
	"coc" varchar,
	"ether" varchar,
	"debtorNum" integer,
	"bankId" integer,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"date" timestamp NOT NULL,
	"dueDate" timestamp NOT NULL,
	"senderId" integer,
	"receiverId" integer,
	"isSent" boolean DEFAULT false NOT NULL,
	"discountPercent" double precision DEFAULT 0 NOT NULL,
	"title" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"keywords" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"price" double precision NOT NULL,
	"vat" double precision DEFAULT 0 NOT NULL,
	"invoiceId" integer,
	"price2" double precision,
	"currency" varchar DEFAULT 'EUR' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bank" ADD CONSTRAINT "bank_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor" ADD CONSTRAINT "contractor_bankId_bank_id_fk" FOREIGN KEY ("bankId") REFERENCES "public"."bank"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contractor" ADD CONSTRAINT "contractor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_senderId_contractor_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."contractor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_receiverId_contractor_id_fk" FOREIGN KEY ("receiverId") REFERENCES "public"."contractor"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_invoiceId_invoice_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE no action;