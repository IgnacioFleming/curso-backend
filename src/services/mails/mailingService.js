import mailer from "nodemailer";
import config from "../../config/config.js";

export default class MailingService {
  constructor() {
    this.client = mailer.createTransport({
      service: config.mailing.service,
      port: 587,
      auth: {
        user: config.mailing.user,
        pass: config.mailing.password,
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
