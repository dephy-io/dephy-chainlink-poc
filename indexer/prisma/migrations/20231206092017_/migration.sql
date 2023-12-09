-- CreateTable
CREATE TABLE "Event" (
    "id" BIGSERIAL NOT NULL,
    "value" JSONB NOT NULL,
    "eventCreatedAt" INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "blockHash" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_eventCreatedAt_idx" ON "Event"("eventCreatedAt");

-- CreateIndex
CREATE INDEX "Event_cid_idx" ON "Event"("cid");

-- CreateIndex
CREATE INDEX "Event_blockNumber_idx" ON "Event"("blockNumber");

-- CreateIndex
CREATE INDEX "Event_blockHash_idx" ON "Event"("blockHash");

-- CreateIndex
CREATE INDEX "Event_txHash_idx" ON "Event"("txHash");
