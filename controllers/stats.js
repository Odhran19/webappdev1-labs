"use strict";

import logger from "../utils/logger.js";
import playlistStore from "../models/playlist-store.js";
import accounts from './accounts.js';

const stats = { 
    createView(request, response) {
        const loggedInUser = accounts.getCurrentUser(request);

        if(loggedInUser) {
            logger.info("Stats page loading!");
        
        //app statistics calculations with a space in between
        const playlists = playlistStore.getAllPlaylists();

        let numPlaylists = playlists.length;

        let numSongs = playlists.reduce((total, playlist) => total + playlist.songs.length, 0);

        let average = numPlaylists > 0 ? (numSongs / numPlaylists).toFixed(2) : 0;

        let totalRating = playlists.reduce((total, playlist) => total + parseInt(playlist.rating), 0);

        let averageRating = numPlaylists > 0 ? totalRating/numPlaylists : 0;

        let mapped = playlists.map(playlist => playlist.rating);

        let maxRating = Math.max(...mapped);

        let maxRated = playlists.filter(playlist => playlist.rating === maxRating);

        let favTitles = maxRated.map(item => item.title);

        //excerices
        let highestNumOfSongs = Math.max(...playlists.map(playlist => playlist.songs.length));
        let playlistWithMostSongs = playlists.filter(playlist => playlist.songs.length === highestNumOfSongs).map(item => item.title)[0];
        let totalUsers = accounts.getAllUsers().length;
        //end excerices

        let numOfEmpty = 0;
        const emptyPlaylists = playlistStore.getAllPlaylists();
        for (let playlist of emptyPlaylists) {
            if (playlist.songs.length === 0) {
                numOfEmpty++;
            }
        }

        //the variables on the left are the names that get passed into the stats.handlebars file, and the variables on the right are the ones that are being calculated in this file. They can be the same name or different names, it doesn't matter as long as they are consistent within this file and the stats.handlebars file.
        const statistics = { 
            displayNumPlaylists: numPlaylists,
            displayNumSongs: numSongs,
            displayAverage: average,
            displayAvgRating: averageRating.toFixed(2),
            highest: maxRating,
            displayFave: favTitles,
            displayHighestNumOfSongs: highestNumOfSongs,
            displayLargest: playlistWithMostSongs,
            anEmptyPlaylistExists: numOfEmpty,
            displayTotalUsers: totalUsers,
        }

        const viewData = { 
            title: "Playlist App Statistics",
            stats: statistics,
            fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
            profilepicture: loggedInUser.picture
        };
            response.render('stats', viewData);

        } else response.redirect('/');
    },
};

export default stats;