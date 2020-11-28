import { Router } from 'express';
import passport from 'passport';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { createMessage } from '../utils/createMessage';

const router = Router();

// get all posts with creator's username
router.get('/from/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { username } = req.params;
    const { l, p } = req.query;

    // console.log('l: ', typeof l)
    // console.log('p: ', p)

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const user = await User.findOne({ where: { username } });

    if (!user) {
        return res.json([]);
    }

    const post = await Post.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
        where: {
            creatorId: user.id
        }
    })

    return res.json(post)
});

// get all posts with creator's id
router.get('/from/user/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const post = await Post.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
        where: {
            creatorId: parseInt(id)
        }
    })

    return res.json(post)
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;

    const post = await Post.findOne({ where: { postId: parseInt(id) } });

    if (!post) {
        return res.status(400).json(createMessage("Post not found", true));
    }

    return res.json(post);
});

export default router;