import { Strategy } from 'passport-google-oauth2'
import passport from 'passport'
import User from './models/user'
import { Request } from 'express'
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL } from './config/environment'

passport.use(new Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/authentication/google/callback`,
        passReqToCallback   : true
    },
    async function(request: Request, accessToken: any, refreshToken: any, profile: any, done: any) {
        const {id, name, picture, email} = profile
        const fullPicture = picture.substring(0, picture.indexOf("=s"))
        let user = await User.findOne({googleId: id})

        if (!user) {
            user = new User({
                googleId: id,
                firstname: name.familyName,
                lastname: name.givenName,
                email: email,
                imgUrl: fullPicture,
            })
            try {
                user = await user.save()
            } catch (error) {
                return done(error, null)    
            }
        }

        done(null, {
            _id: user._id, firstname: user.firstname,
            lastname: user.lastname, email: user.email,
            imgUrl: user.imgUrl
        })
    }
))

passport.serializeUser((user: any, done) => {
    done(null, user)
})

passport.deserializeUser((user: any, done) => {
    done(null, user)
})