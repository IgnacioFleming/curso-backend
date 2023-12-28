import mailer from "nodemailer";

export default class MailingService {
  constructor() {
    this.client = mailer.createTransport({
      service: process.env.SERVICE,
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
  }
  async sendSimpleMail({ from, to, subject, html, attachments = [] }) {
    const result = await this.client.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
    return result;
  }
}
