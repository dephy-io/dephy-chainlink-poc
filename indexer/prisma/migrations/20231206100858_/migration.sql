/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Event";

-- CreateTable
CREATE TABLE "LastEvent" (
    "id" BIGSERIAL NOT NULL,
    "value" JSONB NOT NULL,
    "eventCreatedAt" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "LastEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LastEvent_from_key" ON "LastEvent"("from");

-- CreateIndex
CREATE INDEX "LastEvent_eventCreatedAt_idx" ON "LastEvent"("eventCreatedAt");

-- CreateIndex
CREATE INDEX "LastEvent_from_idx" ON "LastEvent"("from");

-- CreateIndex
CREATE INDEX "LastEvent_cid_idx" ON "LastEvent"("cid");

-- CreateIndex
CREATE INDEX "LastEvent_blockNumber_idx" ON "LastEvent"("blockNumber");

-- CreateIndex
CREATE INDEX "LastEvent_blockHash_idx" ON "LastEvent"("blockHash");

-- CreateIndex
CREATE INDEX "LastEvent_txHash_idx" ON "LastEvent"("txHash");
