import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "./Like";
import { Comment } from './Comment';

@Entity()
export class Reply extends BaseEntity {
    @PrimaryGeneratedColumn()
    replyId: number;

    @ManyToOne(() => Comment, comment => comment.replies)
    parentComment: Comment;

    @OneToMany(() => Like, like => like.reply)
    likes: Like[];

    @Column({ type: "int", default: 0 })
    value: number;
}