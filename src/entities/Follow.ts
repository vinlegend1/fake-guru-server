import { Entity, ManyToOne, BaseEntity, JoinColumn, PrimaryColumn } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@Entity()
export class Follow extends BaseEntity {

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: "userId" })
    user: User;

    @PrimaryColumn()
    boardId: number;

    @ManyToOne(() => Board, board => board.followers)
    @JoinColumn({ name: "boardId" })
    board: Board;
}