import { Router } from 'express';
import passport from 'passport';
import { Board } from '../entities/Board';
import { createMessage } from '../utils/createMessage';

const router = Router();

router.get('/get/:boardName', passport.authenticate('jwt', { session: false }), async (req, res) => {

});

router.get('/:boardId', passport.authenticate('jwt', { session: false }), async (req, res) => {

});

router.get('/get/all', async (req, res) => {

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
})

export default router;