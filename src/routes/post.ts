import { Router } from 'express';
import passport from 'passport';
import { Post } from '../entities/Post';

const router = Router();

router.get('/from/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { username } = req.params;
    const { l, p } = req.query;

    console.log('l: ', typeof l)
    console.log('p: ', p)

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const post = await Post.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
        where: {
            creator: {
                username: username
            }
        }
    })

    return res.json(post)
})

export default router;