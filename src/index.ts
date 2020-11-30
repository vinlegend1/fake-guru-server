import "reflect-metadata";
import express from 'express';
import { createConnection } from "typeorm";
import passport from "passport";
import cors from 'cors';
import userRouter from './routes/user';
import postRouter from './routes/post';
import boardRouter from './routes/board';
import commentRouter from './routes/comment';
import followRouter from './routes/follow';
import likeRouter from './routes/like';
import replyRouter from './routes/reply';
import "./passport-config"
import { connOptions } from "./constants";
import cookieParser from "cookie-parser";

const main = async () => {
    const app = express();

    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }));
    app.use(passport.initialize());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cookieParser())

    const conn = await createConnection(connOptions);

    // await conn.createQueryBuilder()
    //     .delete()
    //     .from(Post)
    //     .execute();
    // await conn.runMigrations();

    app.get('/', (_, res) => {
        res.send('hello world');
    });

    app.use('/api/user', userRouter);
    app.use('/api/post', postRouter);
    app.use('/api/board', boardRouter);
    app.use('/api/comment', commentRouter);
    app.use('/api/reply', replyRouter);
    app.use('/api/like', likeRouter);
    app.use('/api/follow', followRouter);

    app.listen(5000, () => {
        console.log('listening on port 5000');
    });
}

main().catch((err) => {
    console.error(err);
});