import { Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@Entity()
export class Follow extends BaseEntity {

    @PrimaryGeneratedColumn({ type: "uuid" })
    followId: string;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @ManyToOne(() => Board, board => board.followers)
    board: Board;
}