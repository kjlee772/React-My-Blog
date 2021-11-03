import React, { Component } from 'react';
import './main.css';

import { CKEditor } from '../inc/index.js';

class write extends Component {
  componentDidMount() {
    if (this.props.match.params.data && this.props.title.length === 0) {
      this.props._getModifyData(this.props.match.params.data);
    }
  }
  render() {
    const { _getContents, _getTitles, contents, title } = this.props;
    return (
      <div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <input id='write_title'
            type='text' autoComplete='off' name='title'
            placeholder='제목' defaultValue={title} onBlur={() => _getTitles()} />
        </div>

        <div>
          <CKEditor
            _getContents={_getContents}
            contents={contents}
          />
        </div>
      </div>
    );
  }
}

export default write;