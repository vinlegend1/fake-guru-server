import { PostCategory } from "../types";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @ManyToOne(() => User, user => user.posts)
    creator: User;

    @ManyToOne(() => Board, board => board.posts)
    fromBoard: Board;

    @Column()
    category: PostCategory;

    @Column({ nullable: true })
    media: string; // possibly array of strings... let's see

    @Column()
    createdAt: Date;
}