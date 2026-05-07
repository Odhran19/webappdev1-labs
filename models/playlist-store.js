'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';

const playlistStore = {

  store: new JsonStore('./models/playlist-store.json', { playlistCollection: [] }),
  collection: 'playlistCollection',
  array: 'songs',

  getAllPlaylists() {
    return this.store.findAll(this.collection);
  },

  getPlaylist(id) {
    return this.store.findOneBy(this.collection, (playlist => playlist.id === id));
  },

  addSong(id, song) {
    this.store.addItem(this.collection, id, this.array, song);
  },

    async addPlaylist(playlist, file, response) {
    try {
      playlist.picture = await this.store.addToCloudinary(file);
      this.store.addCollection(this.collection, playlist);
      response();
    } catch (error) {
      logger.error("Error processing playlist:", error);
      response(error);
    }
  },


  removeSong(id, songId) {
    this.store.removeItem(this.collection, id, this.array, songId);
  },

  async removePlaylist(id, response) {
    const playlist = this.getPlaylist(id);

    if(playlist.picture && playlist.picture.public_id) { //checks if the playlist has a picture property and a public_id
      try {
        await this.store.deleteFromCloudinary(playlist.picture.public_id); //if it does it calls deleteFromCloudinary and passes in that stored image as a parameter and removes the playlist from the collection as it did before
        logger.info("Cloudinary image deleted");
      } catch(err) {
        logger.error("Failed to delete Cloudinary image:", err);
      }
    }

    this.store.removeCollection(this.collection, playlist); 
    response(); //redirects to dashboard
  },

  ratePlaylist(id, rating) {
    const playlist = this.getPlaylist(id);
    playlist.rating = rating;
    this.store.save();
  },

  editSong(id, songId, updatedSong) {
    this.store.editItem(this.collection, id, songId, this.array, updatedSong);
  },

  searchPlaylist(searchTerm) {
    return this.store.findBy(
      this.collection,
      (playlist => playlist.title.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  },

  getUserPlaylists(userId) {
    return this.store.findBy(this.collection, (playlist => playlist.userId === userId));
  },

  searchUserPlaylists(search, userId) {
    return this.store.findBy(
      this.collection,
      (playlist => playlist.userId === userId && playlist.title.toLowerCase().includes(search.toLowerCase())))
  },
};

export default playlistStore;
