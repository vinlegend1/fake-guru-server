import { Router } from 'express';
import { User } from '../entities/User';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { createMessage, createIsAuthMessage } from '../utils/createMessage';
import passport from 'passport';
import { signToken } from '../utils/signToken';
import { cookieName } from '../constants';

const router = Router();

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    const userRepository = getRepository(User);
    const hashedPassword = await bcrypt.hash(password, 12);

    if (!username || !password || !email) {
        res.status(400).json(createMessage("Some fields are missing", true));
        return;
    }

    await userRepository.insert({
        email,
        username,
        password: hashedPassword
    }).catch((_) => {
        res.status(400).json(createMessage("Something went wrong", true));
        return;
    });

    res.json({
        email,
        username,
    })
});

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const { id } = req.user as User;
        const token = signToken(id);
        res.cookie(cookieName, token, { httpOnly: true, sameSite: true });
        console.log(token);
        res.status(200).json(createIsAuthMessage(true, req.user as User));
    }
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id, email, username, posts } = req.user as User;
    res.json({
        id,
        email,
        username,
        posts
    });
});

router.get('/logout', passport.authenticate('jwt', { session: false }), (_, res) => {
    res.clearCookie(cookieName);
    res.json(createMessage("logout success", false));
})

export default router;