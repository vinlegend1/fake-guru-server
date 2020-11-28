import { Router } from 'express';
import { createMessage } from '../utils/createMessage';
import passport from 'passport';
import { getRepository } from 'typeorm';
import { Post } from '../entities/Post';

const router = Router();

router.get('/from/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { username } = req.params;
    const { l, p } = req.query;

    console.log('l: ', typeof l)
    console.log('p: ', p)

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const postRepository = getRepository(Post);
    const post = await postRepository.find({
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