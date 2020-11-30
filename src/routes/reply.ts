import { Router } from 'express';
import passport from 'passport';
import { Reply } from '../entities/Reply';
import { createMessage } from '../utils/createMessage';

const router = Router();

router.get('/get/:commentId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { l, p } = req.query;
    const { commentId } = req.params;

    const limit: number = typeof l !== "string" ? 10 : Math.min(50, parseInt(l));
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const replies = await Reply.find({
        where: { parentCommentId: commentId },
        take: limit,
        skip: page * limit
    })
        .catch((_) => {
            res.status(500).json(createMessage("Something went wrong", true));
            return;
        });

    res.json(replies);
});

router.post('/new/:commentId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { body } = req.body;
    const { commentId } = req.params;

    const reply = await Reply.create({
        body,
        creatorId: (req.user as any).id,
        parentCommentId: parseInt(commentId)
    }).save().catch((_) => {
        res.status(500).json(createMessage("Something went wrong", true));
        return;
    });

    res.json(reply);
});

export default router;