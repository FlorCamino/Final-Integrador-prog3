import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve(__dirname, '../views/emails/partials/'),
    layoutsDir: path.resolve(__dirname, '../views/emails/layouts/'),
    defaultLayout: 'main.hbs',
  },
  viewPath: path.resolve(__dirname, '../views/emails/'),
  extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

const banners = [
  'https://i.ibb.co/hF6VRk82/banner1.jpg',
  'https://i.ibb.co/cScgsCfD/banner2.jpg',
  'https://i.ibb.co/CXQGNQ9/banner3.jpg',
  'https://i.ibb.co/C3rbYrs1/banner4.jpg',
];

export async function enviarCorreoReserva(reserva) {
  const bannerUrl = banners[Math.floor(Math.random() * banners.length)];

  if (!reserva?.emailCliente) {
    console.warn('No se pudo enviar correo: falta el campo emailCliente.');
    return;
  }

  const mailOptions = {
    from: `"Reservas PKES" <${process.env.EMAIL_USER}>`,
    to: reserva.emailCliente,
    subject: '🎉 Confirmación de tu Reserva',
    template: 'reserva',
    context: {
      nombreCliente: reserva.nombreCliente || 'Cliente',
      salon: reserva.salon || 'Sin especificar',
      fecha: reserva.fecha || 'No definida',
      importe: reserva.importe || 0,
      year: new Date().getFullYear(),
      bannerUrl,
      port: process.env.PORT || 3000,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de confirmación enviado a ${reserva.emailCliente}`);
  } catch (error) {
    console.error('Error enviando correo de reserva:', error.message);
  }
}

export async function enviarCorreoAdministrador(reserva) {
  const bannerUrl = banners[Math.floor(Math.random() * banners.length)];

  if (!process.env.EMAIL_USER) {
    return;
  }

  const mailOptions = {
    from: `"Sistema PKES" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Nueva Reserva Registrada',
    template: 'reserva.admin',
    context: {
      nombreCliente: reserva.nombreCliente || 'Cliente',
      emailCliente: reserva.emailCliente || 'Sin correo',
      salon: reserva.salon || 'Sin especificar',
      fecha: reserva.fecha || 'No definida',
      importeSalon: reserva.importe_salon || 0,
      importeTotal: reserva.importe_total || 0,
      tematica: reserva.tematica || 'Sin especificar',
      year: new Date().getFullYear(),
      bannerUrl,
      port: process.env.PORT || 3000,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notificación enviada al administrador: ${process.env.EMAIL_USER}`);
  } catch (error) {
    console.error('Error enviando correo al administrador:', error.message);
  }
}
