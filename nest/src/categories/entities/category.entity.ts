import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "../../articles/entities/article.entity";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id!: number

    @Column("varchar")
    name!: string

    @CreateDateColumn ({type:"datetime"})
    created: Date = new Date ();

    @OneToMany (()=> Article , (article) => article.category )
    articles!:Article []
}
