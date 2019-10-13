import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

export default () => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    };
    
    passport.use(new JwtStrategy(opts, (payload, done) => { 
        if (!payload || !payload.id || !payload.username) {
            return done(null, false);
        }
        const user = {
            _id: payload.id,
            username: payload.username,
            email: payload.email,
            admin: payload.admin
        };
        return done(null, user);
    }));
};
