const passport = require('passport')
const passportJwt = require('passport-jwt')
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require('../services/user.service')

passport.use(
    new StrategyJwt({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    }, async function (jwtPayload, done) {
        try {
            const user = await User.findUserById(jwtPayload.id);
            if (user) {
                return done(null, user);
            }
            return done(user);
        } catch (error) {
            return done(error);
        }

    })
);



