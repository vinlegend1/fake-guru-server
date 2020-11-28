import { PostCategory } from "../types";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, JoinColumn } from "typeorm";
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

    // === User ===

    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: "creatorId" })
    creator: User;

    // === Board ===

    @Column()
    boardId: number;

    @ManyToOne(() => Board, board => board.posts, { nullable: true })
    @JoinColumn({ name: "boardId" })
    board: Board;

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