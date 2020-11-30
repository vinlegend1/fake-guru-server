import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, BaseEntity } from "typeorm";
import { Comment } from "./Comment";
import { CommentLike } from "./CommentLike";
import { Follow } from "./Follow";
import { Post } from "./Post";
import { PostLike } from "./PostLike";
import { Reply } from "./Reply";
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

    @OneToMany(() => Comment, comment => comment.creator)
    comments: Comment[];

    @OneToMany(() => Reply, reply => reply.creator)
    replies: Reply[];

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