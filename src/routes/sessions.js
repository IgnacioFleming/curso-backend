import { Router } from "express";
import passport from "passport";
import { passportCall } from "../utils.js";
import sessionsController from "../controllers/sessions.js";
const router = Router();

router.post("/login", passportCall("login"), sessionsController.handleLogin);

router.get("/current", passportCall("jwt"), sessionsController.showCurrentUser);

router.get("/failedLogin", sessionsController.handleFailedLogin);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/githubCallback", passport.authenticate("github", { failureRedirect: "/api/sessions/login" }), sessionsController.handleGithubCallback);

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failedRegister" }), sessionsController.handleRegister);

router.get("/failedRegister", sessionsController.handleFailedRegister);

router.get("/logout", sessionsController.handleLogout);

export default router;
