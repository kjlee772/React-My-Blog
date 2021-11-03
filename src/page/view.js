import React, { Component } from 'react';
import './main.css';
import { Link } from 'react-router-dom';

import axios from 'axios';

class view extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    const board_id = this.props.match.params.data;

    const { pre_view, next_view, _getPreAndNextData, reply_num, _getReplyData } = this.props;

    this._addViewCnt(board_id);

    if (reply_num === null) {
      _getReplyData(board_id)
    }

    if (!this.props.data) {
      this.props._getData(board_id)
    }

    if (pre_view === "" || next_view === "") {
      _getPreAndNextData(board_id)
    }

    if (sessionStorage.getItem('reply')) {
      const reply_session = JSON.parse(sessionStorage.getItem('reply'))

      if (reply_session.board_id !== board_id) {
        sessionStorage.removeItem('reply')
        _getReplyData(board_id)
      }
    }

  }

  _addViewCnt = async function (board_id) {
    await axios('/update/view_cnt', {
      method: 'POST',
      headers: new Headers(),
      data: { id: board_id }
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
    const { user_id } = this.props;

    if (reply === "" || reply.length === 0) {
      document.getElementsByName('write_reply')[0].focus()
      document.getElementsByName('write_reply')[0].value = reply;

      return alert('댓글을 입력해주세요.');

    } else if (reply.split('<br>').length > 5) {
      return alert('댓글 내용이 5줄 이상 초과되었습니다.')
    }

    const data = {
      board_id: board_id,
      contents: reply,
      user_id: user_id
    }

    await axios('/add/reply', {
      method: 'POST',
      data: data,
      headers: new Headers(),
    })

    alert('댓글이 등록되었습니다.')
    return window.location.reload();
  }

  _getUserInfo = async function (user_id) {
    const data = await axios('/get/user_info', {
      method: 'POST',
      headers: new Headers(),
      data: { user_id: user_id }
    })

    return data.data[0];
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

  _changeBlock = (type) => {
    const {
      reply_pre_block, reply_next_block,
      reply_block_limit, reply_block, _getReplyData
    } = this.props;

    const board_id = this.props.match.params.data;
    let reply_session = {};
    let reply_page = this.props.reply_page;

    if (type === 'pre') {
      if (reply_pre_block) {
        if (reply_block === 2) {
          reply_session = { reply_page: 10, board_id: board_id }

        } else {
          reply_page = (reply_block * reply_block_limit) - 1;
          reply_session = { reply_page: reply_page, board_id: board_id }
        }
      } else {
        return alert('첫번째 블록입니다.')
      }

    } else if (type === 'next') {
      if (reply_next_block) {
        reply_page = (reply_block * reply_block_limit) + 1;
        reply_session = { reply_page: reply_page, board_id: board_id }

      } else {
        return alert('마지막 블록입니다.')
      }
    }

    sessionStorage.setItem('reply', JSON.stringify(reply_session));
    return _getReplyData(board_id)
  }

  render() {
    const {
      data, date, pre_view, next_view,
      reply_num, reply_data
    } = this.props
    
    const { _addReply } = this;
    
    // 해당 게시물의 id 값
    const board_id = this.props.match.params.data;

    if (next_view.length) {
      var next_url = '/view/' + next_view[0].board_id;
    }

    if (pre_view.length) {
      var pre_url = '/view/' + pre_view[0].board_id;
    }

    if (data.data) {
      var modify_url = '/write/modify/' + data.data.data[0].board_id;
    }

    return (
      <div style={{ padding: '50px 70px 0px 70px' }}>
        {data.data
          ?
          <div>
            <div className='top_title' >
              <div style={{ display: 'flex', marginBottom: '5px' }}>
                <input type='text' id='title_txt' name='title' defaultValue={data.data.data[0].title} readOnly />
                <Link to={modify_url}> <input type='button' value='수정' id='view_modi_button' /> </Link>
                <input type='button' value='삭제' id='view_del_button' onClick={() => this._removeView()} />
              </div>
              <div style={{ textAlign: 'right', color: '#ababab' }}>
                {date}
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: data.data.data[0].contents }}></div>

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
                  maxLength='100' name="write_reply"
                >
                </textarea>
                <div style={{ display: 'flex' }}>
                  <input type='button' value='등록' style={{ cursor: 'pointer' }}
                    onClick={() => _addReply()}
                  />
                </div>
              </div>

              <div>
                {reply_data.length > 0 && reply_num > 0
                  ?
                  <div>
                    <h5> 댓글 목록 </h5>
                    <div style={{ borderBottom: '1px solid #ababab' }}>
                      {reply_data.map((el, key) => {
                        let this_board_id = el.board_id
                        if(this_board_id == board_id){
                          let id = el.user.id;
                          let date = el.date.slice(2, 10) + ' ' + el.date.slice(11, 16);
  
                          return (
                            <li key={key} style={{ listStyle: 'none' }}>
                              <div className='view_reply'>
                                <div style={{ width: '15%' }} >
                                  {id}
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
                      })}
                    </div>
                  </div>
                  : <h5> 작성된 댓글이 없습니다. </h5>}
              </div>
            </div>
          </div>

          : null}
      </div>
    );
  }
}

export default view;