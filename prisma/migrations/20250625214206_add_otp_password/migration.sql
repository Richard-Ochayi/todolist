/*
  Warnings:

  - Added the required column `passwordHash` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "passwordHash" TEXT NOT NULL;
