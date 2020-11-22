import jwt from 'jsonwebtoken';
import { secretOrPrivateKey } from '../constants';

export const signToken = (userID: string) => {
    return jwt.sign({
        iss: secretOrPrivateKey,
        sub: userID
    }, secretOrPrivateKey, { expiresIn: "5hr" });
}