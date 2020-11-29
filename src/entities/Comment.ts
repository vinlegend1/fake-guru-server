import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentLike } from "./CommentLike";
import { Reply } from "./Reply";

@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    commentId: number;

    @Column()
    body: string;

    @Column()
    media: string;

    @Column({ type: "int", default: 0 })
    value: number;

    @OneToMany(() => CommentLike, like => like.comment)
    likes: CommentLike[];

    @OneToMany(() => Reply, reply => reply.parentComment)
    replies: Reply[];

    @CreateDateColumn()
    createdAt: Date;
}