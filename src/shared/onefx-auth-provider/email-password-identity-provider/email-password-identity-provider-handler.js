import {noopReducer} from 'onefx/lib/iso-react-render/root/root-reducer';
import validator from 'validator';
import {IdentityApp} from './view/identity-app';

const PASSWORD_MIN_LENGTH = 8;

export function emailValidator() {
  return async(ctx, next) => {
    let {email} = ctx.request.body;
    email = String(email).toLowerCase();
    email = validator.trim(email);
    if (!validator.isEmail(email)) {
      return ctx.response.body = {
        ok: false,
        error: {
          code: 'auth/invalid-email',
          message: ctx.t('auth/invalid-email'),
        },
      };
    }

    ctx.request.body.email = email;
    return await next(ctx);
  };
}

export function passwordValidator() {
  return async(ctx, next) => {
    let {password} = ctx.request.body;
    password = String(password);
    if (password.length < PASSWORD_MIN_LENGTH) {
      return ctx.response.body = {
        ok: false,
        error: {
          code: 'auth/weak-password',
          message: ctx.t('auth/weak-password'),
        },
      };
    }

    ctx.request.body.password = password;
    return await next(ctx);
  };
}

export function setEmailPasswordIdentityProviderRoutes(server) {
  // view routes
  server.get('login', '/login', async(ctx, next) => {
    return isoRender(ctx);
  });
  server.get('sign-up', '/sign-up', async(ctx, next) => {
    return isoRender(ctx);
  });
  server.get('forgot-password', '/forgot-password', async(ctx, next) => {
    return isoRender(ctx);
  });
  server.get('reset-password', '/settings/reset-password', async ctx => {
    const token = ctx.query.token;
    const found = await server.auth.emailToken.findOne(token);
    ctx.setState('base.token', found && found.token);
    return isoRender(ctx);
  });
  server.get('logout', '/logout', server.auth.logout);
  server.get(
    'email-token',
    '/email-token/:token',
    async(ctx, next) => {
      const et = await server.auth.emailToken.findOneAndDelete(ctx.params.token);
      if (!et || !et.userId) {
        return isoRender(ctx);
      }

      const newToken = await server.auth.emailToken.newAndSave(et.userId);
      ctx.query.next = `/settings/reset-password/?token=${encodeURIComponent(newToken.token)}`;
      ctx.state.userId = et.userId;
      await next();
    },
    server.auth.postAuthentication,
  );

  // API routes
  server.post(
    'api-sign-up',
    '/api/sign-up/',
    emailValidator(),
    passwordValidator(),
    async(ctx, next) => {
      const {email, password} = ctx.request.body;
      try {
        const user = await server.auth.user.newAndSave({
          email,
          password,
          ip: ctx.headers['x-forward-for'],
        });
        ctx.state.userId = user._id;
        await next();
      } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          return ctx.body = {
            ok: false,
            error: {
              code: 'auth/email-already-in-use',
              message: ctx.t('auth/email-already-in-use'),
            },
          };
        }
      }
    },
    server.auth.postAuthentication,
  );

  server.post(
    'api-sign-in',
    '/api/sign-in/',
    emailValidator(),
    async(ctx, next) => {
      const {email, password} = ctx.request.body;
      const user = await server.auth.user.getByMail(email);
      if (!user) {
        return ctx.response.body = {
          ok: false,
          error: {
            code: 'auth/user-not-found',
            message: ctx.t('auth/user-not-found'),
          },
        };
      }
      const isPasswordVerified = await server.auth.user.verifyPassword(user._id, password);
      if (!isPasswordVerified) {
        return ctx.response.body = {
          ok: false,
          error: {
            code: 'auth/wrong-password',
            message: ctx.t('auth/wrong-password'),
          },
        };
      }
      if (user.isBlocked) {
        return ctx.response.body = {
          ok: false,
          error: {
            code: 'auth/user-disabled',
            message: ctx.t('auth/user-disabled'),
          },
        };
      }
      ctx.state.userId = user._id;
      await next();
    },
    server.auth.postAuthentication,
  );

  server.post(
    'api-forgot-password',
    '/api/forgot-password/',
    emailValidator(),
    async ctx => {
      const {email} = ctx.request.body;

      const user = await server.auth.user.getByMail(email);
      if (user) {
        await server.auth.sendResetPasswordLink(user.id, user.email, ctx.t);
      }

      return ctx.response.body = {
        ok: true,
      };
    }
  );

  server.post(
    'reset-password',
    '/api/reset-password/',
    server.auth.authRequired,
    async ctx => {
      const {token, password, newPassword} = ctx.request.body;
      if (token) {
        const verified = Boolean(await server.auth.emailToken.findOne(token));
        if (!verified) {
          return ctx.redirect(`${server.auth.config.emailTokenLink}invalid`);
        }
      } else {
        const verified = await server.auth.user.verifyPassword(ctx.state.userId, password);
        if (!verified) {
          return ctx.response.body = {
            ok: false,
            error: {
              code: 'auth/wrong-password',
              message: ctx.t('auth/wrong-password'),
            },
          };
        }
      }

      if (newPassword.length < PASSWORD_MIN_LENGTH) {
        return ctx.response.body = {
          ok: false,
          error: {
            code: 'auth/weak-password',
            message: ctx.t('auth/weak-password'),
          },
        };
      }

      await server.auth.user.updatePassword(ctx.state.userId, newPassword);
      if (token) {
        // forgot password
        ctx.response.body = {ok: true, shouldRedirect: true, next: '/'};
      } else {
        // reset password
        ctx.response.body = {ok: true};
      }
      await server.auth.emailToken.findOneAndDelete(token);
    }
  );
}

function isoRender(ctx) {
  ctx.body = ctx.isoReactRender({
    VDom: (
      <IdentityApp/>
    ),
    reducer: noopReducer,
    clientScript: '/identity-provider-main.js',
  });
}
