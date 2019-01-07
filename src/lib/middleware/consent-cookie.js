/* eslint-disable func-style */
export function initServerConsent(ctx) {
  const consent = ctx.cookies.get('consent');
  ctx.setState('base.consent', consent);
}
