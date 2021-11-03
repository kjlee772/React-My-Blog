import React, { Component } from 'react';
import '../main.css';
import { Link } from 'react-router-dom';

import default_profile_img from './my_img.jpg';

import axios from 'axios';

class category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: [],
      edit: false,
    }
  }
  componentDidMount() {
    this._getCategoryData();
  }

  _getCategoryData = async function () {
    const getData = await axios('/get/category');
    this.setState({ category: getData.data })
  }

  _addCategory = async function () {
    let category_name = window.prompt('추가할 카테고리의 이름을 입력해주세요.');

    if (category_name) {
      category_name = category_name.trim();

      if (category_name !== '' && category_name.length > 0) {
        const add = await axios('/add/category', {
          method: 'POST',
          data: { name: category_name },
          headers: new Headers()
        })

        alert(add.data.msg);
        this._getCategoryData();
      } else {
        return alert('최소 1글자 이상 입력해야 합니다.');
      }
    }
  }

  _removeCategory = async function (category) {
    if (window.confirm(category.name + ' 카테고리를 삭제하시겠습니까?')) {
      const remove = await axios('/delete/category', {
        method: 'POST',
        data: category,
        headers: new Headers()
      })

      if (remove) {
        alert('카테고리 삭제가 완료되었습니다.');
        this._getCategoryData();
      }
    }
  }

  _modifyCategory = async function (category) {
    let modify_name = document.getElementsByName('modify_' + category.id)[0].value;
    modify_name = modify_name.trim();

    if (modify_name !== '' && modify_name.length > 0) {
      if (category.name === modify_name) {
        return alert('변경하려는 카테고리의 이름이 \n기존의 카테고리명과 동일합니다.');
      }

      if (window.confirm(category.name + ' 의 이름을 \n' + modify_name + ' 으로 수정하시겠습니까?')) {
        const data = { id: category.id, name: modify_name }
        const modify = await axios('/modify/category', {
          method: 'POST',
          data: data,
          headers: new Headers()
        })
        alert(modify.data.msg);
        this._getCategoryData();
      }
    }
    else {
      return alert('변경할 카테고리의 이름을 최소 1 글자 이상 입력해주세요.');
    }
  }

  render() {
    const { category, edit } = this.state;
    const { _changeCategory } = this.props;

    let pre_cat = '';
    if (sessionStorage.getItem('category')) {
      pre_cat = Number(sessionStorage.getItem('category'));
    }
    return (
      <div className='Category'>
        <div style={{ textAlign: 'center', overflow: 'hidden' }}>
          <img id='category_img' src={default_profile_img}  alt='profile_img' />
          <Link to='/write'> <input id='category_write_button' type='button' value='글 쓰기' /> </Link>
        </div>
        <ul>
          <li style={{ display: 'flex' }}>
            <Link className={pre_cat === '' ? "pre_cat" : null} to='/' onClick={() => _changeCategory('')}>
              <span style={{ fontSize: '25px' }}>전체 보기</span>
            </Link>
            <div>
              {!edit ? <input className='category_edit'  type='button' value='Edit' onClick={() => this.setState({ edit: !edit })} />
                : <input className='category_edit' type='button' value='Done' onClick={() => this.setState({ edit: !edit })} />
              }
            </div>
          </li>
          <hr />
          {category.length > 0 ?
            category.map((el, key) => {
              if (!edit) {
                return (
                  <li key={key}>
                    <Link className={pre_cat === el.id ? "pre_cat" : null} to='/' onClick={() => _changeCategory(el.id)}>
                      {el.name}
                    </Link>
                  </li>
                )
              }
              else {
                return (
                  <li key={key}>
                    <input id='category_modi' type='text' maxLength='20' name={'modify_' + el.id} defaultValue={el.name} />
                    <input className='category_manage' type='button' value='삭제' onClick={() => this._removeCategory(el)} />
                    <input className='category_manage' type='button' value='수정' onClick={() => this._modifyCategory(el)} />
                  </li>
                )
              }
            })
            : null
          }
          {!edit ? null :
            <div style={{ textAlign: 'center' }}>
              <input id='category_add' type='button' value='카테고리 추가' onClick={() => this._addCategory()} />
            </div>
          }
        </ul>
      </div>
    );
  }
}

export default category;