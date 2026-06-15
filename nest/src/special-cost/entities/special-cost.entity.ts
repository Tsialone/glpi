import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("special_costs")
export class SpecialCost {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int")
    id_ticket!: number;

    @Column("varchar")
    item_type!: string;

    @Column ("int")
    id_item!:number;

    @Column("varchar")
    category!: string;

    @CreateDateColumn({ type: "datetime" })
    created: Date = new Date();

    @Column ("double")
    value!:number;
}
