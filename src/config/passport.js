import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import mongoose from "mongoose";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { cookieExtractor } from "../utils.js";
import config from "./config.js";
import UserDto from "../dao/dto/user.dto.js";
const ObjectId = mongoose.Types.ObjectId;

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
      try {
        let data = req.body;
        const user = await userModel.findOne({ email: username });
        if (user) {
          return done(null, false);
        }
        data.password = createHash(password);
        data.role = "usuario";
        const result = await userModel.create(data);
        return done(null, result);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        if (username === config.admin_user && password === config.admin_password) {
          const user = {
            email: username,
            status: "active",
            role: "admin",
            first_name: "Admin_User",
            _id: new ObjectId(),
          };
          return done(null, user);
        }
        const user = await userModel.findOne({ email: username }).lean();
        if (!user) return done(null, false, { message: "No se encontró el usuario" });
        const validation = isValidPassword(password, user);

        if (!validation) return done(null, false, { message: "Contraseña invalida" });
        return done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            const newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: "",
              email: profile._json.email,
              password: "",
              role: "usuario",
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.jwt_secret_key,
      },
      async (jwt_payload, done) => {
        try {
          const user = new UserDto(jwt_payload);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;