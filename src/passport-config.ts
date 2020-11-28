import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from './entities/User';
import { Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';
import { cookieName, secretOrPrivateKey } from './constants';

const cookieFromExtractor = (req: any) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies[cookieName];
    }
    return token;
}

const JWTOptions: StrategyOptions = {
    jwtFromRequest: cookieFromExtractor,
    passReqToCallback: true,
    secretOrKey: secretOrPrivateKey,
}

passport.use(new JWTStrategy(JWTOptions, async (req: any, payload: any, done: any) => {
    const user: User = await User.findOne({ where: { id: payload.sub } })
        .catch(err => {
            return done(err);
        });
    if (!user) return done(null, false);
    req.user = user;
    return done(null, user);
}))

passport.use(new LocalStrategy(async (username, password, done) => {

    const user = await User.findOne({ where: { username } })
    console.log(user);

    if (!user) return done(null, false);
    bcrypt.compare(password, user.password, (err, isTheSame) => {
        if (err) return done(err);

        if (!isTheSame) return done(null, false);

        return done(null, user);
    })

}));