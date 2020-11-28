import "reflect-metadata";
import express from 'express';
import { createConnection } from "typeorm";
import passport from "passport";
import cors from 'cors';
import userRouter from './routes/user';
import postRouter from './routes/post';
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
    //     .from(User)
    //     .execute();
    // await conn.runMigrations();

    app.get('/', (_, res) => {
        res.send('hello world');
    });

    app.use('/api/user', userRouter);
    app.use('/api/post', postRouter);

    app.listen(5000, () => {
        console.log('listening on port 5000');
    });
}

main().catch((err) => {
    console.error(err);
});