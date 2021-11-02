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
      <div style={{ textAlign: 'center' }} >
        <Route path='/' />
        <p style={{ fontSize: '50px', margin: '0px', fontWeight:'bold' }} onClick={() => this._goHead()}>아무개 블로그</p>
      </div>
    );
  }
}

export default header;