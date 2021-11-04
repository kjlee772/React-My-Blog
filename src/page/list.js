import React, { Component } from 'react';
import './main.css';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

import { Search } from './index.js';

class list extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list_data: [],
      list_page: 1,
      list_limit: 10,
      list_all_page: [],
      list_search: '',
    }
  }
  componentDidMount() {
    this._getListData();
  }

  _changePage = (el, board_id) => {
    if (board_id === undefined) {
      // 게시글 형태에서
      this.setState({ list_page: el })
      sessionStorage.setItem('page', el);

      return this._getListData();
    }
  }
  _getListData = async function () {
    const { list_limit } = this.state;
    const list_pages = this._setPage();

    let categorys = '';
    if (sessionStorage.getItem('category')) {
      categorys = sessionStorage.getItem('category')
    }

    let search = '';
    if (queryString.parse(this.props.location.search)) {
      search = queryString.parse(this.props.location.search).search;
    }

    // Board 테이블 데이터 전체 수
    const total_cnt = await axios('/get/board_cnt', {
      method: 'POST',
      data: { search: search, category: categorys },
      headers: new Headers(),
    });

    // 데이터 가져오기
    const total_list = await axios('/get/board', {
      method: 'POST',
      data: {
        limit: list_limit,
        page: list_pages,
        search: search,
        category: categorys
      },
      headers: new Headers(),
    })

    // 전체 페이지 수 구하기
    let page_arr = [];
    for (let i = 1; i <= Math.ceil(total_cnt.data.cnt / list_limit); i++) {
      page_arr.push(i);
    }

    this.setState({
      list_data: JSON.stringify(total_list.data),
      list_all_page: page_arr,
      list_search: search
    })
  }
  _setPage = function () {
    if (sessionStorage.page) {
      this.setState({ list_page: Number(sessionStorage.page) })
      return Number(sessionStorage.page);
    }

    this.setState({ list_page: 1 })
    return 1;
  }
  render() {
    const {
      list_data, list_all_page, list_search, list_page,
    } = this.state;

    return (
      <div id='list_container'>
        <div id='list_header'>
          <div id='list_title'> 글 제목 </div>
          <div id='list_date'> 작성일 </div>
        </div>

        {list_data !== "[]" && list_data.length > 0
          ? JSON.parse(list_data).map((el, key) => {
            const view_url = '/view/' + el.board_id;

            return (
              <div style={{ display: 'flex', height: '50px' }} key={key}>
                <div className='list_db_title'> <Link to={view_url}> {el.title} </Link> </div>
                <div className='list_db_date'> {el.date.slice(0, 10)} </div>
              </div>
            )
          })
          : <div style={{ display: 'flex' }} >
            {list_search && list_search !== ""
              ? <div style={{ margin: '0 auto' }}> 검색된 결과가 없습니다. </div> // 검색 사용
              : <div style={{ margin: '0 auto' }}> 데이터가 없습니다. </div> // 검색 사용 X
            }
          </div>
        }

        <div style={{ textAlign: 'center' }} >
          <div>
            <ul style={{ paddingLeft: '0px' }}>
              {list_all_page ?
                list_all_page.map((el, key) => {
                  return (
                    el === list_page ?
                      <li key={key} className='page_num'>
                        <b> {el} </b>
                      </li>
                      :
                      <li key={key} className='page_num' onClick={() => this._changePage(el)}>
                        {el}
                      </li>
                  )
                })
                : null
              }
            </ul>
            <Search
              search={list_search}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default list;