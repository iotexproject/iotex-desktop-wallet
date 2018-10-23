import ethereumjs from 'ethereumjs-abi';
import hash from 'js-sha3';
import {decodeAddress} from '../../../lib/decode-address';

function getArgTypes(fn) {
  const args = [];
  fn.inputs.forEach(field => {
    args.push({name: field.name, type: field.type});
  });
  return args;
}

export function getHeaderHash(fn, args) {
  const inputs = args.map(i => {
    return i.type;
  });
  const signature = `${fn.name}(${inputs.join(',')})`;
  const keccak256 = hash.keccak256(signature);
  return keccak256.slice(0, 8);
}

export function encodeArguments(args, userInput) {
  const types = [];
  const values = [];

  (args || []).forEach(arg => {
    if (arg.type === 'bool') {
      types.push('uint256');
    } else {
      types.push(arg.type);
    }
    if (userInput.hasOwnProperty(arg.name)) {
      let value = userInput[arg.name];
      if (arg.type === 'address') {
        value = `0x${decodeAddress(value).address}`;
      }
      values.push(value);
    } else {
      values.push('');
    }
  });
  const encoded = ethereumjs.rawEncode(types, values);
  return encoded.toString('hex');
}

export function encodeInputData(abiFunctions, fnName, userInput) {
  const fn = abiFunctions[fnName];
  const args = getArgTypes(fn);
  const header = getHeaderHash(fn, args);
  const encodedArgs = encodeArguments(args, userInput);
  return `${header}${encodedArgs}`;
}
