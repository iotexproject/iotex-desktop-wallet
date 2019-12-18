// @ts-ignore
import mongoose from "mongoose";
import tools from "../utils/tools";
import { baseModel } from "./base-model";

const Schema = mongoose.Schema;

type TNewUser = {
  password: string;
  email: string;
  ip: string;
};

export type TUser = mongoose.Document &
  TNewUser & {
    avatar: string;

    isBlocked: boolean;

    createAt: Date;
    updateAt: Date;
  };

export class UserModel {
  public Model: mongoose.Model<TUser>;

  constructor({ mongoose }: { mongoose: mongoose.Mongoose }) {
    const UserSchema = new Schema({
      password: { type: String },
      email: { type: String },
      ip: { type: String },
      avatar: { type: String },

      lifetimeHumanId: { type: "ObjectId", ref: "LifetimeHuman" },

      isBlocked: { type: Boolean, default: false },

      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    UserSchema.virtual("id").get(function onId(): void {
      // @ts-ignore
      return this._id;
    });
    UserSchema.virtual("avatarUrl").get(function onAvatarUrl(): void {
      // @ts-ignore
      let url = this.avatar || tools.makeGravatar(this.email.toLowerCase());

      // tslint:disable-next-line
      if (url.indexOf("http:") === 0) {
        url = url.slice(5);
      }

      // 如果是 github 的头像，则限制大小
      if (url.indexOf("githubusercontent") !== -1) {
        url += "&s=120";
      }

      return url;
    });

    UserSchema.index({ email: 1 }, { unique: true });

    UserSchema.plugin(baseModel);
    UserSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    UserSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("User", UserSchema);
  }

  public async getById(id: string): Promise<TUser | null> {
    return this.Model.findOne({ _id: id });
  }

  public async getByMail(email: string): Promise<TUser | null> {
    return this.Model.findOne({ email });
  }

  public async newAndSave(user: TNewUser): Promise<TUser | null> {
    const hashed = {
      ...user,
      password: await tools.bhash(user.password)
    };
    return new this.Model(hashed).save();
  }

  public async updatePassword(
    userId: string,
    password: string
  ): Promise<TUser | null> {
    return this.Model.update(
      { _id: userId },
      { password: await tools.bhash(password) }
    );
  }

  public async verifyPassword(
    userId: string,
    password: string
  ): Promise<boolean> {
    let resp;
    try {
      resp = await this.Model.findOne({ _id: userId }).select("password");
    } catch (err) {
      return false;
    }
    return Boolean(resp && (await tools.bcompare(password, resp.password)));
  }
}
