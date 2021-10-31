import React, { Component } from 'react';
import queryString from 'query-string';

class test extends Component {
  constructor(props) {
    super(props)
    console.log(this.props);
  }

  render() {
    return (
        <div>
            <h3> This is test page </h3>
        </div>
    );
  }
}

export default test;