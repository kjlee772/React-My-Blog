import React, { Component } from 'react';
import './main.css';
import { Link } from 'react-router-dom';

import { Search } from './index.js';

class list extends Component {

  render() {
    const {
      list_data, list_all_page, list_search, list_page, _changePage
    } = this.props;

    return (
      <div id='list_container'>
        <div id='list_header'>
          <div id='list_title'> 글 제목 </div>
          <div id='list_date'> 작성일 </div>
        </div>

        {list_data !== "[]" && list_data.length > 0 ? JSON.parse(list_data).map((el, key) => {
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
                      : <li key={key} className='page_num'
                        onClick={() => _changePage(el)}> {el}
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