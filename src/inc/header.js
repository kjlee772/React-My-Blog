import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class header extends Component {
  _goHead = function () {
    window.location.href = '/';

    sessionStorage.removeItem('page')
    sessionStorage.removeItem('reply')
    sessionStorage.setItem('category', '')
  }

  render() {
    return (
      <div id='header_div' >
        <Route path='/' />
        <p id='header_p'
          onClick={() => this._goHead()}>
          <b style={{ cursor: 'pointer' }}>아무개 블로그</b>
        </p>
      </div>
    );
  }
}

export default header;