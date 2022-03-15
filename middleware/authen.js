const User = require('../models/user');

const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;

const verify = promisify(jwt.verify).bind(jwt);



const verifyToken = async (token, secretKey) => {
	try {
		return await verify(token, secretKey);
	} catch (error) {
		console.log(`Error in verify access token:  + ${error}`);
		return false;
	}
};


exports.isAuthForApi = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromHeader = req.headers.x_authorization;
	if (!accessTokenFromHeader) {
		return res.json({
			type: false,
			msg: "Không tìm thấy access token"
		});
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res.json({
			type: false,
			msg: "access token không đúng"
		});
	}

	const user = await User.getUser(verified.payload.email);
	if (!user[0].verify) {
		return res.json({ type: false, msg: "Tài khoản chưa xác thực email" });
	}
	return res.json({
		type: true,
		msg: 'Tài khoản hợp lệ'
	})
};
exports.isAuthForLocal = async (req, res, next) => {
	// Lấy access token từ header
	const accessTokenFromCookie = req.cookies.accessToken;
	console.log(req.cookies.accessToken);
	if (!accessTokenFromCookie) {
		res.cookie("prevPage", req.originalUrl, { expires: new Date(Date.now() + 900000) });
		return res.redirect("/authen/login");
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await verifyToken(
		accessTokenFromCookie,
		accessTokenSecret,
	);
	console.log(verified);
	if (!verified) {
		return res.redirect("/authen/login");
	}

	const user = await User.getUser(verified.payload.email);
	if (!user[0].verify) {
		return res
			.json({ msg: "Tài khoản chưa xác thực email" });
	}
	req.user = user[0];

	return next();
};



