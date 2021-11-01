import React, { Component } from 'react';
import './main.css';

import axios from 'axios';
import { Link } from 'react-router-dom';

class view extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      date: '',
    }
  }
  componentDidMount() {
    const board_id = this.props.match.params.data;

    this._getData(board_id)
    this._addViewCnt(board_id)
  }

  _getData = async function (board_id) {
    const getData = await axios('/get/board_data', {
      method: 'POST',
      data: { id: board_id },
      headers: new Headers()
    });

    const date = getData.data.data[0].date.slice(0, 10) + ' ' + getData.data.data[0].date.slice(11, 16);

    return this.setState({ data: getData, date: date })
  }

  _addViewCnt = async function (board_id) {
    await axios('/update/view_cnt', {
      method: 'POST',
      data: { id: board_id },
      headers: new Headers()
    })
  }

  _removeView = async function () {
    if (window.confirm('해당 게시물을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) {
      const board_id = this.props.match.params.data;

      await axios('/delete/board', {
        method: 'POST',
        headers: new Headers(),
        data: { board_id: board_id }
      })

      alert('게시물이 삭제되었습니다.')
      return window.location.href = '/'
    }
  }

  render() {
    const { data, date } = this.state;
    const { admin } = this.props;

    if(data.data) {
      var modify_url = '/write/modify/' + data.data.data[0].board_id;
    }    

    return (
      <div className='Write'>
        {data.data
          ? <div>
            {admin === 'Y'
              ? <div className='write_option_div'>
                <Link to={modify_url}> <input type='button' value='수정' /> </Link>
                <input type='button' value='삭제' onClick={() => this._removeView()} />
              </div>
              : null}
            <div className='top_title'>
              <input type='text' id='title_txt' name='title' defaultValue={data.data.data[0].title} readOnly />

              <div className='date_div'>
                {date}
              </div>
            </div>

            <div id='contents_div'
              dangerouslySetInnerHTML={{ __html: data.data.data[0].contents }} >
            </div>
            <div className='other_div'>
              <input type='button' value='목록' id='view_list_button'
                onClick={() => window.location.href = '/'}
              />
            </div>
          </div>
          : null}
      </div>
    );
  }
}

export default view;