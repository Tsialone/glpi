import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("status_colors")
export class StatusColor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("int", { unique: true })
    id_status!: number;

    @Column("varchar")
    color!: string;


}
