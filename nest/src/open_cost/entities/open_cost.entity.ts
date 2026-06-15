import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("open_cost")
export class OpenCost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('int')
    id_ticket!: number;

    @Column('double')
    cost!: number;
}
