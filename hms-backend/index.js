require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require("./db/connect");
const patientRouter = require("./routes/patient");

app.get("/", (req, res) => {
  res.send("HMS server is up for the use...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/patients", patientRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
