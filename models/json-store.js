'use strict';

/*
The aysnc functions in this file are used whenever an operation may take an undetermined
amount of time to complete, like uploading an image to Cloudinary.
*/

//A Promise in JavaScript represents the completion or failure of an asynchronous operation
//They can be pending, rejected or fulfilled.

import logger from '../utils/logger.js';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class JsonStore {
  constructor(file, defaults) {
    this.db = new Low(new JSONFile(file), defaults);
    this.db.read();
  }

  findAll(collection) {
    return this.db.data[collection];
  }

  findBy(collection, filter) {
    const results = this.db.data[collection].filter(filter);
    return results;
  }

  findOneBy(collection, filter) {
    const results = this.db.data[collection].filter(filter);
    return results[0];
  }

  async addCollection(collection, obj) {
    this.db.data[collection].push(obj);
    await this.db.write();
  }

  async addItem(collection, id, arr, obj) {
    const data = this.db.data[collection].filter((c) => c.id === id);
    data[0][arr].push(obj);
    await this.db.write();
  }

  async removeCollection(collection, obj) {
    const index = this.db.data[collection].indexOf(obj);
    if (index > -1) {
      this.db.data[collection].splice(index, 1);
    }
    await this.db.write();
  }

  async removeItem(collection, id, arr, itemId) {
    const data = this.db.data[collection].filter((c) => c.id === id);
    const item = data[0][arr].filter((i) => i.id === itemId);
    const index = data[0][arr].indexOf(item[0]);
    if (index > -1) {
      data[0][arr].splice(index, 1);
    }
    await this.db.write();
  }

  async editCollection(collection, id, obj) {
    let index = this.db.data[collection].findIndex((c) => c.id === id);
    if (index > -1) {
      this.db.data[collection].splice(index, 1, obj);
    }
    await this.db.write();
  }

  async editItem(collection, id, itemId, arr, obj) {
    const data = this.db.data[collection].filter((c) => c.id === id);
    let index = data[0][arr].findIndex((i) => i.id === itemId);
    data[0][arr].splice(index, 1, obj);
    await this.db.write();
  }

  async addToCloudinary(file) { //This function takes in a file
    const result = await cloudinary.uploader.upload(file.tempFilePath); //Uploads this tempImage file to Cloudinary and returns a result
    logger.info("Cloudinary result:", result);

    try {
      //fs.unlink removes temporary image files after they've been uploaded to Cloudinary
      await fs.unlink(file.tempFilePath); //Images are stored as temporary files before they are uploaded to the server
      logger.info("Temporary file deleted");
    } catch(err) {
        logger.warn("Temp file deletion failed:", err);
    }

    return {
      url: result.url, //Return URL of uploaded image
      public_id: result.public_id, //And its public ID
    };
  }

  async deleteFromCloudinary(publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (result, err) => { //takes in a public id value which is what it uses to find the image it should remove.
        if(err) {
          reject(err);
        } else  {
          resolve(result);
        } 
      });
    });
  }
}

export default JsonStore;
