import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ticket_cost")
export class TicketCost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('int')
    id_ticket!: number;

    @Column('double')
    super_cost!:number;
}
