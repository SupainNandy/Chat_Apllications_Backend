import env from "dotenv"
import { connectDB } from "./src/config/db.js"
import { server } from "./socket/socket.js"
import "./src/app.js"

env.config()
if (process.env.RENDER) process.env.NODE_ENV = 'production';

const port = process.env.PORT || 4000

server.listen(port,()=>{
    connectDB()
    console.log("Express server start at http://localhost:$port")
})
