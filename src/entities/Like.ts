import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { Reply } from "./Reply";
import { User } from "./User";

@Entity()
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    likeId: string;

    // === User ===

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.likes)
    @JoinColumn({ name: "userId" })
    user: User;

    // === Post ===

    @Column()
    postId?: number;

    @ManyToOne(() => Post, post => post)
    @JoinColumn({ name: "postId" })
    post?: Post;

    // === Comment ===

    @Column()
    commentId?: number;

    @ManyToOne(() => Comment, comment => comment.likes)
    @JoinColumn({ name: "commentId" })
    comment?: Comment;

    // === Reply ===

    @Column()
    replyId?: number;

    @ManyToOne(() => Reply, reply => reply.likes)
    @JoinColumn({ name: "replyId" })
    reply?: Reply;

    @CreateDateColumn()
    createdAt: Date;
}