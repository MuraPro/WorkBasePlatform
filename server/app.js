const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const initDatabase = require("./startUp/initDatabase");
const routes = require("./routes");
const errorMiddleware = require("./middleware/errorMiddleware");
require("dotenv").config();

// admin
// test1234

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https://api.dicebear.com"],
        connectSrc: ["'self'", "https://api.dicebear.com"],
      },
    },
  })
);
app.use(cors());

app.use("/api", routes);
app.use("/comment", routes);
app.use("/quality", routes);
app.use("/profession", routes);
app.use("/user", routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "client");

  app.use(express.static(clientPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

async function start() {
  try {
    mongoose.connection.once("open", () => {
      initDatabase();
    });

    await mongoose.connect(
      config
        .get("mongoUri")
        .replace("${MONGO_USER}", process.env.MONGO_USER)
        .replace("${MONGO_PASSWORD}", process.env.MONGO_PASSWORD)
    );
    console.log(chalk.green("MongoDB connected."));
    app.listen(PORT, () => {
      console.log(chalk.green("Server is running on port 8080"));
    });
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

start();
