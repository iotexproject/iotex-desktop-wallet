import Component from 'inferno-component';

export class LabelInputField extends Component {

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.props.update(name, value);
  }

  render() {
    const {label, name, value, error, placeholder, textArea, readOnly} = this.props;
    const InputTag = `${textArea ? 'textarea' : 'input'}`;
    return (
      <div>
        <label className='label'>{label}</label>
        {error ? <p className='help is-danger'>{error}</p> : null}
        <div className='field has-addons'>
          <p className='control is-expanded'>
            <InputTag
              style={{backgroundColor: '#f7f7f7', borderColor: '#ffffff', boxShadow: ''}}
              name={name}
              className={`${textArea ? 'textarea' : 'input'} ${error ? 'is-danger' : ''}`}
              type='text'
              value={value}
              placeholder={placeholder}
              onInput={this.handleInputChange}
              disabled={readOnly}
              autocomplete={name === 'priKey' ? 'off' : 'on'}
            />
          </p>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export class TextInputField extends Component {

  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.props.update(name, value);
  }

  render() {
    const {label, name, value, error, placeholder, textArea, readOnly, extra} = this.props;
    const InputTag = `${textArea ? 'textarea' : 'input'}`;
    return (
      <div className='field abi-field'>
        <div className='columns'>
          <div className='column is-one-quarter'>
            <strong>{label}</strong>
            {error && <p className='help is-danger' style={{wordBreak: 'break-word'}}>{error}</p>}
          </div>
          <div className='column'>
            <div className='field has-addons'>
              <p className='control is-expanded'>
                <InputTag
                  style={{backgroundColor: '#f7f7f7', borderColor: '#ffffff', boxShadow: ''}}
                  name={name}
                  className={`${textArea ? 'textarea' : 'input'} ${error ? 'is-danger' : ''}`}
                  type='text'
                  value={value}
                  placeholder={placeholder}
                  onInput={this.handleInputChange}
                  disabled={readOnly}
                />
                {extra && <p className='help is-danger' style={{wordBreak: 'break-word', color: 'rgb(165, 165, 165)'}}>{extra}</p>}
              </p>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
