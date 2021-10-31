import React, { Component } from 'react';
import './main.css';

import axios from 'axios';

class list extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      page: 1,
      limit: 10,
      all_page: [],
    }
  }

  componentDidMount() {
    this._getListData();
    this._setPage();
  }

  _getListData = async function () {
    const { limit } = this.state;

    const total_cnt = await axios('/get/board_cnt');
    console.log(total_cnt.data.cnt);

    const total_list = await axios('/get/board', {
      method: 'GET',
      headers: new Headers()
    })

    let page_arr = [];
    for (let i = 1; i <= Math.ceil(total_cnt.data.cnt / limit); i++) {
      page_arr.push(i);
    }
    console.log(page_arr);

    this.setState({ data: total_list, all_page: page_arr })
  }

  _changePage = function (el) {
    this.setState({ page: el })
    sessionStorage.setItem('page', el)
  }
  _setPage = function () {
    if (sessionStorage.page) {
      this.setState({ page: Number(sessionStorage.page) })
      return Number(sessionStorage.page);
    }

    this.setState({ page: 1 })
    return 1;
  }

  render() {
    const list = this.state.data.data
    const { all_page, page } = this.state;

    return (
      <div className='List'>

        <div className='list_grid list_tit'>
          <div> 제목 </div>
          <div> 조회수 </div>
          <div className='acenter'> 날짜 </div>
        </div>

        {list ? list.map((el, key) => {
          return (
            <div className='list_grid list_data' key={key}>
              <div> {el.title} </div>
              <div> </div>
              <div className='acenter'> {el.date.slice(0, 10)} </div>
            </div>
          )
        })
          : null}
        <div className='paging_div'>
          <div> </div>
          <div>
            <ul>
              {all_page ? all_page.map((el, key) => {
                return (
                  el === page ? <li key={key} className='page_num'> <b> {el} </b> </li>
                    : <li key={key} className='page_num' onClick={() => this._changePage(el)}> {el} </li>
                )
              })
                : null}
            </ul>
          </div>
          <div> </div>
        </div>
      </div>
    );
  }
}

export default list;
