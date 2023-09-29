import passport from "passport";
import local from "passport-local";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

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
          //   if (
          //     username === "adminCoder@coder.com" &&
          //     password === "adminCod3r123"
          //   ) {
          //     const user = {
          //       email: username,
          //       status: "active",
          //       role: "admin",
          //       first_name: "Admin_User",
          //       //   _id: "1",
          //     };
          //     return done(null, user);
          //   }
          const user = await userModel.findOne({ email: username });
          if (!user) return done(null, false);
          const validation = isValidPassword(password, user);
          console.log("la validacion es", validation);
          if (!validation) return done(null, false);
          return done(null, user);
        } catch (error) {
          //   console.log("pase por el catch");
          done(error);
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
