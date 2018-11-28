import effectiveAttrValidator from './effectiveAttrValidator';
import filterEffectiveAttr, {effectiveAttr} from './filterEffectiveAttr';
import repareKeyWords from './repareKeyWords';
import * as log from './log';

/**
 * @desc 生成一条策略的字符串
 *
 * @return {String} 'default-src self'
 */
function generateSubPolicyStr(policy) {
  return policy.map(repareKeyWords).join(' ');
}

// 默认配置-只允许该域名下内容
const defaultParams = {
  // 是否显示警告信息
  enableWarn: true,
  policy: {
    'default-src': ['self'],
  },
};

function validatorPolicy(policy) {
  if (Object.keys(policy).length === 0) {
    log.warn('⚠️CSP CONFIG WARNING: Empty Policy');
  }

  effectiveAttrValidator(policy, effectiveAttr, invalidAttrs => {
    log.warn(`⚠️CSP CONFIG WARNING: Invalid Policy Name[${invalidAttrs.join(', ')}]`);
  });
}

/**
 * @desc 设置响应头 Content-Security-Policy
 *
 * @param customPolicy {Object} 自定义安全策略 exp. { 'img-src': ['self'] };
 */
export default function({enableWarn = true, policy = {}} = defaultParams) {
  return async(ctx, next) => {
    // Warn invalid Policy Setting
    if (enableWarn) {
      validatorPolicy(policy);
    }

    // generate http header string
    const policyStr = filterEffectiveAttr(policy, ctx)
      .map(generateSubPolicyStr)
      .join(';');

    ctx.set('Content-Security-Policy', policyStr);
    await next();
  };
}
