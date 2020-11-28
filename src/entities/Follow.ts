import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Board } from "./Board";
import { User } from "./User";

@Entity()
export class Follow {

    @PrimaryGeneratedColumn()
    followId: number;

    @ManyToOne(() => User, user => user.posts)
    user: User;

    @ManyToOne(() => Board, board => board.followers)
    board: Board;
}