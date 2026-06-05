import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../categories/entities/category.entity";

@Entity ("articles")
export class Article {
    @PrimaryGeneratedColumn()
    id!:number;

    @Column ("varchar")
    name!:string;

    @Column ("text")
    description!:string;

    @ManyToOne (()=> Category , (category) =>  category.articles )
    category!:Category

}
