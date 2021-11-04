import React, { Component } from 'react';
import './main.css';
import { Route, Switch } from 'react-router-dom';
import { Category } from './left/index.js';
import { Add_Modify_Board } from './right/index.js';
import { List, Write, View, } from './index.js';

class main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category_change: false,
      contents: '',
      title: '',
      user_id: 1,
      list_data: [],
      list_page: 1,
      list_limit: 10,
      list_all_page: [],
      list_search: '',
      category: [],
      category_data: [],
      select_category: '',
    }
  }
  _withProps = function (Component, props) {
    return function (matchProps) {
      return <Component {...props} {...matchProps} />
    }
  }

  render() {
    const { user_id } = this.props;

    return (
      <div style={{ height: '100%', display: 'flex' }}>
        <div style={{ width: '20%' }}>
          <Category exact />
        </div>

        <div id='main_'>
          <Switch>
            <Route path='/'
              component={this._withProps(List, { user_id })}
              exact />
          </Switch>

          <Route path='/write/modify/:data'
            component={this._withProps(Write, { user_id })} exact />

          <Route path='/write'
            component={this._withProps(Write, { user_id })} exact />

          <Route path='/view/:data'
            component={this._withProps(View, { user_id })} exact />
        </div>

        <div style={{ width: '20%' }}>
          <Switch>
            <Route path='/write/modify/:data'
              component={this._withProps(Add_Modify_Board, { user_id })} />

            <Route path='/write'
              component={this._withProps(Add_Modify_Board, { user_id })} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default main;