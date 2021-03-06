import { Router } from 'express';
import passport from 'passport';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { createMessage } from '../utils/createMessage';
import { Board } from '../entities/Board';
import { getConnection } from 'typeorm';
import { returnColsFromPosts } from '../constants';

const router = Router();

// ======================= Find by Board -- Start -- ===========================================
router.get('/from/board/:boardId', async (req, res) => {
    const { boardId } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : Math.min(50, parseInt(l));
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const posts = await getConnection().query(`
        select p."postId", p.title, p.body, p."createdAt", b."boardId", b."boardName", u.id creatorId, u.username from post p
        inner join board b on p."boardId" = b."boardId"
        inner join "user" u on p."creatorId" = u.id
        where b."boardId" = ${boardId}
        order by p."createdAt" desc
        limit ${limit} offset ${page * limit};
    `).catch((err) => {
        if (err.code === "42883") {
            return res.status(400).json(createMessage("name invalid", true));
        }
        return res.status(500).json(createMessage("Something went wrong", true));
    });

    return res.json(posts)
});

router.get('/from/board/name/:boardName', async (req, res) => {
    const { boardName } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : Math.min(50, parseInt(l));
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const posts = await getConnection().query(`
        select p."postId", p.title, p.body, p."createdAt", b."boardId", b."boardName", u.id creatorId, u.username from post p
        inner join board b on p."boardId" = b."boardId"
        inner join "user" u on p."creatorId" = u.id
        where b."boardName" = '${boardName}'
        order by p."createdAt" desc
        limit ${limit} offset ${page * limit};
    `).catch((err) => {
        if (err.code === "42883") {
            return res.status(400).json(createMessage("name invalid", true));
        }
        return res.status(500).json(createMessage("Something went wrong", true));
    });

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

    const limit: number = typeof l !== "string" ? 10 : Math.min(50, parseInt(l));
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const posts = await getConnection().query(`
        select ${returnColsFromPosts} from post p
        inner join board b on p."boardId" = b."boardId"
        inner join "user" u on p."creatorId" = u.id
        where u."username" = '${username}'
        order by p."createdAt" desc
        limit ${limit} offset ${page * limit};
    `).catch((err) => {
        if (err.code === "42883") {
            return res.status(400).json(createMessage("name invalid", true));
        }
        return res.status(500).json(createMessage("Something went wrong", true));
    })

    return res.json(posts)
});

// get all posts with creator's id
router.get('/from/user/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : Math.min(50, parseInt(l));
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const posts = await getConnection().query(`
        select ${returnColsFromPosts} from post p
        inner join board b on p."boardId" = b."boardId"
        inner join "user" u on p."creatorId" = u.id
        where u."id" = '${id}'
        order by p."createdAt" desc
        limit ${limit} offset ${page * limit};
    `).catch((err) => {
        if (err.code === "42883") {
            return res.status(400).json(createMessage("name invalid", true));
        }
        return res.status(500).json(createMessage("Something went wrong", true));
    })

    return res.json(posts)
});

// ====== Find by User -- End -- ======

router.get('/get/follow', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.user as User;
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : Math.min(50, parseInt(l));
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const posts = await getConnection().query(`
    select ${returnColsFromPosts} from follow f
    inner join board b on f."boardId" = b."boardId"
    inner join post p on p."boardId" = b."boardId"
    inner join "user" u on u."id" = p."creatorId"
    where f."userId" = ${id}
    limit ${limit} offset ${page * limit};
    `)

    return res.json(posts);
});

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.params;

    const post = await getConnection().query(`
        select ${returnColsFromPosts} from post p
        inner join board b on p."boardId" = b."boardId"
        inner join "user" u on p."creatorId" = u.id
        where p."id" = '${id}'
        limit 1;
    `).catch((err) => {
        if (err.code === "42883") {
            return res.status(400).json(createMessage("name invalid", true));
        }
        return res.status(500).json(createMessage("Something went wrong", true));
    });

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