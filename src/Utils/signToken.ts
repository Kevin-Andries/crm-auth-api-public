import jwt from "jsonwebtoken";

const jwtSecretKey = process.env.JWT_SECRET_KEY!;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN!;

export default function (id: number) {
	return jwt.sign({ id }, jwtSecretKey, {
		expiresIn: jwtExpiresIn,
	});
}
