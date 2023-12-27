import config from "../config/config.js";
import UserDto from "../dao/dto/user.dto.js";
import { userModel } from "../dao/models/user.model.js";
import { mailingService } from "../services/index.js";

const shiftUserRole = async (req, res) => {
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

const uploadDocuments = async (req, res) => {
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
    console.log(documents);

    await userModel.updateOne({ email: req.user.email }, { $push: { documents } });
    res.send({ status: "success", payload: "Los documentos fueron cargados exitosamente" });
  } catch (error) {
    res.status(500).send({ status: "error", description: error.toString() });
  }
};

const getAllUsers = async (req, res) => {
  const users = await userModel.find();
  const usersDTO = users.map((user) => new UserDto(user));
  res.send({ status: "success", payload: usersDTO });
};

const deleteInactiveUsers = async (req, res) => {
  const users = await userModel.find();
  if (users.length === 0) return res.status(400).send({ status: "error", payload: "No se encontraron usuarios" });
  const limitDate = Date.now() - 3600 * 1000 * 48;
  let deletedUsers = await Promise.all(
    users.map(async (user) => {
      if (Date.parse(user.last_connection) <= limitDate) {
        const emailBody = `
        <p>Estimado ${user.first_name}<p>
        <p>Dado que lleva más de 48 horas sin actividad, como somos algo impacientes, decidimos eliminar su cuenta,<p/>
        <p>Espero sepa entender,<p/>
        <p>Saludos</p>
        `;
        mailingService.sendSimpleMail({ from: config.mailing.user, subject: "Eliminacion de cuenta inactiva", to: user.email, html: emailBody });
        await userModel.findByIdAndDelete(user._id);
        return user._id;
      }
      return null;
    })
  );
  deletedUsers = deletedUsers.filter((id) => id != null);

  res.send({ status: "success", payload: deletedUsers.length === 0 ? "No se encontraron usuarios inactivos" : `Los usuarios eliminados son: ${deletedUsers}` });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const result = await userModel.findByIdAndDelete(id);
  res.send({ status: "success", payload: "Usuario eliminado correctamente" });
};

export default {
  shiftUserRole,
  uploadDocuments,
  getAllUsers,
  deleteInactiveUsers,
  deleteUser,
};
