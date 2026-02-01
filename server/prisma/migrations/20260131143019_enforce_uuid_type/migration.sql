-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- User table: drop PK, alter type, add PK
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";
ALTER TABLE "User" ALTER COLUMN "id" TYPE UUID USING "id"::UUID;
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- Product table: alter type
ALTER TABLE "Product" ALTER COLUMN "userId" TYPE UUID USING "userId"::UUID;

-- Payment table: alter type
ALTER TABLE "Payment" ALTER COLUMN "userId" TYPE UUID USING "userId"::UUID;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
