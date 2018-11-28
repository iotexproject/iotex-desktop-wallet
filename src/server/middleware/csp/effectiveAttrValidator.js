export default function(obj, effectAttrNames, onError) {
  const invalidAttrNames = Object.keys(obj)
    .filter(key => effectAttrNames.every(attrName => (
      key !== attrName && Number(key) !== attrName
    )));

  if (Boolean(invalidAttrNames.length) && onError) {
    onError(invalidAttrNames);
  }
  return !invalidAttrNames.length;
}
