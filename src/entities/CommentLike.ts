import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class CommentLike extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, user => user.commentLikes)
    @JoinColumn({ name: "userId" })
    user: User;

    @PrimaryColumn()
    commentId: number;

    @ManyToOne(() => Comment, comment => comment.likes)
    @JoinColumn({ name: "commentId" })
    comment: Comment;

}