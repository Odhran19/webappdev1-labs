'use struct';

import logger from "../utils/logger.js";

const about = {
    createView(request,response) {
        logger.info("About page loading!");
        response.send('This is a simple playlist app built with Node.js and Express.');
    }
};

export default about