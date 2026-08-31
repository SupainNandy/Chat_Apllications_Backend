import app from "./src/app.js"

import env from "dotenv"
import { connectDB } from "./src/config/db.js"

env.config()

const port =process.env.port || 4000



app.listen(port,()=>{
    connectDB()
    console.log(`Express server start at http://localhost:${port}`)
})