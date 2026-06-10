import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Action } from "../../action/entities/action.entity";

@Entity("ticket_histories")
export class TicketHistory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar")
    id_ticket!: number;

    @Column("text")
    comment!: string;

    @CreateDateColumn({ type: "datetime" })
    created: Date = new Date();

    @ManyToOne(() => Action, (action) => action.tickets)
    action!: Action
}
