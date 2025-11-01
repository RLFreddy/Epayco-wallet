import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1761961811672 implements MigrationInterface {
    name = 'InitMigration1761961811672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`document\` varchar(20) NOT NULL, \`names\` varchar(100) NOT NULL, \`email\` varchar(100) NOT NULL, \`cellphone\` varchar(15) NOT NULL, \`balance\` decimal(10,2) NOT NULL DEFAULT '0.00', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_15f2ebe082a6e43a960f9f8841\` (\`cellphone\`), PRIMARY KEY (\`document\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payment_sessions\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(6) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`expiresAt\` timestamp NOT NULL, \`status\` enum ('PENDING', 'CONFIRMED', 'EXPIRED') NOT NULL DEFAULT 'PENDING', \`userDocument\` varchar(20) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payment_sessions\` ADD CONSTRAINT \`FK_e0737895ad1fb9a9c42160b3231\` FOREIGN KEY (\`userDocument\`) REFERENCES \`users\`(\`document\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment_sessions\` DROP FOREIGN KEY \`FK_e0737895ad1fb9a9c42160b3231\``);
        await queryRunner.query(`DROP TABLE \`payment_sessions\``);
        await queryRunner.query(`DROP INDEX \`IDX_15f2ebe082a6e43a960f9f8841\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
