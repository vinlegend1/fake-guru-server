import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/get/:boardName', passport.authenticate('jwt', { session: false }), async (req, res) => {

});

router.get('/:boardId', passport.authenticate('jwt', { session: false }), async (req, res) => {

});

router.get('/get/all', async (req, res) => {

});

export default router;