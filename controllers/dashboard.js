'use strict';

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import { v4 as uuidv4 } from 'uuid';

const dashboard = {
  createView(request, response) {
    logger.info("Dashboard page loading!");
    
    const viewData = {
      title: "Playlist App Dashboard",
      playlists: playlistStore.getAllPlaylists()
    };
    
    logger.debug(viewData.playlists);
    
    response.render('dashboard', viewData);
  },

  addPlaylist(request, response) {
    const timestamp = new Date(); //gets the current date and time, and is a built-in javascript function

    const newPlaylist = {
      id: uuidv4(),
      title: request.body.title,
      date: timestamp,
      rating: parseInt(request.body.rating),
      songs: []
    };
    playlistStore.addPlaylist(newPlaylist);
    response.redirect('/dashboard');
  },

  deletePlaylist(request, response) {
    const playlistId = request.params.id;
    logger.debug(`Deleting Playlist ${playlistId}`);
    playlistStore.removePlaylist(playlistId);
    response.redirect("/dashboard");
  },
  
  ratePlaylist(request, response) {
    const playlistId = request.params.id;
    const rating = parseInt(request.body.rating);
    playlistStore.ratePlaylist(playlistId, rating);
    response.redirect("/dashboard");
  }

  
};


export default dashboard;
