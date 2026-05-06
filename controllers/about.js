'use struct';

import logger from "../utils/logger.js";
import employees from "../models/employees.js";
import accounts from './accounts.js';

const about = {
    createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info("About page loading!");
    
    if (loggedInUser) {
      const viewData = {
        title: 'About the Playlist App',
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
        employees: employees.getEmployees(),
      };
      response.render('about', viewData);
    }
    else response.redirect('/');    
    },
 }

export default about