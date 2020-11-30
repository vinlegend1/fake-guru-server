import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/get', passport.authenticate('jwt', { session: false }), async (req, res) => {

});

router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res) => {

});

export default router;