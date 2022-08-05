var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const MongoStore = require('connect-mongo');
const passport = require("passport");
const cors=require('cors')
var indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const userDataRouter = require("./routes/userData");
const searchProjectsRouter = require("./routes/searchProjects");
var app = express();

app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../frontend/build")));

const session = require("express-session");

app.use(
  session({
    secret: process.env.SECRET_STRING,
    resave: false,
    saveUninitialized: true,
    // this next property is saving the session data in our DB
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING,
      dbName: "TaskManager",
      collection: "sessions",
    }),
    cookie: {
      maxAge: 7 * 1000 * 60 * 60 * 25, // cookies/sessions will last a week before requiring a re-login
    },
    cookie:{secure:false}
  })
);



app.use(passport.initialize());
app.use(passport.session());
require("./auth/passportConfig");

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/projects", projectsRouter);
app.use("/userData", userDataRouter);
app.use("/searchProjects", searchProjectsRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "../frontend/build/index.html"));
});

const PORT = process.env.PORT || 8080;

const server=app.listen(process.env.PORT||PORT,function(){
  console.log('server is running on port',process.env.PORT||PORT)

})

module.exports = app;

