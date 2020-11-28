import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { Reply } from "./Reply";
import { User } from "./User";

@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn({ type: "uuid" })
    likeId: string;

    @ManyToOne(() => User, user => user.likes)
    user: User;

    @ManyToOne(() => Post, post => post)
    post?: Post;

    @ManyToOne(() => Comment, comment => comment.likes)
    comment?: Comment;

    @ManyToOne(() => Reply, reply => reply.likes)
    reply?: Reply;

    @CreateDateColumn()
    createdAt: Date;
}