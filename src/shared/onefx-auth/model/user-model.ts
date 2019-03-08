
/* eslint-disable no-invalid-this */
import mongoose from 'mongoose';
import tools from '../utils/tools';
import {baseModel} from './base-model';


const Schema = mongoose.Schema;

type TNewUser = {
  password: string,
  email: string,
  ip: string,
} ;

export class UserModel {
  public Model: any;

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
      // @ts-ignore
      return this._id;
    });
    UserSchema.virtual('avatarUrl').get(function onAvatarUrl() {
      // @ts-ignore
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

    UserSchema.plugin(baseModel);
    UserSchema.pre('save', function onSave(next: Function) {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    UserSchema.pre('find', function onFind(next: Function) {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model('User', UserSchema);
  }

  public async getById(id: string) {
    return this.Model.findOne({_id: id});
  }

  public async getByMail(email: string) {
    return this.Model.findOne({email});
  }

  public async newAndSave(user: TNewUser) {
    const hashed = {
      ...user,
      password: await tools.bhash(user.password),
    };
    return new this.Model(hashed).save();
  }

  public async updatePassword(userId: string, password: string) {
    return this.Model.update({_id: userId}, {password: await tools.bhash(password)});
  }

  public async verifyPassword(userId: string, password: string) {
    let resp;
    try {
      resp = await this.Model.findOne({_id: userId}).select('password');
    } catch (err) {
      return false;
    }
    return resp && tools.bcompare(password, resp.password);
  }
}
