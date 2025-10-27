-- CreateTable
CREATE TABLE "users_app" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_app_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "user_app_id" TEXT NOT NULL,
    "table_number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "people_count" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_app_email_key" ON "users_app"("email");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_app_id_fkey" FOREIGN KEY ("user_app_id") REFERENCES "users_app"("id") ON DELETE CASCADE ON UPDATE CASCADE;


