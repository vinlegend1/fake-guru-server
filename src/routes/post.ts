import { Router } from 'express';
import { User } from '../entities/User';
import { getRepository } from 'typeorm';
import { createMessage, createIsAuthMessage } from '../utils/createMessage';
import passport from 'passport';

const router = Router();

router.get('/', passport.authenticate('jwt'), (req, res) => {

})

export default router;