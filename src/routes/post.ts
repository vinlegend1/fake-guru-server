import { Router } from 'express';
import passport from 'passport';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { createMessage } from '../utils/createMessage';
import { Board } from 'src/entities/Board';

const router = Router();

// ======================= Find by Board -- Start -- ===========================================

router.get('/from/board/:boardId', async (req, res) => {
    const { boardId } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const posts = await Post.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
        where: {
            boardId
        }
    })

    return res.json(posts)
});

router.get('/from/board/name/:boardName', async (req, res) => {
    const { boardName } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const board = await Board.findOne({ where: { boardName } });

    if (!board) {
        return res.json([]);
    }

    const posts = await Post.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
        where: {
            boardId: board.boardId
        }
    })

    return res.json(posts)
});

// ====== Find by Board -- End -- ======

// ====== Find by User -- Start -- ======

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

    const posts = await Post.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
        where: {
            creatorId: user.id
        }
    })

    return res.json(posts)
});

// get all posts with creator's id
router.get('/from/user/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const posts = await Post.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
        where: {
            creatorId: parseInt(id)
        }
    })

    return res.json(posts)
});

// ====== Find by User -- End -- ======

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;

    const post = await Post.findOne({ where: { postId: parseInt(id) } });

    if (!post) {
        return res.status(400).json(createMessage("Post not found", true));
    }

    return res.json(post);
});

router.post('/new/to/:boardName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user as User;
    const { title, body, media, category } = req.body;
    const { boardName } = req.params;

    const board = await Board.findOne({ where: { boardName } });

    if (!board) {
        res.status(400).json(createMessage("Board does not exist", true));
        return;
    }

    const newPost = await Post.create({
        title,
        body,
        creatorId: user.id,
        boardId: board.boardId,
        media,
        category
    }).save();

    res.json(newPost);
});

export default router;