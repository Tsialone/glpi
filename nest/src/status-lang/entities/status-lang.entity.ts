import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity ("status_lang")
@Unique ("uq_lang" , ["lang"  , "id_status"])
export class StatusLang {
    @PrimaryGeneratedColumn ()
    id!:number;

    @Column ("varchar")
    lang!:string;

    @Column ("int")
    id_status!:number;

    @Column ("varchar")
    value!:string;
}
