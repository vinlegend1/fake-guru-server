import { Router } from 'express';
import passport from 'passport';
import { getConnection } from 'typeorm';
import { Follow } from '../entities/Follow';
import { createMessage } from '../utils/createMessage';

const router = Router();

router.get('/add/:boardId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { boardId } = req.params;

    await Follow.create({
        boardId: parseInt(boardId),
        userId: (req.user as any).id
    }).save().catch((_) => {
        res.status(500).json(createMessage("Something went wrong", true));
    });

    res.json(createMessage("follow board success", false));
});

router.get('/delete/:boardId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { boardId } = req.params;

    await getConnection()
        .query(`
            delete from follow f
            where f."boardId" = ${parseInt(boardId)}
            and f."userId" = ${(req.user as any).id};
        `).catch((err) => {
            res.status(400).json(createMessage(err, true));
        })

    res.json(createMessage("unfollow board success", false));
});

export default router;