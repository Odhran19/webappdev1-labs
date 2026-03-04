'use strict';

import express from 'express';
import routes from './routes.js'; 
import logger from "./utils/logger.js";

const app = express();
const port = 3000;

app.use("/", routes);

app.listen(port, () => logger.info(`Express app running on port ${port}!`));
