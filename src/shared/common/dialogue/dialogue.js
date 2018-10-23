
import Component from 'inferno-component';

export class Dialogue extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      zoomOut: true,
    };

    this.setActive = this.setActive.bind(this);

    props.getSetActiveFn(this.setActive);
  }

  setActive(flag) {
    this.setState({
      isActive: flag,
      zoomOut: !flag,
    });
  }

  render() {
    const {submitButton, cancelButton, title} = this.props;

    return (
      <div className={`modal ${this.state.isActive ? 'is-active' : ''}`}>
        <div className='modal-background'/>
        <div className='modal-card'>
          <header style={{backgroundColor: '#ffffff', borderBottom: '0px'}} className='modal-card-head'>
            <p style={{marginBottom: '0px'}} className='modal-card-title'>{title}</p>
            {!cancelButton && <a onClick={() => this.setState({isActive: false})}><i className='fas fa-times'/></a>}
          </header>
          <section className='modal-card-body'>
            {this.props.children}
          </section>
          <footer style={{borderTop: '0px', backgroundColor: '#ffffff'}} className='modal-card-foot'>
            <div style={{}}>
              {cancelButton || null}
              {submitButton || null}
            </div>
          </footer>
        </div>
      </div>
    );
  }
}
