import passport from "passport";
export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (err, user, info) => {
      if (err) {
        req.logger.error("Error fatal al autenticarse");
        return next(err);
      }
      if (strategy === "restorePass" && !user) {
        req.logger.warning(`{
            status: "error",
            error: ${info.message ? info.message : info.toString()},
          }`);
        return res.redirect("/forgottenPass");
      }
      if (!user && strategy === "login") {
        req.logger.warning(`{
            status: "error",
            error: ${info.message ? info.message : info.toString()},
          }`);
        return res.send({ status: "error", error: info.message ? info.message : info.toString() });
      }
      if (!user) {
        req.logger.warning(`{
            status: "error",
            error: ${info.message ? info.message : info.toString()},
          }`);

        return res.redirect("/login");
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
