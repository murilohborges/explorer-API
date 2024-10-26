const express = require('express');
const bodyParser = require('body-parser');

require("express-async-errors");
require("dotenv/config");

const AppError = require("./utils/AppError");
const cors = require("cors");
const uploadConfig = require('./configs/upload');
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(cors({
  origin: 'https://foodexplorer-murilohborges.netlify.app',
  credentials: true,
}));

const routes = require("./routes");
app.use(routes);

app.use(( error, request, response, next) => {

  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });

})

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))