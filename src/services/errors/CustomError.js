export default class CustomError {
  static createError({ name = "Error", cause, message, code = 1 }) {
    const error = { message, cause };
    error.name = name;
    error.code = code;
    console.log("paso por el custom error");
    throw error;
  }
}
