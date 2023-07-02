import dotenv from "dotenv";
dotenv.config({
	path: `${__dirname}/../config.env`,
});
import app from "./app";

const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
