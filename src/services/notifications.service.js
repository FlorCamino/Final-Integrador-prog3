import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import Usuarios from '../models/usuarios.js';

process.loadEnvFile();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class NotificationService {
  static transporter;
  static banners = [
    'https://i.ibb.co/hF6VRk82/banner1.jpg',
    'https://i.ibb.co/cScgsCfD/banner2.jpg',
    'https://i.ibb.co/CXQGNQ9/banner3.jpg',
    'https://i.ibb.co/C3rbYrs1/banner4.jpg',
  ];

  static initTransporter() {
    if (NotificationService.transporter) return NotificationService.transporter;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Variables de entorno de correo no configuradas');
      return null;
    }

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
    NotificationService.transporter = transporter;
    return transporter;
  }

  static async obtenerEmailsAdministradores() {
    try {
      return await Usuarios.obtenerAdministradoresActivos();
    } catch (error) {
      console.error('Error al obtener correos de administradores:', error.message);
      return [];
    }
  }

  static async enviarCorreoReserva(reserva) {
    const transporter = NotificationService.initTransporter();
    if (!transporter || !reserva?.emailCliente) {
      console.warn('No se puede enviar correo: falta emailCliente o configuración SMTP.');
      return;
    }

    const bannerUrl = NotificationService.randomBanner();

    const mailOptions = {
      from: `"Reservas PKES" <${process.env.EMAIL_USER}>`,
      to: reserva.emailCliente,
      subject: '🎉 Confirmación de tu Reserva',
      template: 'reserva',
      context: {
        nombreCliente: reserva.nombreCliente || 'Cliente',
        salon: reserva.salon || 'Sin especificar',
        fecha: reserva.fecha || 'No definida',
        importe: reserva.importe_total || 0,
        year: new Date().getFullYear(),
        bannerUrl,
      },
    };

    await NotificationService.safeSend(transporter, mailOptions);
  }

  static async enviarCorreoAdministrador(reserva) {
    const transporter = NotificationService.initTransporter();
    const adminEmails = await NotificationService.obtenerEmailsAdministradores();

    if (!transporter || adminEmails.length === 0) {
      console.warn('No hay administradores activos con correo configurado.');
      return;
    }

    const bannerUrl = NotificationService.randomBanner();

    const mailOptions = {
      from: `"Sistema PKES" <${process.env.EMAIL_USER}>`,
      to: adminEmails.join(','),
      subject: '📩 Nueva Reserva Registrada',
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
      },
    };

    await NotificationService.safeSend(transporter, mailOptions);
  }

  static async safeSend(transporter, mailOptions) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Correo enviado correctamente a ${mailOptions.to}`);
    } catch (error) {
      console.error(`Error al enviar correo a ${mailOptions.to}:`, error.message);
    }
  }

  static randomBanner() {
    const banners = NotificationService.banners;
    return banners[Math.floor(Math.random() * banners.length)];
  }
}
