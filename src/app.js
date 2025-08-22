const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require("cookie-parser");
//const User = require('./models/user');
const cors = require("cors");
const http = require("http");
require('dotenv').config();


app.use(cors({
    origin: "https://devtinderfront.vercel.app",
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
const paymentRouter = require('./routes/payment');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/",paymentRouter);


const server = http.createServer(app);
initializeSocket(server);

connectDB().then(()=>{
    console.log("Database connection established..");
}).catch((err)=>{
    console.error("Database cannot be connected...")
});

server.listen(process.env.PORT,()=>{
    console.log("server is successfully listening...")
});

