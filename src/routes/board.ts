import { Router } from 'express';
import passport from 'passport';
import { User } from '../entities/User';
import { Board } from '../entities/Board';
import { createMessage } from '../utils/createMessage';
import { getConnection } from 'typeorm';

const router = Router();

// maybe have to write raw sql to query only what you want
router.get('/get/name/:boardName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { boardName } = req.params;

    const board = await Board.findOne({ where: { boardName } });

    if (!board) {
        res.status(400).json(createMessage("board not found", true));
        return;
    }

    res.json(board);
});

router.get('/get', async (req, res) => {
    const { l, p } = req.query;

    const limit: number = typeof l !== "string" ? 10 : Math.min(50, parseInt(l));
    const page: number = typeof p !== "string" ? 0 : parseInt(p);

    const boards = await Board.find({
        order: {
            createdAt: "DESC"
        },
        take: limit,
        skip: page,
    })

    return res.json(boards)
});

// maybe have to write raw sql to query only what you want
router.get('/:boardId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { boardId } = req.params;

    const board = await Board.findOne(boardId);

    if (!board) {
        res.status(400).json(createMessage("board not found", true));
        return;
    }
    res.json(board);
});

router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { boardName, boardDescription } = req.body;

    if (!boardName || !boardDescription) {
        res.status(400).json(createMessage("No name or description", true));
        return;
    }

    (boardName as string).replace(" ", "_");

    const newBoard = await Board.create({
        boardName,
        boardDescription
    }).save()
        .catch((_) => {
            res.status(500).json(createMessage("Something went wrong", true));
            return;
        });

    res.json(newBoard);
});

router.get('/get/follow', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { id } = req.user as User;

    const boards = await getConnection().query(`
        select b."boardId", b."boardName", b."boardDescription" from follow f
        inner join board b on f."boardId" = b."boardId"
        where f."userId" = ${id};
    `);

    res.json(boards);
});

export default router;