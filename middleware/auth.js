import passport from 'passport'
import socketioJwt  from "socketio-jwt"
import passportJwt from 'passport-jwt'

const JwtStrategy = passportJwt.Strategy
const JwtExtractStrategy = passportJwt.ExtractJwt

const JwtStrategyConfig = {
  secretOrKey: 'secret',
  algorithms: ['HS256'],
  issuer: 'issuer',
  ignoreExpiration: false,
  jwtFromRequest: JwtExtractStrategy.fromAuthHeaderWithScheme('Bearer'), // Authorization: Bearer <token>
  passReqToCallback: true
}

export function authMiddleware (app) {
  const authStrategy = new JwtStrategy(JwtStrategyConfig, async (req, payload, done) => {
    const id = parseInt(payload.sub)

    if (id) {
      req.currentUser = payload.user

      done(null, id)
    } else done(null, false)
  })

  passport.use(authStrategy)
  app.use(passport.initialize())
}

export function socketAuthMiddleware () {
    return socketioJwt.authorize({
      secret: JwtStrategyConfig.secretOrKey,
      handshake: true
    })
}
