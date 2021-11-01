import React, { Component } from 'react';
import './main.css';

import { Route, Switch } from 'react-router-dom';
import { List, Write, View, Signup } from './index.js';

import { Right_Write } from './right/index.js';
import { Category } from './left/index.js';

class main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      category: '',
      category_change: false,
      contents: '',
      title: '',
    }
  }

  _fixCategory = function () {
    const category = sessionStorage.getItem('category');
    this.setState({ category: category });
  }

  _changeCategory = (target) => {
    this.setState({ category: target });
    sessionStorage.setItem('category', target);
  }

  _withProps = function (Component, props) {
    return function (matchProps) {
      return <Component {...props} {...matchProps} />
    }
  }
  _changeState = () => {
    this.setState({ category_change: true })
  }

  _getContents = (val) => {
    const contents = val.trim();

    this.setState({ contents: contents })
  }
  _getTitles = () => {
    const title = document.getElementsByName('title')[0].value.trim();

    this.setState({ title: title })
  }

  render() {
    const { _changeCategory, _changeState, _getContents, _getTitles } = this;
    const { contents, title } = this.state;
    const { login, admin, user_ip, category_data, select_category, _selectCategoryData } = this.props;

    return (
      <div className='Mains'>
        <div id='Mains-left'>
          {/* 변경 전 <Route path='/' component={Category} exact/> */}

          <Category _changeCategory={_changeCategory}
            login={login}
            _changeState={_changeState}
            admin={admin}
            user_ip={user_ip}
            exact />
        </div>

        <div>
          <Switch>
            <Route path='/'
              component={this._withProps(List, { category: this.state.category })}
              exact />
          </Switch>

          <Route path='/write/modify/:data'
            component={this._withProps(Write, {
              _getContents: _getContents,
              _getTitles: _getTitles,
              contents: contents,
              title: title
            })} />


          <Route path='/write'
            component={this._withProps(Write, {
              _getContents: _getContents,
              _getTitles: _getTitles,
              contents: contents,
              title: title
            })} exact />

          <Route path='/signup'
            component={Signup}
          />

          <Route path='/view/:data'
            component={this._withProps(View, {
              admin: admin
            })} />
        </div>

        <div id='Mains-right'>
          <Switch>
            <Route path='/write/modify/:data'
              component={this._withProps(Right_Write, {
                contents: contents,
                category: category_data,
                select_category: select_category,
                _selectCategoryData: _selectCategoryData
              })} />

            <Route path='/write'
              component={this._withProps(Right_Write, {
                contents: contents,
                category: category_data,
                select_category: select_category,
                _selectCategoryData: _selectCategoryData
              })} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default main;