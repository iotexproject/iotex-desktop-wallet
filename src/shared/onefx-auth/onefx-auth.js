/* eslint-disable no-invalid-this */
// @flow
import {logger} from 'onefx/lib/integrated-gateways/logger';
import {UserModel} from './model/user-model';
import {JwtModel} from './model/jwt-model';
import {allowedLoginNext, allowedLogoutNext, authConfig} from './auth-config';
import {getExpireEpochDays} from './utils/expire-epoch';
import {EmailTokenModel} from './model/email-token-model';
import {Mailgun} from './mailgun';

export class OnefxAuth {
  config: any;
  server: any;
  user: UserModel;
  jwt: JwtModel;
  emailToken: EmailTokenModel;
  mailgun: Mailgun;

  constructor(server: any, config: any) {
    this.config = config || authConfig;
    this.server = server;
    this.user = new UserModel({mongoose: server.gateways.mongoose});
    this.jwt = new JwtModel({
      mongoose: server.gateways.mongoose,
      secret: this.config.secret,
      expDays: this.config.ttl,
    });
    this.emailToken = new EmailTokenModel({mongoose: server.gateways.mongoose, expMins: config.emailTokenTtl});
    this.mailgun = new Mailgun(config.mailgun);
    this.config.cookieOpts = {
      ...this.config.cookieOpts,
      expires: new Date(getExpireEpochDays(this.config.ttl)),
    };
  }

  async sendResetPasswordLink(userId: string, email: string, t: any) {
    const {token} = await this.emailToken.newAndSave(userId);
    const link = `${this.config.emailTokenLink}${token}`;
    logger.debug(`sending out password reset email ${link}`);

    const emailContent = t('auth/forgot_password.email_content', {link});
    await this.mailgun.sendMail({
      from: `"${t('meta.title')}" <noreply@${this.config.mailgun.domain}>`,
      to: email,
      subject: t('auth/forgot_password.email_title'),
      html: emailContent,
    });
  }

  authRequired = async(ctx: any, next: any) => {
    await this.authOptionalContinue(ctx, () => null);
    const userId = ctx.state.userId;
    if (!userId) {
      logger.debug('user is not authenticated but auth is required');
      return ctx.redirect(`${this.config.loginUrl}?next=${encodeURIComponent(ctx.url)}`);
    }

    logger.debug(`user is authenticated ${userId}`);
    await next();
  };

  authOptionalContinue = async(ctx: any, next: any) => {
    const token = this.tokenFromCtx(ctx);
    ctx.state.userId = await this.jwt.verify(token);
    ctx.state.jwt = token;
    await next();
  };

  logout = async(ctx: any, next: any) => {
    ctx.cookies.set(this.config.cookieName, null, this.config.cookieOpts);
    const token = this.tokenFromCtx(ctx);
    this.jwt.revoke(token);
    ctx.redirect(allowedLogoutNext(ctx.query.next));
  };

  postAuthentication = async(ctx: any, next: any) => {
    if (!ctx.state.userId) {
      return;
    }

    logger.debug(`user ${ctx.state.userId} is in post authentication status`);

    const token = await this.jwt.create(ctx.state.userId);
    ctx.cookies.set(this.config.cookieName, token, this.config.cookieOpts);
    ctx.state.jwt = token;
    const nextUrl = allowedLoginNext(ctx.query.next || ctx.request.body && ctx.request.body.next);
    if (ctx.is('json')) {
      return ctx.body = {shouldRedirect: true, ok: true, next: nextUrl};
    }
    ctx.redirect(nextUrl);
  };

  tokenFromCtx = (ctx: any) => {
    let token = ctx.cookies.get(this.config.cookieName, this.config.cookieOpts);
    if (!token && ctx.headers.authorization) {
      token = String(ctx.headers.authorization).replace('Bearer ', '');
    }
    return token;
  }
}
