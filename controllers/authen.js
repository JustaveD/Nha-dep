const User = require("../models/user");

const bcrypt = require("bcrypt");
const randToken = require("rand-token");
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const otpGenerator = require('otp-generator')

const sendMail = require("../utils/sendMail");


const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const generateToken = async (payload, secretSignature, tokenLife) => {
	try {
		return await sign(
			{
				payload,
			},
			secretSignature,
			{
				algorithm: 'HS256',
				expiresIn: tokenLife,
			},
		);
	} catch (error) {
		console.log(`Error in generate access token:  + ${error}`);
		return null;
	}
}

const decodeToken = async (token, secretKey) => {
	try {
		return await verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		return null;
	}
}


module.exports.getLoginPage = (req, res) => {
	res.render("login.ejs");
}
module.exports.getForgotPage = (req, res) => {
	res.render("forgot.ejs");
}

module.exports.registeringNewAccount = async (req, res) => {
	const email = req.body.email.toLowerCase();
	const password = req.body.password;
	const user = await User.getUser(email);


	if (user[0]) res.status(409).json({ msg: 'Tên tài khoản đã tồn tại.' });
	else {
		const saltRounds = 10;
		const hashPassword = bcrypt.hashSync(password, saltRounds);
		const newUser = {
			email: email,
			password: hashPassword,
		};
		const createUser = await User.createUser(newUser);
		if (!createUser) {
			return res.json({ msg: 'Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại.' });
		}

		let mailSubject = "Xác thực tài khoản email";
		let htmlcontent = `<a  href="http://localhost:3000/authen/verify/${email}?token=${hashPassword}" style="border:1px solid aqua;background-color:#fff;color:aqua;padding:10px 20px;width:200px;text-align:center;">Nhấn vào đấy để xác nhận tài khoản</a>`;
		let send = await sendMail.sendMail(email, mailSubject, htmlcontent);
		if (!send) {
			return res.json({
				msg: "đã xảy ra lỗi trong quá trình gửi mail"
			})
		}
		return res.json({
			msg: 'Mail xác nhận đã được gửi, vui lòng kiểm tra hộp thư!',
			type: true,
			data: newUser
		});
	}
}


// send otp
module.exports.sendOTP = async (req, res) => {
	const email = req.body.email.toLowerCase();

	const user = await User.getUser(email);

	if (!user[0]) return res.status(409).json({ msg: 'Không tìm thấy email trong hệ thống' });

	let otp = otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
	let save = await User.saveOTP(email,otp);

	if(!save){
		return res.json({
			msg:"Đã xảy ra lỗi trong quá trình lưu OTP"
		})
	}

	let mailSubject = "Quên mật khẩu";
	let htmlcontent = `<h1>Mã OTP của bạn là: ${otp}</h1>`;
	let send = await sendMail.sendMail(email, mailSubject, htmlcontent);
	if (!send) {
		return res.json({
			msg: "đã xảy ra lỗi trong quá trình gửi mail"
		})
	}
	return res.json({
		msg: 'Đã gửi mã OTP, vui lòng kiểm tra hộp thư!',
		type: true,
		data: {
			email
		}
	});

}
// resetpassword
module.exports.resetpassword = async (req, res) => {
	const email = req.body.email.toLowerCase();
	const otp = req.body.otp;
	const password = req.body.password;

	const user = await User.getUser(email);

	if (!user[0]) return res.status(409).json({ msg: 'Có lỗi trong quá trình tìm kiếm tài khoản của bạn' });

	if(otp != user[0].otp){
		return res.json({
			msg: 'Mã OTP không chính xác'
		})
	}

	const hashPassword = bcrypt.hashSync(password, 10);

	let resetpassword = await User.resetpassword(email,hashPassword);

	if(!resetpassword){
		return res.json({
			msg:"Đã xảy ra lỗi trong quá trình đổi mật khẩu"
		})
	}
	return res.json({
		msg: 'Mật khẩu đã thay đổi thành công',
		type: true
	});

}
module.exports.login = async (req, res) => {
	const email = req.body.email || 'test';
	const password = req.body.password.toString() || '12345';


	const user = await User.getUser(email);
	if (!user[0]) {
		return res.json({
			msg: 'Email không tồn tại.'
		});
	}
	const isPasswordValid = bcrypt.compareSync(password, user[0].password);

	if (!isPasswordValid) {
		return res.json({
			msg: 'Mật khẩu không chính xác.'
		});
	}
	if (user[0].verify == 0) {
		return res.json({
			msg: "Tài khoản của bạn chưa được xác thực"
		})
	}

	const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const dataForAccessToken = {
		email: user[0].email,
	};

	const accessToken = await generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);

	if (!accessToken) {
		return res.json({
			msg: 'Đăng nhập không thành công, vui lòng thử lại.'
		});
	}

	let refreshToken = randToken.generate(16);
	if (!user[0].refreshToken) {
		await User.updateRefreshToken(user[0].email, refreshToken);
	} else {
		refreshToken = user[0].refreshToken;
	}
	const dataUserFinal = await User.getUser(email);

	res.cookie("accessToken", accessToken, { expires: new Date(Date.now() + 90000) });
	res.cookie("refrshToken", refreshToken, { expires: new Date(Date.now() + 90000) });

	return res.json({
		msg: 'Đăng nhập thành công.',
		type: true,
		accessToken,
		refreshToken,
		user: dataUserFinal[0],

	});

}
module.exports.refreshAccessToken = async (req, res) => {
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader || accessTokenFromHeader == '') {
		return res.status(400).send('Không tìm thấy access token.');
	}
	const refreshTokenFromBody = req.body.refreshToken;

	if (!refreshTokenFromBody || refreshTokenFromBody == '') {
		return res.status(400).send('Không tìm thấy refresh token.');
	}
	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
	const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

	const decoded = await decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);

	if (!decoded) {
		return res.json({
			accessToken: '',
		});
	}
	const email = decoded.payload.email;
	const user = await User.getUser(email);
	if (!user[0]) {
		return res.status(401).send('User không tồn tại.');
	}

	if (refreshTokenFromBody !== user[0].refreshToken) {
		return res.status(400).send('Refresh token không hợp lệ.');
	}

	const dataForAccessToken = {
		email,
	};

	const accessToken = await generateToken(
		dataForAccessToken,
		accessTokenSecret,
		accessTokenLife,
	);
	if (!accessToken) {
		return res
			.status(400)
			.send('Tạo access token không thành công, vui lòng thử lại.');
	}
	return res.json({
		accessToken,
	});
}
module.exports.verifyEmail = async (req, res) => {
	let email = req.params.email;
	let password = req.query['token'];


	let user = await User.getUser(email);

	if (!user[0]) {
		res.send("Không tìm thấy email của bạn trong hệ thống!");
		return;
	}
	// let isVerifyPassword = bcrypt.compare(password,user[0].password,(err,data)=>{
	// 	if(err) res.send("Có lỗi trong quá trình xác thực");
	// 	return data;
	// })

	if (password !== user[0].password) {
		res.send("token của bạn không hợp lệ");
		return;
	}
	let verify = await User.verifyEmail(email);
	if (!verify) {
		res.send("Xảy ra lỗi trong quá trình xác thực ở database");
		return;
	}
	res.send("Tài khoản của bạn đã được xác thực, mời trở lại trang đăng nhập");
}
