// @flow

import {t} from '../../../lib/iso-i18n';

export function textInput(name: string, type: string, readOnly: ?boolean, value: ?string) {
  return (
    <div className='field abi-field'>
      <div className='columns'>
        <div className='column is-one-quarter'><strong>{name}</strong></div>
        <div className='column'>
          <div className='control'>
            <input style={{backgroundColor: '#f7f7f7', border: '0px'}} name={name ? name : type} className='input' type='text' value={value} placeholder={type} disabled={readOnly}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export function boolInput(name: string) {
  return (
    <div className='field abi-field'>
      <div className='columns'>
        <div className='column is-one-quarter'><strong>{name}</strong></div>
        <div className='column'>
          <div className='control'>
            <label className='radio'><input type='radio' name={name ? name : 'bool'} value='1'/> {t('input.bool.true')}</label>
            <label className='radio'><input type='radio' name={name ? name : 'bool'} value='0' checked/> {t('input.bool.false')}</label>
          </div>
        </div>
      </div>
    </div>
  );
}
