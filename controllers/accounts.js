'use strict';

import logger from '../utils/logger.js';
import userStore from '../models/user-store.js';
import { v4 as uuidv4 } from 'uuid';

//create an accounts object
//all the following are methods that can be performed on an account object and used in other classes by importing the accounts module.
const accounts = {

  //index function to render index page
  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);
  },
  
  //login function to render login page
  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },
  
  //logout function to render logout page
  logout(request, response) {
    response.cookie('playlist', ''); //this line clears the cookie by setting it to an empty string
    logger.info('logging out');
    response.redirect('/');
  },
  
 //signup function to render signup page
  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },
  
 //register function to render the registration page for adding a new user
  register(request, response) {
    const user = request.body;
    user.id = uuidv4();
    userStore.addUser(user, request.files.file, (error) => {
      if (error) {
        logger.error('Error registering user:', error);
        response.redirect('/signup');
      } else {
        response.cookie('playlist', user.email);
        logger.info('registering and logging in ' + user.email);
        response.redirect('/start');
      }
    });
  },
  
  //authenticate function to check user credentials and either render the login page again or the start page.
  authenticate(request, response) {
    const user = userStore.getUserByEmail(request.body.email);
    const password = request.body.password;
    if (user && user.password === password) {
      response.cookie('playlist', user.email);
      logger.info('logging in ' + user.email);
      response.redirect('/start');
    } else {
      logger.info('login failed for ' + request.body.email);
      response.redirect('/login');
    }
  },
  
  //utility function getCurrentUser to check who is currently logged in
  getCurrentUser (request) {
    const userEmail = request.cookies.playlist;
    return userStore.getUserByEmail(userEmail);
  },

  getAllUsers() {
    return userStore.getAllUsers();
  }
}

export default accounts;
