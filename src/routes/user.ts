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

    await userRepository.insert({
        email,
        username,
        password: hashedPassword
    }).catch((err) => {
        res.json(createMessage(err.message, true));
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
        const token = signToken(`${id}`);
        res.cookie(cookieName, token, { httpOnly: true, sameSite: true });
        console.log(token);
        res.status(200).json(createIsAuthMessage(true, req.user as User));
    }
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { id, email, username } = req.user as any;
    res.send({
        id,
        email,
        username
    });
})

export default router;