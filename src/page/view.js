import React, { Component } from 'react';
import './main.css';
import { Link } from 'react-router-dom';

import axios from 'axios';

class view extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      contents: '',
      date: '',
      reply_data: [],
      reply_num: '',
      pre_view: '',
      next_view: '',
    }
  }

  componentDidMount() {
    const board_id = this.props.match.params.data;
    this._getData(board_id);
    this._getReplyData(board_id);
    this._getPreAndNextData(board_id);
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
  _getReplyData = async (board_id) => {
    const obj = {
      board_id: board_id,
    }

    // 데이터와 총 갯수 구하기
    const data = await axios('/get/reply_data', {
      method: 'POST',
      headers: new Headers(),
      data: obj
    })

    return this.setState({
      reply_data: data.data.rows,
      reply_num: data.data.count,
    })
  }

  _changeViewPage = function (url) {
    if (url === 'null_pre') {
      return alert('첫번째 게시물입니다.')
    }
    else if (url === 'null_next') {
      return alert('마지막 게시물입니다.')
    }

    return window.location.href = url;
  }
  _getPreAndNextData = async (board_id) => {
    const category = sessionStorage.getItem('category');

    const res = await axios('/get/pre_and_next', {
      method: 'POST',
      headers: new Headers(),
      data: { board_id: board_id, category: category }
    })

    this.setState({
      pre_view: res.data.pre,
      next_view: res.data.next
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

  _addReply = async () => {
    let reply = document.getElementsByName('write_reply')[0].value.trim();

    // 내용 줄바꿈 처리하기
    reply = reply.replace(/(\n|\r\n)/g, '<br>');

    const board_id = this.props.match.params.data;

    if (reply === '' || reply.length === 0) {
      document.getElementsByName('write_reply')[0].focus()
      document.getElementsByName('write_reply')[0].value = reply;

      return alert('댓글을 입력해주세요.');
    }
    else if (reply.split('<br>').length > 5) {
      return alert('댓글 내용이 5줄 이상 초과되었습니다.')
    }

    const data = {
      board_id: board_id,
      contents: reply,
      user_id: 1
    }

    await axios('/add/reply', {
      method: 'POST',
      data: data,
      headers: new Headers(),
    })

    alert('댓글이 등록되었습니다.')
    return window.location.reload();
  }

  _removeReply = async function (reply_id) {
    if (window.confirm('해당 댓글을 삭제하시겠습니까?')) {
      await axios('/delete/reply', {
        method: 'POST',
        headers: new Headers(),
        data: { reply_id: reply_id }
      })
    }

    alert('댓글 삭제가 완료되었습니다.')
    return window.location.reload();
  }
  _changePage = (el, board_id) => {
    if (board_id === undefined) {
      // 게시글 형태에서
      this.setState({ list_page: el })
      sessionStorage.setItem('page', el);

      return this._getListData();
    }
  }

  render() {
    const { title, contents, date, reply_data, reply_num, pre_view, next_view } = this.state

    // 해당 게시물의 id 값
    const board_id = this.props.match.params.data;
    if (next_view.length) {
      var next_url = '/view/' + next_view[0].board_id;
    }
    if (pre_view.length) {
      var pre_url = '/view/' + pre_view[0].board_id;
    }
    var modify_url = '/write/modify/' + board_id;

    return (
      <div style={{ padding: '50px 70px 0px 70px' }}>
        <div>
          <div className='top_title' >
            <div style={{ display: 'flex', marginBottom: '5px' }}>
              <input type='text' id='title_txt' name='title' defaultValue={title} readOnly />
              <Link to={{ pathname: modify_url, state: board_id }}> <input type='button' value='수정' id='view_modi_button' /> </Link>
              <input type='button' value='삭제' id='view_del_button' onClick={() => this._removeView()} />
            </div>
            <div style={{ textAlign: 'right', color: '#ababab' }}>
              {date}
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: contents }}></div>

          <div id='view_move'>
            <div style={{ width: '25%' }}>
              <b style={{ cursor: 'pointer' }} onClick={pre_url ? () => this._changeViewPage(pre_url)
                : () => this._changeViewPage('null_pre')}> 이전 글 </b>
            </div>

            <div style={{ width: '50%' }}>
              {/* <input type='button' value='목록'
                  onClick={() => window.location.href = '/'}
                /> */}
            </div>

            <div style={{ width: '25%' }}>
              <b style={{ cursor: 'pointer' }} onClick={next_url ? () => this._changeViewPage(next_url)
                : () => this._changeViewPage('null_next')}> 다음 글 </b>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #ababab' }} >
            <h4> 댓글 </h4>
            <div style={{ display: 'flex' }} >
              <textarea style={{ width: '90%', resize: 'none' }} rows='3' placeholder='100자 이내의 글을 입력해주세요.'
                maxLength='100' name='write_reply'
              >
              </textarea>
              <div style={{ display: 'flex' }}>
                <input type='button' value='등록' style={{ cursor: 'pointer' }}
                  onClick={() => this._addReply()}
                />
              </div>
            </div>

            <div>
              {reply_num > 0
                ?
                <div>
                  <h5> 댓글 목록 </h5>
                  <div style={{ borderBottom: '1px solid #ababab' }}>
                    {reply_data.map((el, key) => {
                      if (Number(el.board_id) === Number(board_id)) {
                        let date = el.date.slice(2, 10) + ' ' + el.date.slice(11, 16);
                        return (
                          <li key={key} style={{ listStyle: 'none' }}>
                            <div className='view_reply'>
                              <div style={{ width: '15%' }} >
                                admin
                              </div>

                              <div style={{ width: '55%' }}
                                dangerouslySetInnerHTML={{ __html: el.contents }}>
                              </div>

                              <div style={{ width: '20%' }}>
                                {date}
                              </div>

                              <div style={{ width: '5%' }}>
                                <input type='button' value='삭제'
                                  onClick={() => this._removeReply(el.reply_id)}
                                />
                              </div>
                            </div>
                          </li>
                        )
                      }
                      else {
                        return null;
                      }
                    })}
                  </div>
                </div>
                :
                <h5> 작성된 댓글이 없습니다. </h5>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default view;