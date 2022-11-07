import express, { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";
import { hasJSDocParameterTags, isImportEqualsDeclaration } from "typescript";
// const multer = require("multer");
import {
  ErrorMessage,
  MessageResponse,
  tokenAccess,
} from "../middleware/commenResError";

import signUp from "../models/register";
import tokenModel from "../models/token";

import { fileFilter, storage } from "../router/routers";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Appstring = require("../Appstring");
require("dotenv").config();
var mongoose = require("mongoose");
const OneSignal = require('@onesignal/node-onesignal')
const appId ="ZmM0YTU0YmQtZTY4NS00OTk2LWFhZTYtNGNlYmE2OTY0ZGYz"
const apiKey = "ZmM0YTU0YmQtZTY4NS00OTk2LWFhZTYtNGNlYmE2OTY0ZGYz"
const ONESIGNAL_APP_ID = 'a5abe5c1-b4d7-4fe5-9064-902fc922300a';

const app_key_provider = {
  getToken() {
      return apiKey;
  }
};
const configuration = OneSignal.createConfiguration({
  authMethods: {
      app_key: {
        tokenProvider: app_key_provider
      }
  }
});
const client = new OneSignal.DefaultApi(configuration);



const notif = async (req: Request, res: Response) => {
  const notification = new OneSignal.Notification();
  notification.app_id = ONESIGNAL_APP_ID;
  notification.included_segments = ['Subscribed Users'];
  notification.contents = {
    en: "Hello OneSignal!"
  };
  const {id} = await client.createNotification(notification);
  const response = await client.getNotification(ONESIGNAL_APP_ID, id);
MessageResponse(req,res,response,200)
  };
  
  export {
   notif
    
  };