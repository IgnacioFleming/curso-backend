import UserDto from "../dao/dto/user.dto.js";
import { userModel } from "../dao/models/user.model.js";

export const shiftUserRole = async (req, res) => {
  const { uid } = req.params;
  const user = await userModel.findById(uid);
  if (!user) return res.status(400).send({ status: "error", error: "El usuario no existe en la base o no es posible modificar su rol" });
  const premiumRequiredDocs = ["id", "address", "accountStatement"];
  if (user.role === "usuario") {
    const docsValidation = premiumRequiredDocs.every((name) => {
      return user.documents.some((doc) => doc.name === name);
    });
    if (docsValidation) {
      user.role = "premium";
    } else {
      return res.status(400).send({ status: "error", error: "El usuario no registró los documentos necesarios para ser Premium" });
    }
  } else {
    user.role = "usuario";
  }
  const result = await userModel.updateOne({ _id: uid }, user);
  res.send({ status: "success", payload: `Se cambió el rol del usuario a '${user.role}'` });
};

export const uploadDocuments = async (req, res) => {
  try {
    const keys = Object.keys(req.files);
    let documents = [];
    keys.forEach((k) => {
      const Array = req.files[k].map((e) => {
        return documents.push({
          name: e.fieldname,
          reference: e.path,
        });
      });
    });
    await userModel.updateOne({ email: req.user.email }, { $push: { documents } });
    res.send({ status: "success", payload: "Los documentos fueron cargados exitosamente" });
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await userModel.find();
  const usersDTO = users.map((user) => new UserDto(user));
  res.send({ status: "success", payload: usersDTO });
};

export const deleteInactiveUsers = async (req, res) => {
  const users = await userModel.find();
  const limitDate = Date.now() - 3600 * 1000 * 48;
  const deletedUsers = await Promise.all(
    users.map(async (user) => {
      console.log("last connection ", Date.parse(user.last_connection));
      console.log("validation date ", limitDate);
      console.log("assertion", user.last_connection > limitDate);
      if (user.last_connection <= limitDate) {
        await userModel.findByIdAndDelete(user._id);
        return user._id;
      }
    })
  );

  res.send({ status: "success", payload: `Los usuarios eliminados son: ${deletedUsers}` });
};
