import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { entorno } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: entorno.SMTP_USUARIO,
    pass: entorno.SMTP_CLAVE,
  },
});

const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: join(__dirname, "../assets/templates/"),
    defaultLayout: false,
  },
  viewPath: join(__dirname, "../assets/templates/"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

export default transporter;
