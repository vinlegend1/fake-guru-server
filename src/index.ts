import "reflect-metadata";
import express from 'express';
import { createConnection } from "typeorm";
import passport from "passport";
import cors from 'cors';
import userRouter from './routes/user';
import "./passport-config"
import { connOptions } from "./constants";

const main = async () => {
    const app = express();

    app.use(cors());
    app.use(passport.initialize());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    const conn = await createConnection(connOptions);

    // await conn.createQueryBuilder()
    //     .delete()
    //     .from(User)
    //     .where("username= :username", { username: "ben" })
    //     .execute();
    // await conn.runMigrations();

    app.get('/', (_, res) => {
        res.send('hello world');
    });

    app.use('/api/user', userRouter);

    app.listen(5000, () => {
        console.log('listening on port 5000');
    });
}

main().catch((err) => {
    console.error(err);
});