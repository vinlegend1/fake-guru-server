import { Router } from 'express';
import passport from 'passport';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { createMessage } from '../utils/createMessage';
import { Board } from '../entities/Board';
import { getConnection } from 'typeorm';

const router = Router();

// ======================= Find by Board -- Start -- ===========================================
router.get('/from/board/:boardId', async (req, res) => {
    const { boardId } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : parseInt(l);
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    // const posts = await Post.find({
    //     order: {
    //         createdAt: "DESC"
    //     },
    //     take: limit,
    //     skip: page * limit,
    //     where: {
    //         boardId
    //     },
    //     relations: ['creator', 'board']
    // })

    const posts = await getConnection().query(`
        select p."postId", p.title, p.body, p."createdAt", b."boardId", b."boardName", u.id creatorId, u.username from post p
        inner join board b on p."boardId" = b."boardId"
        inner join "user" u on p."creatorId" = u.id
        where b."boardId" = ${boardId}
        order by p."createdAt" desc
        limit ${limit} offset ${page * limit};
    `)

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
        skip: page * limit,
        where: {
            boardId: board.boardId
        },
        relations: ['creator', 'board']
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
        skip: page * limit,
        where: {
            creatorId: user.id
        },
        relations: ['creator', 'board']
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
        skip: page * limit,
        where: {
            creatorId: parseInt(id)
        },
        relations: ['creator', 'board']
    })

    return res.json(posts)
});

// ====== Find by User -- End -- ======

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;

    const post = await Post.findOne({ where: { postId: parseInt(id) }, relations: ['creator', 'board'] });

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

    if (!media) {
        const newPost = await Post.create({
            title,
            body,
            creatorId: user.id,
            boardId: board.boardId,
            category
        }).save()
            .catch((err) => {
                if (err.code === "23503") {
                    res.status(400).json(createMessage("Board does not exist", true));
                    return;
                } else if (err.code === "22P02") {
                    res.status(400).json(createMessage("Invalid category", true));
                    return;
                }
                res.status(500).json(createMessage("Something went wrong", true));
                return;
            });

        res.json(newPost);
    } else {
        const newPost = await Post.create({
            title,
            body,
            creatorId: user.id,
            boardId: board.boardId,
            category
        }).save()
            .catch((err) => {
                if (err.code === "23503") {
                    res.status(400).json(createMessage("Board does not exist", true));
                    return;
                } else if (err.code === "22P02") {
                    res.status(400).json(createMessage("Invalid category", true));
                    return;
                }
                res.status(500).json(createMessage("Something went wrong", true));
                return;
            });
        res.json(newPost);
    }
});

router.post('/new/:boardId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const user = req.user as User;
    const { title, body, media, category } = req.body;
    const { boardId } = req.params;

    if (!boardId) {
        res.status(400).json(createMessage("You messed with the wrong Barbie", true));
        return;
    }

    if (!media) {
        const newPost = await Post.create({
            title,
            body,
            creatorId: user.id,
            boardId: parseInt(boardId),
            category
        }).save()
            .catch((err) => {
                if (err.code === "23503") {
                    res.status(400).json(createMessage("Board does not exist", true));
                    return;
                } else if (err.code === "22P02") {
                    res.status(400).json(createMessage("Invalid category", true));
                    return;
                }
                res.status(500).json(createMessage("Something went wrong", true));
                return;
            });

        res.json(newPost);
    } else {
        const newPost = await Post.create({
            title,
            body,
            creatorId: user.id,
            boardId: parseInt(boardId),
            category
        }).save()
            .catch((err) => {
                if (err.code === "23503") {
                    res.status(400).json(createMessage("Board does not exist", true));
                    return;
                } else if (err.code === "22P02") {
                    res.status(400).json(createMessage("Invalid category", true));
                    return;
                }
                res.status(500).json(createMessage("Something went wrong", true));
                return;
            });
        res.json(newPost);
    }
});

export default router;