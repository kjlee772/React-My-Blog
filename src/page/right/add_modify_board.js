import React, { Component } from 'react';
import '../main.css';

import axios from 'axios';

class Add_Modify_Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      contents: '',
      select_category: '',
      category: [],
    }
  }
  componentDidMount() {
    this._getCategoryData();
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

    return this.setState({
      select_category: getData.data.data[0].cat_id,
    })
  }
  _getCategoryData = async function () {
    const getData = await axios('/get/category');
    this.setState({ category: getData.data })
  }

  _submitBoard = async function () {
    const title = document.getElementsByName('title')[0].value.trim();
    const temp = document.getElementsByName('sub_contents')[0]
    const contents = temp.getElementsByClassName('ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred')[0].innerHTML
    const category = this.state.select_category

    if (title === '') {
      return alert('제목을 입력해주세요.');
    }
    else if (contents === '<p><br data-cke-filler="true"></p>') {
      return alert('내용을 입력해주세요.');
    }
    else if (category === '') {
      return alert('카테고리를 선택해주세요.');
    }

    if (!this.props.match.params.data) {
      const data = { title: title, contents: contents, category: category };
      const res = await axios('/add/board', {
        method: 'POST',
        data: data,
        headers: new Headers()
      })

      if (res.data) {
        alert('글 등록이 완료되었습니다.');
        return window.location.replace('/');
      }
    }
    else {
      const data = {
        title: title,
        contents: contents,
        category: category,
        board_id: this.props.match.params.data
      };

      const res = await axios('/update/board', {
        method: 'POST',
        data: data,
        headers: new Headers()
      })

      if (res.data) {
        alert('글 수정이 완료되었습니다.');

        const url = "/view/" + this.props.match.params.data;

        sessionStorage.setItem('category', category);
        return window.location.href = url
      }
    }
  }

  _selectCategoryData = async (board_id) => {
    let category = document.getElementsByName('select_category')[0].value;

    // if (this.props.location.state) {
    //   // 수정 페이지일 경우 카테고리 변경
    //   const getData = await axios('/get/board_data', {
    //     method: 'POST',
    //     headers: new Headers(),
    //     data: { id: board_id }
    //   });

    //   return this.setState({ select_category: getData.data.data[0].cat_id })
    // }

    this.setState({
      select_category: category
    })
  }

  render() {
    const { category, select_category } = this.state

    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '100px' }} >
          <p style={{ fontSize: '30px', marginBottom: '0px' }}> 카테고리 선택 </p>
          <select style={{ fontFamily: 'retro' }} name='select_category' onChange={() => this._selectCategoryData()}
            value={select_category}
          >
            <option value=''> - 카테고리 선택 - </option>
            {category
              ? category.map((el) => {
                return (
                  <option value={el.id} key={el.id}>
                    {el.name}
                  </option>
                )
              })
              : null}
          </select>
        </div>
        <div >
          <button style={{ fontFamily: 'retro', fontSize: '20px', cursor: 'pointer' }} onClick={() => this._submitBoard()}>
            {!this.props.match.params.data
              ? '등록'
              : '수정'
            }
          </button>
        </div>
      </div>
    );
  }
}

export default Add_Modify_Board;