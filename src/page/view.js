import React, { Component } from 'react';
import './main.css';
import { Link } from 'react-router-dom';

import axios from 'axios';

class view extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pre: "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2018/png/iconmonstr-angel-left-thin.png&r=0&g=0&b=0",
      next: "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2018/png/iconmonstr-angel-right-thin.png&r=0&g=0&b=0",
      pre_block: "https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-arrow-64.png",
      next_block: "https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-arrow-63.png"
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

    } else if (url === 'null_next') {
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
    console.log("보드아이디:"+board_id+' 유저아이디: '+user_id);

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
    const { pre, next, pre_block, next_block } = this.state;

    const {
      data, date, pre_view, next_view,
      reply_num, reply_data, reply_all_page, reply_page,
      _changePage
    } = this.props


    const { _addReply, _changeBlock } = this;

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
      <div className='Write View'>
        {data.data
          ?
          <div>
            <div className='write_option_div'>
              <Link to={modify_url}> <input type='button' value='수정' /> </Link>
              <input type='button' value='삭제' onClick={() => this._removeView()} />
            </div>

            <div className='top_title'>
              <input type='text' id='title_txt' name='title' defaultValue={data.data.data[0].title} readOnly />

              <div className='date_div'>
                {date}
              </div>
            </div>

            <div id='contents_div'
              dangerouslySetInnerHTML={{ __html: data.data.data[0].contents }}
            >
            </div>

            <div className='other_div' style={{ textAlign: 'center' }}>
              <input type='button' value='목록' id='view_list_button'
                onClick={() => window.location.href = '/'}
              />

              <div className='view_pre_next_div view_pre'>
                {/* left empty */}
                <img src={pre} alt='pre' onClick={
                  pre_url
                    ? () => this._changeViewPage(pre_url)
                    : () => this._changeViewPage('null_pre')} />

                <div>
                  {pre_view.length > 0
                    ? <b onClick={() => this._changeViewPage(pre_url)}>
                      {pre_view[0].title}
                    </b>
                    : null}
                </div>
              </div>

              <div className='view_pre_next_div view_next'>
                {/* right empty */}
                <img src={next} alt='next' onClick={
                  next_url
                    ? () => this._changeViewPage(next_url)
                    : () => this._changeViewPage('null_next')} />

                <div>
                  {next_view.length > 0
                    ? <b onClick={() => this._changeViewPage(next_url)}>
                      {next_view[0].title}
                    </b>
                    : null}
                </div>
              </div>
            </div>
            {/* other_div className 끝 */}

            <div className='Reply_div'>
              <h4> 댓글 </h4>

              <div className='Reply_write'>
                <textarea rows='3' placeholder='100자 이내의 글을 입력해주세요.'
                  maxLength='100' name='write_reply'
                >
                </textarea>

                <input type='button' value='등록' id='reply_submit_button'
                  onClick={() => _addReply()}
                />
              </div>

              <div className='Reply_list'>
                {reply_data.length > 0 && reply_num > 0
                  ? <div>
                    <h5> {reply_num} 개의 댓글이 있습니다. </h5>

                    <div className='reply_list_div'>
                      {reply_data.map((el) => {

                        let id = el.user.id;

                        let date = el.date.slice(2, 10) + ' ' + el.date.slice(11, 16);

                        return (
                          <div className='reply_list_gird'>
                            <div style={{ 'fontWeight': 'bold' }}
                              className='reply_list_id'
                            >
                              {/* 아이디 */}
                              {id}
                            </div>

                            <div
                              className='reply_list_contents'
                              dangerouslySetInnerHTML={{ __html: el.contents }}>
                              {/* 내용 */}
                            </div>

                            <div className='reply_list_date'>
                              {/* 작성일 및 기타 */}
                              {date}

                              <input type='button' value='삭제' className='reply_delete_btn'
                                onClick={() => this._removeReply(el.reply_id)}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {/* reply_list_div 끝 */}

                    <div className='reply_paging'>
                      {/* 댓글 페이징 시작 */}
                      <div>
                        {reply_all_page ?
                          <ul>
                            <li className='page_num'>
                              <img id='pre_block' src={pre_block} alt='num'
                                onClick={() => _changeBlock('pre')}
                              />
                            </li>

                            {reply_all_page.map((el, key) => {
                              return (
                                el === reply_page ?
                                  /* 현재 페이지 */
                                  <li key={key} className='page_num'>
                                    <b> {el} </b>
                                  </li>

                                  : <li key={key} className='page_num'
                                    onClick={() => _changePage(el, board_id)}
                                  >
                                    {el}
                                  </li>
                              )
                            })
                            }
                            <li className='page_num'>
                              <img id='next_block' src={next_block} alt='num'
                                onClick={() => _changeBlock('next')}
                              />
                            </li>
                          </ul>
                          : null}
                      </div>
                    </div> {/* 댓글 페이징 끝 */}
                  </div>

                  : <h5> 작성된 댓글이 없습니다. </h5>}
              </div>
            </div> {/* Reply_div 끝 */}
          </div>

          : null}
      </div>
    );
  }
}

export default view;