//const https = require('https')
const express = require("express");
const app = express();
const connectDataBase = require("../DataBase/db");
const PORT = 8000;
const cors = require("cors");
const routes2 = require("../Routes/userRoutes");
const adminRoutes = require("../Routes/adminRoutes");
const ServiceRoutes = require("../Routes/servicesRoutes");
const path = require('path');
//var fs = require('fs');


app.use(express.json());
app.use("/api", routes2);
app.use("/api", adminRoutes);
app.use("/api", ServiceRoutes);

app.use(
  "/api/ServiceImage",
  express.static("../ServiceImage")
);

app.use(express.json({ limit: '50mb' }));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cors({
  origin: '*'
}));

app.use(express.query());
connectDataBase();

app.listen(PORT, () => {
  console.log(`Server is running PORT:${PORT}`);
});
// const options = {
//   cert: fs.readFileSync('../localhost.crt'),
//     key: fs.readFileSync('../localhost.key')
// };

// https.createServer(options, app)
// .listen(8000, function (req, res) {
//   console.log("Server started at port 8000");
// });


