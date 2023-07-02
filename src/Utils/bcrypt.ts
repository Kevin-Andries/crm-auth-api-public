import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 12);
};

export const checkPassword = async (
	hashedPassword: string,
	candidatePassword: string
) => {
	return await bcrypt.compare(candidatePassword, hashedPassword);
};
