import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Follow } from "./Follow";
import { Post } from "./Post";

@Entity()
export class Board extends BaseEntity {
    @PrimaryGeneratedColumn()
    boardId: number;

    @Column({ unique: true })
    boardName: string;

    @Column()
    boardDescription: string;

    @Column({ type: "float", default: 0 })
    popularity: number;

    @OneToMany(() => Follow, follow => follow.board)
    followers: Follow[];

    @OneToMany(() => Post, post => post.board)
    posts: Post[]

    @CreateDateColumn()
    createdAt: Date;
}