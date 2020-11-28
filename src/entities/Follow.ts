import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity, Column, JoinColumn } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@Entity()
export class Follow extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    followId: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn({ name: "userId" })
    user: User;

    @Column()
    boardId: number;

    @ManyToOne(() => Board, board => board.followers)
    @JoinColumn({ name: "boardId" })
    board: Board;
}