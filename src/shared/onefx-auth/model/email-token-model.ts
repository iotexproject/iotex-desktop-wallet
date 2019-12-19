import mongoose from "mongoose";
import uuidV4 from "uuid/v4";

const Schema = mongoose.Schema;
import { baseModel } from "./base-model";

type Opts = {
  mongoose: mongoose.Mongoose;
  expMins: number;
};

export type EmailToken = {
  token: string;
  userId: string;
  expireAt: string;
};

type EmailTokenModelType = mongoose.Document &
  EmailToken & {
    createAt: Date;
    updateAt: Date;
  };

export class EmailTokenModel {
  public Model: mongoose.Model<EmailTokenModelType>;

  constructor({ mongoose, expMins }: Opts) {
    const EmailTokenSchema = new Schema({
      token: { type: String, default: uuidV4 },
      userId: { type: Schema.Types.ObjectId },
      expireAt: {
        type: Date,
        default: () => new Date(getExpireEpochMins(expMins)),
        index: { expires: `${expMins}m` }
      },

      createAt: { type: Date, default: Date.now },
      updateAt: { type: Date, default: Date.now }
    });

    EmailTokenSchema.index({ token: 1 });

    EmailTokenSchema.plugin(baseModel);
    EmailTokenSchema.pre("save", function onSave(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });
    EmailTokenSchema.pre("find", function onFind(next: Function): void {
      // @ts-ignore
      this.updateAt = new Date();
      next();
    });

    this.Model = mongoose.model("email_tokens", EmailTokenSchema);
  }

  public async newAndSave(userId: string): Promise<EmailToken> {
    return new this.Model({ userId }).save();
  }

  public async findOneAndDelete(token: string): Promise<EmailToken | null> {
    return this.Model.findOneAndDelete({ token });
  }

  public async findOne(token: string): Promise<EmailToken | null> {
    return this.Model.findOne({ token });
  }
}

function getExpireEpochMins(mins: number): number {
  return Date.now() + mins * 60 * 1000;
}
