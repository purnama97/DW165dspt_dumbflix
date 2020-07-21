require("dotenv").config();

const express = require("express");
const router = require("./router");
const cors = require("cors");
const app = express();
const port = 5000

app.use(cors());
app.use(express.json());
app.use("/api/v1", router)


app.listen(port, () => 
    console.log("Server Runing !:"+port)
);