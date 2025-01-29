-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Admin',

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_status" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_number" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phone_number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call" (
    "id" SERIAL NOT NULL,
    "phoneNumberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "call_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "phone_status_status_key" ON "phone_status"("status");

-- AddForeignKey
ALTER TABLE "phone_number" ADD CONSTRAINT "phone_number_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "phone_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call" ADD CONSTRAINT "call_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "phone_number"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
