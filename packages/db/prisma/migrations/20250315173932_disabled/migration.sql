/*
  Warnings:

  - Added the required column `disabled` to the `WebSite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WebSite" ADD COLUMN     "disabled" BOOLEAN NOT NULL;
