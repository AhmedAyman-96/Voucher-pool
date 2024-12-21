import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734626578775 implements MigrationInterface {
    name = 'CreateTables1734626578775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE ("email"), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "voucher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "usageDate" TIMESTAMP, "isUsed" boolean NOT NULL, "customerId" uuid, "specialOfferId" uuid, CONSTRAINT "UQ_73e3d2a7719851716e940836980" UNIQUE ("code"), CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "special_offer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "discountPercentage" numeric NOT NULL, CONSTRAINT "PK_222536bedbb3193d48c538c37b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_6989ee24ef5d2672b35c5b0c9de" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "voucher" ADD CONSTRAINT "FK_3e78cb553c13bb4c5edcc15508d" FOREIGN KEY ("specialOfferId") REFERENCES "special_offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_3e78cb553c13bb4c5edcc15508d"`);
        await queryRunner.query(`ALTER TABLE "voucher" DROP CONSTRAINT "FK_6989ee24ef5d2672b35c5b0c9de"`);
        await queryRunner.query(`DROP TABLE "special_offer"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
