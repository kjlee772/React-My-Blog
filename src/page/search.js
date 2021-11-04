import React, { Component } from 'react';
import './main.css';

class search extends Component {
  render() {
    const { search } = this.props;

    return (
      <div style={{ textAlign: 'center' }}>
        <form>
          <input type='text' autoComplete='off' maxLength='20'
            className='search_input' name='search'
            placeholder='검색어를 입력해주세요.'
            defaultValue={search}
          />
          <input style={{ fontFamily: 'retro', cursor: 'pointer' }}
            type='submit' value='검색' />
        </form>
      </div>
    );
  }
}

export default search;