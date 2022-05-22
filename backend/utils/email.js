const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const ejs = require("ejs");
class Email {
	constructor(user, url) {
		this.to = user.email;
		this.name = user.firstName.split(" ")[0];
		this.url = url;
		this.from = `Mrx Office <${process.env.EMAIL_FROM}>`;
	}

	createTransport() {
		const transport = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		return transport;
	}

	async send(template, subject) {
		const html = await ejs.renderFile(`${__dirname}/../views/email/${template}.ejs`, {
			firstName: this.name,
			url: this.url,
			subject
		  });

		const mailOptions = {
			from: this.from,
			to: this.to,
			subject: subject,
			html: html,
			text: htmlToText.htmlToText(html),
		};

		await this.createTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the Natours Family!');
	}

	async sendPasswordReset() {
		await this.send(
		  'passwordReset',
		  'Your password reset token (valid for only 10 minutes)'
		);
	}
}

module.exports = Email;

//await newEmail(user,resetUrl).sendWelcome();