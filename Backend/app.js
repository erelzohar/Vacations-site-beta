global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const fileUpload = require("express-fileupload");
const cookie = require("cookie-parser"); 
const expressRateLimit = require("express-rate-limit");
const sanitize = require("./middleware/sanitize");
const cors = require("cors");
const vacationController = require("./controllers-layer/vacations-controller");
const authController = require("./controllers-layer/auth-controller");



const server = express();


// DOS Attack protection:
server.use("/api/", expressRateLimit({
    windowMs: 1000, // 1 second
    max: 10, // limit each IP to 5 requests per windowMs
    message: "Are You a Hacker?" 
}));

// Enable cookies: 
server.use(cookie());

server.use(express.json());

// XSS attack protection:
server.use(sanitize);

server.use(cors());
server.use(express.json());
server.use(fileUpload());

server.use("/api/vacations",vacationController);
server.use("/api/auth",authController);


const port = process.env.PORT || 3001;
server.listen(port, () => console.log("Listening..."));