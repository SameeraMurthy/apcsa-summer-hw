import { createServer } from 'http'
import express from 'express'
import { Server } from 'socket.io'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const server = createServer(app)
const io = new Server(server)
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client/join.html"));
})
app.get("/:room", (req, res) => {
	res.sendFile(path.join(__dirname, "client/index.html"));
})

io.on("connection", (socket) => {

	socket.on("join", data => {
		socket.join(data.room)
		socket.broadcast.to(data.room).emit("announcement", {user: data.user, action: `entered`})
	})

	socket.on("message", data => {
		socket.broadcast.to(data.room).emit("message", { message:data.message, user: data.user})
	})

	socket.on("disconnects", data => {
		socket.broadcast.to(data.room).emit("announcement", {user: data.user, action: `left`})
	})

})

const listener = server.listen(8080, () => console.log(`✅🆗PORT ${listener.address().port}`))