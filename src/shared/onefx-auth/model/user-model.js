// @flow
/* eslint-disable no-invalid-this */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tools = require('../utils/tools.js');
const BaseModel = require('./base-model.js');

type TNewUser = {
  password: string,
  email: string,
  ip: string,
} ;

export class UserModel {
  Model: any;

  constructor({mongoose}: any) {
    const UserSchema = new Schema({
      password: {type: String},
      email: {type: String},
      ip: {type: String},
      avatar: {type: String},

      lifetimeHumanId: {type: 'ObjectId', ref: 'LifetimeHuman'},

      isBlocked: {type: Boolean, default: false},

      createAt: {type: Date, default: Date.now},
      updateAt: {type: Date, default: Date.now},
    });

    UserSchema.virtual('id').get(function onId() {
      return this._id;
    });
    UserSchema.virtual('avatarUrl').get(function onAvatarUrl() {
      let url = this.avatar || tools.makeGravatar(this.email.toLowerCase());

      // www.gravatar.com 被墙
      // 现在不是了
      // url = url.replace('www.gravatar.com', 'gravatar.com');

      // 让协议自适应 protocol，使用 `//` 开头
      if (url.indexOf('http:') === 0) {
        url = url.slice(5);
      }

      // 如果是 github 的头像，则限制大小
      if (url.indexOf('githubusercontent') !== -1) {
        url += '&s=120';
      }

      return url;
    });

    UserSchema.index({email: 1}, {unique: true});

    UserSchema.plugin(BaseModel);
    UserSchema.pre('save', function onSave(next) {
      this.updateAt = new Date();
      next();
    });
    UserSchema.pre('find', function onFind(next) {
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model('User', UserSchema);
  }

  async getById(id: string) {
    return await this.Model.findOne({_id: id});
  }

  async getByMail(email: string) {
    return await this.Model.findOne({email});
  }

  async newAndSave(user: TNewUser) {
    const hashed = {
      ...user,
      password: await tools.bhash(user.password),
    };
    return await new this.Model(hashed).save();
  }

  async updatePassword(userId: string, password: string) {
    return await this.Model.update({_id: userId}, {password: await tools.bhash(password)});
  }

  async verifyPassword(userId: string, password: string) {
    let resp;
    try {
      resp = await this.Model.findOne({_id: userId}).select('password');
    } catch (err) {
      return false;
    }
    return resp && await tools.bcompare(password, resp.password);
  }
}
