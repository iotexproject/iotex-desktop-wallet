/* eslint-disable no-invalid-this */
// @flow
import mongoose from 'mongoose';
import uuidV4 from 'uuid/v4';

const Schema = mongoose.Schema;
const BaseModel = require('./base-model.js');

type Opts = {
  mongoose: any,
  expMins: number,
};

export type EmailToken = {
  token: string,
  userId: string,
  expireAt: string,
};

export class EmailTokenModel {
  Model: any;

  constructor({mongoose, expMins}: Opts) {

    const EmailTokenSchema = new Schema({
      token: {type: String, default: () => uuidV4()},
      userId: {type: Schema.Types.ObjectId},
      expireAt: {type: Date, default: () => new Date(getExpireEpochMins(expMins)), index: {expires: `${expMins}m`}},

      createAt: {type: Date, default: Date.now},
      updateAt: {type: Date, default: Date.now},
    });

    EmailTokenSchema.index({token: 1});

    EmailTokenSchema.plugin(BaseModel);
    EmailTokenSchema.pre('save', function onSave(next) {
      this.updateAt = new Date();
      next();
    });
    EmailTokenSchema.pre('find', function onFind(next) {
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model('email_tokens', EmailTokenSchema);
  }

  async newAndSave(userId: string): Promise<EmailToken> {
    return await new this.Model({userId}).save();
  }

  async findOneAndDelete(token: string): Promise<EmailToken> {
    return await this.Model.findOneAndDelete({token});
  }

  async findOne(token: string): Promise<EmailToken> {
    return await this.Model.findOne({token});
  }
}

function getExpireEpochMins(mins: number) {
  return Date.now() + mins * 60 * 1000;
}
