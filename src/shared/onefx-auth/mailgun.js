// @flow
import mailer from 'nodemailer';
import mg from 'nodemailer-mailgun-transport';
import {logger} from 'onefx/lib/integrated-gateways/logger';

type MailgunOpts = {
  retryLimit: number,

  apiKey: string,
  domain: string,
  proxy: ?string,
};

type Mail = {
  from: string,
  to: string | Array<string>, // An array if you have multiple recipients.
  subject: string,
  'h:Reply-To'?: string,
  html: string,
};

export class Mailgun {
  opts: MailgunOpts;
  transporter: any;

  constructor(opts: MailgunOpts) {
    this.opts = opts;
    this.transporter = mailer.createTransport(mg({
      auth: {
        api_key: opts.apiKey,
        domain: opts.domain,
      },
      proxy: opts.proxy,
    }));
  }

  sendMail(data: Mail) {
    const self = this;
    Promise.resolve(self.opts.retryLimit).then(function retry(times, resolve) {
      if (times === 0 || !times) {
        // $FlowFixMe
        return resolve(times);
      }

      return new Promise((resolve, reject) => {
        self.transporter.sendMail(data, err => {
          if (err) {
            logger.error('send mail error', err, data);
            return retry(--times, resolve);
          }
          return retry(undefined, resolve);
        });
      }).then(times => {
        if (resolve) {
          resolve(times);
        }
        return times;
      });
    }).then(times => {
      if (times === 0) {
        return logger.error('send mail finally error', data);
      }

      logger.info('send mail success', {...data, html: 'redacted'});
    });
  }
}
