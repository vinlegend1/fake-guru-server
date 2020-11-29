import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class PostLike extends BaseEntity {
    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, user => user.postLikes)
    @JoinColumn({ name: "userId" })
    user: User;

    @PrimaryColumn()
    postId: number;

    @ManyToOne(() => Post, post => post)
    @JoinColumn({ name: "postId" })
    post: Post;

    @CreateDateColumn()
    createdAt: Date;
}