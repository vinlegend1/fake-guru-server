import { Router } from 'express';
import passport from 'passport';
import { getConnection } from 'typeorm';
import { CommentLike } from '../entities/CommentLike';
import { PostLike } from '../entities/PostLike';
import { ReplyLike } from '../entities/ReplyLike';
import { LikeType } from '../types';
import { createMessage } from '../utils/createMessage';

const router = Router();

router.get('/add/:type', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { type } = req.params;
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json(createMessage("invalid query params", true));
    }

    if (type === LikeType.comment) {
        await CommentLike.create({
            userId: (req.user as any).id,
            commentId: parseInt(id)
        }).save().catch((_) => {
            return res.status(500).json(createMessage("something went wrong", true));
        });

        return res.json(createMessage("like successful", false));
    } else if (type === LikeType.post) {
        await PostLike.create({
            userId: (req.user as any).id,
            postId: parseInt(id)
        }).save().catch((_) => {
            return res.status(500).json(createMessage("something went wrong", true));
        });

        return res.json(createMessage("like successful", false));
    } else if (type === LikeType.reply) {
        await ReplyLike.create({
            userId: (req.user as any).id,
            replyId: parseInt(id)
        }).save().catch((_) => {
            return res.status(500).json(createMessage("something went wrong", true));
        });

        return res.json(createMessage("like successful", false));
    }

    return res.status(400).json(createMessage("invalid params", true));
});

router.get('/delete/:type', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { type } = req.params;
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json(createMessage("invalid query params", true));
    }

    if (type === LikeType.comment) {
        await getConnection().query(`
            delete from comment_like l
            where l."userId" = ${(req.user as any).id}
            and l."commentId" = ${parseInt(id)};
        `).catch((_) => {
            return res.status(500).json(createMessage("something went wrong", true));
        });

        return res.json(createMessage("unlike successful", false));
    } else if (type === LikeType.post) {
        await getConnection().query(`
            delete from post_like l
            where l."userId" = ${(req.user as any).id}
            and l."postId" = ${parseInt(id)};
        `).catch((_) => {
            return res.status(500).json(createMessage("something went wrong", true));
        });

        return res.json(createMessage("unlike successful", false));
    } else if (type === LikeType.reply) {
        await getConnection().query(`
            delete from reply_like l
            where l."userId" = ${(req.user as any).id}
            and l."replyId" = ${parseInt(id)};
        `).catch((_) => {
            return res.status(500).json(createMessage("something went wrong", true));
        });

        return res.json(createMessage("unlike successful", false));
    }

    return res.status(400).json(createMessage("invalid params", true));
})

export default router;