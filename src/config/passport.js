import passport from "passport";
import local from "passport-local";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import mongoose from "mongoose";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

const ObjectId = mongoose.Types.ObjectId;

const LocalStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
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
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          if (
            username === "adminCoder@coder.com" &&
            password === "adminCod3r123"
          ) {
            const user = {
              email: username,
              status: "active",
              role: "admin",
              first_name: "Admin_User",
              _id: new ObjectId(),
            };
            return done(null, user);
          }
          const user = await userModel.findOne({ email: username });
          if (!user)
            return done(null, false, { message: "No se encontró el usuario" });
          const validation = isValidPassword(password, user);

          if (!validation)
            return done(null, false, { message: "Contraseña invalida" });
          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv1.6acb6e7a1c75117b",
        clientSecret: "fe39861080a4aa5652eb8a815ae484dfdc852003",
        callbackURL: "http://localhost:8080/api/sessions/githubCallback",
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

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
