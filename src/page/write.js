import React, { Component } from 'react';
import './main.css';
import axios from 'axios';

import { CKEditor } from '../inc/index.js';

class write extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      contents: '',
    }
  }
  componentDidMount() {
    const board_id = this.props.location.state
    if (board_id) {
      this._getData(board_id);
    }
  }
  _getData = async (board_id) => {
    const getData = await axios('/get/board_data', {
      method: 'POST',
      data: { id: board_id },
      headers: new Headers(),
    });

    const date = getData.data.data[0].date.slice(0, 10) + ' ' + getData.data.data[0].date.slice(11, 16);
    return this.setState({
      title: getData.data.data[0].title,
      contents: getData.data.data[0].contents,
      date: date,
    })
  }
  _getContents = (val) => {
    const contents = val.trim();
    this.setState({ contents: contents })
  }
  _getTitles = () => {
    const title = document.getElementsByName('title')[0].value.trim();
    this.setState({ title: title })
  }
  _getModifyData = async (board_id) => {
    const getData = await axios('/get/board_data', {
      method: 'POST',
      headers: new Headers(),
      data: { id: board_id }
    });

    this.setState({
      title: getData.data.data[0].title,
      contents: getData.data.data[0].contents
    })
  }
  render() {
    const { contents, title } = this.state;
    return (
      <div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <input id='write_title'
            type='text' autoComplete='off' name='title'
            placeholder='제목' defaultValue={title} onBlur={() => this._getTitles()} />
        </div>

        <div>
          <CKEditor contents={contents} />
        </div>
      </div>
    );
  }
}

export default write;