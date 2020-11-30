import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReplyLike } from "./ReplyLike";
import { Comment } from './Comment';
import { User } from "./User";

@Entity()
export class Reply extends BaseEntity {
    @PrimaryGeneratedColumn()
    replyId: number;

    @Column()
    creatorId: number;

    @ManyToOne(() => User, user => user.replies)
    @JoinColumn({ name: 'creatorId' })
    creator: User;

    @Column()
    parentCommentId: number;

    @ManyToOne(() => Comment, comment => comment.replies)
    @JoinColumn({ name: "parentCommentId" })
    parentComment: Comment;

    @OneToMany(() => ReplyLike, like => like.reply)
    likes: ReplyLike[];

    @Column({ type: "int", default: 0 })
    value: number;

    @CreateDateColumn()
    createdAt: Date;
}