import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentLike } from "./CommentLike";
import { Post } from "./Post";
import { Reply } from "./Reply";
import { User } from "./User";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    commentId: number;

    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'creatorId' })
    creator: User;

    @Column()
    body: string;

    @Column({ nullable: true })
    media: string;

    @Column()
    postId: number;

    @ManyToOne(() => Post, post => post.comments)
    @JoinColumn({ name: 'postId' })
    post: Post;

    @OneToMany(() => CommentLike, like => like.comment)
    likes: CommentLike[];

    @OneToMany(() => Reply, reply => reply.parentComment)
    replies: Reply[];

    @CreateDateColumn()
    createdAt: Date;
}