import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "./Like";
import { Comment } from './Comment';

@Entity()
export class Reply extends BaseEntity {
    @PrimaryGeneratedColumn()
    replyId: number;

    // === ParentComment ===

    @Column()
    parentCommentId: number;

    @ManyToOne(() => Comment, comment => comment.replies)
    @JoinColumn({ name: "parentCommentId" })
    parentComment: Comment;

    @OneToMany(() => Like, like => like.reply)
    likes: Like[];

    @Column({ type: "int", default: 0 })
    value: number;
}