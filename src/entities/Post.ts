import { PostCategory } from "../types";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";
import { Activity } from "./Activity";

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

    @OneToMany(() => Activity, activity => activity.parent)
    activity: Activity;

    @Column()
    createdAt: Date;
}