import express, { NextFunction, Request, Response } from "express";
// import mongoose from "mongoose";
import { isImportEqualsDeclaration } from "typescript";
const multer = require("multer");
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

const register = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = await signUp.create({
      firstName: req.body.firstName,
      email: req.body?.email,
      password: hashPassword,
      PhoneNo: req.body?.PhoneNo,
    });
    await user.save();
    MessageResponse(req, res, user, 201);
  } catch (error) {
    ErrorMessage(req, res, error, 400);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await signUp.findOne({
      email: req.body?.email,
      PhoneNo: req.body?.PhoneNo,
    });

    const userLogin = await tokenModel.findOne({ userId: user?._id });

    if (user) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        if (userLogin) {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          await tokenModel.updateOne(
            { userId: user._id },
            { token: token },
            {
              new: true,
            }
          );
          tokenAccess(req, res, token, 200);
        } else {
          let params = {
            _id: user._id,
            firstName: req.body.firstName,
            email: req.body?.email,
            PhoneNo: req.body?.PhoneNo,
          };

          const token = await jwt.sign(params, process.env.SECRET_KEY, {
            expiresIn: "10d",
          });
          const createToken = await tokenModel.create({
            userId: user._id,
            token: token,
          });
          await createToken.save();

          tokenAccess(req, res, createToken, 200);
        }
      } else {
        ErrorMessage(req, res, Appstring.NOT_VALID_DETAILS, 400);
      }
    } else {
      ErrorMessage(req, res, Appstring.USER_NOT_FOUND, 404);
    }
  } catch (error) {
    console.log(error);

    ErrorMessage(req, res, error, 400);
  }
};


const imgUpload = async (req: Request, res: Response, next: NextFunction) => {
  var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    // limits: { fileSize: maxSize },
  }).array("img");

  upload(req, res, async (err: any) => {
    if (err) {
      console.log(err, "errorr");
      ErrorMessage(req, res, err, 400);
    } else {
      console.log(req.files);
      var e: any = {};
      let a: any = req.files;
      a?.map((d: any, index: any) => {
        console.log(d, "d");
        e[index] = d.filename;
      });
      MessageResponse(req, res, e, 200);
    }
  });
};



export {
  register,  
  login,
  imgUpload,
  
};
// _id
// 6347f3b1e4798f16fb5b594f
// userId
// 6347d7135717c48c6c38acad
// postId
// 6347f381e4798f16fb5b594c
