import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TicketHistory } from "../../ticket-history/entities/ticket-history.entity";

@Entity("actions")
export class Action {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar")
    libelle!: string;

    @CreateDateColumn({ type: "datetime" })
    created: Date = new Date();

    @OneToMany(() => TicketHistory, (ticket) => ticket.action)
    tickets!:TicketHistory []
}
