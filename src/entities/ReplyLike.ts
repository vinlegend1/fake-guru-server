import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Reply } from "./Reply";
import { User } from "./User";

@Entity()
export class ReplyLike extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, user => user.replyLikes)
    @JoinColumn({ name: "userId" })
    user: User;

    @PrimaryColumn()
    replyId: number;

    @ManyToOne(() => Reply, reply => reply.likes)
    @JoinColumn({ name: "replyId" })
    reply: Reply;
}