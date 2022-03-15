// nodejs built-in
const path = require("path");

// third party package
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require("dotenv");


// module by my self
const port = 3000;
const rootDir = require("./utils/path");



const shopRouter = require("./routers/shop");
const apiRouter = require("./routers/api");
const authenRouter = require("./routers/user.authen");
const errRouter = require("./routers/err");


// main app
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

// .env
dotenv.config();

// cors
app.use(cors());

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// routers
app.use(express.static(path.join(rootDir, "assets")));

app.use(shopRouter);

app.use("/api",apiRouter);
app.use("/authen",authenRouter);

app.use("/",errRouter);

// run server
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
