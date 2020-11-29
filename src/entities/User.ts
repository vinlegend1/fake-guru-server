import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, BaseEntity } from "typeorm";
import { CommentLike } from "./CommentLike";
import { Follow } from "./Follow";
import { Post } from "./Post";
import { PostLike } from "./PostLike";
import { ReplyLike } from "./ReplyLike";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @OneToMany(() => Follow, follow => follow.user)
    follows: Follow[];

    @OneToMany(() => PostLike, like => like.user)
    postLikes: PostLike[]

    @OneToMany(() => CommentLike, like => like.user)
    commentLikes: CommentLike[]

    @OneToMany(() => ReplyLike, like => like.user)
    replyLikes: ReplyLike[]

    @CreateDateColumn()
    createdAt: Date;
}