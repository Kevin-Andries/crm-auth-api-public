import { Pool as PgPool } from "pg";
// Utils
import IUser from "./Interfaces/UserInterface";

const Pool = new PgPool({ ssl: { rejectUnauthorized: false } });

export enum Queries {
	/* createTable = "create table users (id serial primary key, email varchar(255), password varchar(100))", */
	register = "INSERT INTO users VALUES (DEFAULT, $1, $2, $3) RETURNING *",
	registerWithGithub = "INSERT INTO users(id, password, createdAt, email, picture, username) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",

	updateUser = "UPDATE users SET picture = $1 RETURNING *",

	getUserByEmail = "SELECT * FROM users WHERE users.email = $1",
	getUserById = "SELECT * FROM users WHERE users.id = $1",

	deleteAllUsers = "DELETE FROM users",
	deleteUser = "DELETE FROM users WHERE users.id = $1",

	getAllUsers = "SELECT * FROM users",
	/* aux = "alter table users add email varchar(255) unique not null", */
}

/**
 *
 * @param SqlQuery A SQL request from the Queries enum
 * @param values Variables for the SQL request
 * @returns An array of users object OR a single user object OR undefined if no there is no result
 */
export default async function PgQuery(
	SqlQuery: Queries,
	values?: string[]
): Promise<IUser | IUser[]> {
	/* await Pool.query(Queries.aux); */
	/* return Pool.query(Queries.getAllUsers).then((res) => res.rows); */
	/* await Pool.query(Queries.deleteAllUsers); */

	return Pool.query(SqlQuery, values).then((res) => {
		if (SqlQuery === Queries.deleteUser) {
			return res.rowCount;
		}

		if (res.rowCount === 1 && SqlQuery !== Queries.getAllUsers) {
			return res.rows[0];
		}

		return res.rows;
	});
}
