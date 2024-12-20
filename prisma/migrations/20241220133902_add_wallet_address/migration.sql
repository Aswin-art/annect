/*
  Warnings:

  - You are about to drop the column `no_rek` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `is_paid` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `link_group` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `tf_image` on the `user_events` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[wallet_address]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ktp_photo` to the `channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `channels` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `channels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `channels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `channels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nik` on table `channels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `events` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `wallet_address` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_ibfk_1`;

-- DropForeignKey
ALTER TABLE `chats` DROP FOREIGN KEY `chats_ibfk_2`;

-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_ibfk_2`;

-- AlterTable
ALTER TABLE `channels` DROP COLUMN `no_rek`,
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `ktp_photo` VARCHAR(255) NOT NULL,
    ADD COLUMN `phone` VARCHAR(255) NOT NULL,
    ADD COLUMN `status` ENUM('VERIFIED', 'UNVERIFIED') NOT NULL DEFAULT 'UNVERIFIED',
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` LONGTEXT NOT NULL,
    MODIFY `image` VARCHAR(255) NOT NULL,
    MODIFY `nik` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `events` DROP COLUMN `category_id`,
    DROP COLUMN `is_paid`,
    DROP COLUMN `link_group`,
    ADD COLUMN `capacity` INTEGER NOT NULL DEFAULT 0,
    MODIFY `description` LONGTEXT NULL,
    MODIFY `status` ENUM('DONE', 'PENDING', 'ONGOING') NOT NULL DEFAULT 'ONGOING';

-- AlterTable
ALTER TABLE `user_events` DROP COLUMN `tf_image`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `email`,
    DROP COLUMN `image`,
    DROP COLUMN `name`,
    ADD COLUMN `wallet_address` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `categories`;

-- DropTable
DROP TABLE `chats`;

-- CreateIndex
CREATE UNIQUE INDEX `users_wallet_address_key` ON `users`(`wallet_address`);
