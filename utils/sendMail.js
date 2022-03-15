const nodeMailer = require("nodemailer");

const adminMail = "duydh050202@gmail.com";
const adminPass = "050202@Hd";

const mailHost = 'smtp.gmail.com';

const mailPort = 587;

const sendMail = (to, subject, htmlContent) => {

	const transporter = nodeMailer.createTransport({
		host: mailHost,
		port: mailPort,
		secure: false, 
		auth: {
			user: adminMail,
			pass: adminPass
		}
	})
	const options = {
		from: adminMail, 
		to: to, 
		subject: subject, 
		html: htmlContent 
	}
	// hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
	return transporter.sendMail(options)
}

module.exports.sendMail = sendMail;