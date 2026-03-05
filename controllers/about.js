'use struct';

import logger from "../utils/logger.js";
import employees from "../models/employees.js";

const about = {
    createView(request,response) {
        logger.info("About page loading!");
        const appInfo = employees.getAll();
        response.render('about', { appInfo });
    }
};

export default about