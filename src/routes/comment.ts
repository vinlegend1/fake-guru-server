import { Router } from 'express';
import passport from 'passport';
import { createMessage } from '../utils/createMessage';
import { Comment } from '../entities/Comment';

const router = Router();

// get all comments from a post
router.get('/get', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { pid, l, p } = req.query;
    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    if (!pid || typeof pid !== "string") {
        return res.status(400).json(createMessage("invalid query params", true));
    }

    const comments = await Comment.find({
        where: {
            postId: parseInt(pid)
        },
        take: limit,
        skip: page * limit
    });

    return res.json(comments);
});

router.post('/new/:postId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { postId } = req.params;
    const { body, media } = req.body;

    if (!postId) {
        return res.status(400).json(createMessage("invalid params", true));
    }

    if (!body) {
        return res.status(400).json(createMessage("form data incomplete", true));
    }

    const comment = await Comment.create({
        body,
        media,
        postId: parseInt(postId),
        creatorId: (req.user! as any).id,

    }).save().catch((err) => {
        return res.status(400).json(createMessage(err, true));
    });

    return res.json(comment);
})

export default router;