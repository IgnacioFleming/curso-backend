import { userModel } from "../dao/models/user.model.js";

export const shiftUserRole = async (req, res) => {
  const { uid } = req.params;
  const user = await userModel.findById(uid);
  if (!user) return res.status(400).send({ status: "error", error: "El usuario no existe en la base o no es posible modificar su rol" });
  user.role === "usuario" ? (user.role = "premium") : (user.role = "usuario");
  const result = await userModel.updateOne({ _id: uid }, user);
  res.send({ status: "success", payload: `Se cambió el rol del usuario a '${user.role}'` });
};
