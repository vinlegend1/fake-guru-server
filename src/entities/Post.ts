import { PostCategory } from "../types";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";
import { Like } from "./Like";

@Entity()
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    postId: number;

    @Column()
    title: string;

    @Column()
    body: string;

    @ManyToOne(() => User, user => user.posts)
    creator: User;

    @ManyToOne(() => Board, board => board.posts, { nullable: true })
    fromBoard: Board;

    @Column()
    category: PostCategory;

    @Column({ nullable: true })
    media: string; // possibly array of strings... let's see

    @OneToMany(() => Like, like => like.post)
    likes: Like[];

    @Column({ type: "int", default: 0 })
    value: number;

    @Column()
    createdAt: Date;
}