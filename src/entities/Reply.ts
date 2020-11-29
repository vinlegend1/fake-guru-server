import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReplyLike } from "./ReplyLike";
import { Comment } from './Comment';

@Entity()
export class Reply extends BaseEntity {
    @PrimaryGeneratedColumn()
    replyId: number;

    @Column()
    parentCommentId: number;

    @ManyToOne(() => Comment, comment => comment.replies)
    @JoinColumn({ name: "parentCommentId" })
    parentComment: Comment;

    @OneToMany(() => ReplyLike, like => like.reply)
    likes: ReplyLike[];

    @Column({ type: "int", default: 0 })
    value: number;
}