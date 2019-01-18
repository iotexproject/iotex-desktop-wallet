/* eslint-disable no-invalid-this */
// @flow
import {promisify} from 'util';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const BaseModel = require('./base-model.js');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

type Opts = {
  secret: string,
  mongoose: any,
  expDays: number,
};

type UserId = string;

export class JwtModel {
  secret: string;
  Model: any;

  constructor({secret, mongoose, expDays}: Opts) {
    this.secret = secret;

    const JwtSchema = new Schema({
      userId: {type: Schema.Types.ObjectId},
      expireAt: {type: Date, default: () => new Date(getExpireEpochDays(expDays)), index: {expires: `${expDays}d`}},

      createAt: {type: Date, default: Date.now},
      updateAt: {type: Date, default: Date.now},
    });

    JwtSchema.index({userId: 1});

    JwtSchema.plugin(BaseModel);
    JwtSchema.pre('save', function onSave(next) {
      this.updateAt = new Date();
      next();
    });
    JwtSchema.pre('find', function onFind(next) {
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model('Jwt', JwtSchema);
  }

  async create(userId: string): Promise<string> {
    const resp = await new this.Model({userId}).save();
    return await sign({
      jti: resp.id,
      sub: userId,
      exp: Math.floor(new Date(resp.expireAt).getTime() / 1000),
      iat: Math.floor(new Date(resp.createAt).getTime() / 1000),
    }, this.secret);
  }

  async revoke(token: string): Promise<void> {
    let decoded;
    try {
      decoded = await verify(token, this.secret);
    } catch (e) {
      return undefined;
    }
    await this.Model.deleteOne({_id: decoded.jti});
  }

  async verify(token: string): Promise<?UserId> {
    let decoded;
    try {
      decoded = await verify(token, this.secret);
    } catch (e) {
      return null;
    }

    const found = await this.Model.findOne({_id: decoded.jti, userId: decoded.sub});
    if (!found) {
      return null;
    }

    return found.userId;
  }
}

function getExpireEpochDays(days: number) {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}
