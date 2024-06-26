require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require("./db/connect");
const patientRouter = require("./routes/patient");
const doctorRouter = require("./routes/doctor");
const authRouter = require("./routes/auth");
const teamRouter = require("./routes/team");
const departmentRouter = require("./routes/department");
const appointmentRouter = require("./routes/appointment");

const { User } = require("./models/User");
const { hashedPassword } = require("./services/utils");
const authenticationMiddleware = require("./middlewares/auth");

app.get("/", (req, res) => {
  res.send("HMS server is up for the use...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/patients", patientRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/teams", teamRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/auth", authRouter);

// app.use("/api/patients", authenticationMiddleware, patientRouter);
// app.use("/api/doctors", authenticationMiddleware, doctorRouter);
// app.use("/api/teams", authenticationMiddleware, teamRouter);
// app.use("/api/departments", authenticationMiddleware, departmentRouter);
// app.use("/api/appointments", authenticationMiddleware, appointmentRouter);
// app.use("/api/auth", authRouter);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    // create a admin user if not exists
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      await User.create({
        email: "admin@admin.com",
        hashedPassword: hashedPassword,
        role: "admin",
      });
    }

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
