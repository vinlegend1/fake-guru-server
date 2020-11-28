import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Like } from "./Like";
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

    @OneToMany(() => Like, like => like.comment)
    likes: Like[];

    @OneToMany(() => Reply, reply => reply.parentComment)
    replies: Reply[];
}