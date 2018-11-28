const keyWords = [
  'none',
  'self',
  'unsafe-inline',
  'unsafe-eval',
];

// 修复字符串self的书写问题 "self" => "'self'"
export default function(str) {
  return keyWords.includes(str) ? `'${str}'` : str;
}
