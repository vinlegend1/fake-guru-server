import { PostCategory } from "../types";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, JoinColumn, CreateDateColumn } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";
import { PostLike } from "./PostLike";
import { Comment } from "./Comment";

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

    @Column({
        type: "enum",
        enum: PostCategory,
        default: PostCategory.post
    })
    category: PostCategory;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @Column({ nullable: true })
    media: string; // possibly array of strings... let's see

    @OneToMany(() => PostLike, like => like.post)
    likes: PostLike[];

    @Column({ type: "int", default: 0 })
    value: number;

    @CreateDateColumn()
    createdAt: Date;
}