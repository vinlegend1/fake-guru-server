import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Follow } from "./Follow";
import { Post } from "./Post";

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    boardId: number;

    @Column({ unique: true })
    boardName: string;

    @Column()
    boardDescription: string;

    @OneToMany(() => Follow, follow => follow.board)
    followers: Follow[];

    @OneToMany(() => Post, post => post.fromBoard)
    posts: Post[]

    @CreateDateColumn()
    createdAt: Date;

}