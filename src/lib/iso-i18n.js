/* eslint-disable func-style */
export let t = function dummy(key) {
  return key;
};

export function initServerI18n(ctx) {
  t = (str, data) => formatString(ctx.i18n.__(formatString(str)), data);
  const locale = ctx.i18n.getLocale();
  ctx.setState('base.translations', ctx.i18n.locales[locale]);
  ctx.setState('base.locale', locale);
  ctx.t = t;
}

export function initClientI18n(translations) {
  t = (msgKey, data) => {
    const unformatedMsg = translations[msgKey] || msgKey;

    return formatString(unformatedMsg, data);
  };
}

function formatString(str, data) {
  if (!data) {
    return str;
  }

  Object.keys(data).forEach(key => {
    str = str.replace(`\${${key}}`, data[key]);
  });
  return str;
}
