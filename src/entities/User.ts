import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, BaseEntity } from "typeorm";
import { Follow } from "./Follow";
import { Post } from "./Post";
import { Like } from "./Like";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @OneToMany(() => Follow, follow => follow.user)
    follows: Follow[];

    @Column()
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Like, like => like.user)
    likes: Like[]

}