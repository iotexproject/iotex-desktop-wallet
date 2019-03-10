import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dateFormat from 'dateformat';

export default {
  validateId: (str: string) => {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
  },
  md5,
  makeGravatar: (str: string) => {
    return `https://www.gravatar.com/avatar/${md5(str)}?size=48`;
  },
  bhash: (str: string) => {
    return bcrypt.hash(str, 10);
  },
  bcompare: (str: string, hash: string) => {
    return bcrypt.compare(str, hash);
  },
  formatDate: (date: Date, friendly: boolean) => {
    if (friendly) {
      // @ts-ignore
      return date.fromNow();
    }
    return dateFormat(date, 'YYYY-MM-DD HH:mm');

  },
};

function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}
