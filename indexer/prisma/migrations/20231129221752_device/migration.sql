-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "pubkey" TEXT NOT NULL,
    "pf" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_pubkey_key" ON "Device"("pubkey");

-- CreateIndex
CREATE INDEX "Device_pubkey_idx" ON "Device"("pubkey");

-- CreateIndex
CREATE INDEX "Device_pf_idx" ON "Device"("pf");
