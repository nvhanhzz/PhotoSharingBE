const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const AuthRouter = require("./routes/AuthRouter");
// const CommentRouter = require("./routes/CommentRouter");

dbConnect();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/api/auth", AuthRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
