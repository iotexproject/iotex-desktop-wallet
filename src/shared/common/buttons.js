// @flow

import {Link} from 'inferno-router';

// eslint-disable-next-line max-params
export function greenButton(name: string, disabled: boolean, onClick: any, isLoading: boolean, link: ?string, target: ?string) {
  const backgroundColor = disabled ? '#f1f1f1' : '#00b4a0';
  const color = disabled ? '#cccccc' : '#ffffff';

  if (target) {
    return (
      <a target={target} href={link} style={{backgroundColor, color}} className={`button ${disabled ? 'disabled' : ''}`} onClick={onClick}>{name}</a>
    );
  }

  if (link) {
    return (
      <Link to={link} style={{backgroundColor, color}} className={`button ${disabled ? 'disabled' : ''}`} onClick={onClick}>{name}</Link>
    );
  }
  return (
    <a style={{backgroundColor, color}} className={`button ${disabled ? 'disabled' : ''} ${isLoading ? 'is-loading' : ''}`} onClick={onClick}>{name}</a>
  );
}

export function cancelButton(onClick: any) {
  const backgroundColor = '#ffffff';
  const color = '#999999';

  return (
    <a style={{backgroundColor, color}} className={'button'} onClick={onClick}>No, cancel</a>
  );
}

export function clearButton(name: string, onClick: any) {
  const backgroundColor = '#f7f7f7';
  const color = '#0c8de4';

  return (
    <a style={{backgroundColor, color, paddingLeft: '10px', borderColor: backgroundColor}} className={'button'} onClick={onClick}>{name}</a>
  );
}
