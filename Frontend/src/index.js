import React from 'react';
import ReactDOM from 'react-dom';
import StartForm from './components/StartForm';
import Register from './components/Register';
import Main from './components/Main/Main';
import admin from './components/Admin/admin';
import './index.css';
import {Provider} from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import store from './stores/store';

const Root = () => {
  return (
    <Provider store={store}>
      <div className="container container1">
        <Router history={browserHistory}>
          <Route path="/" component={StartForm}/>
          <Route path="/register" component={Register} />
          <Route path="/Main/main" component={Main} />
          <Route path="/Main/admin" component={admin} />
        </Router>
      </div>
    </Provider>
  )
}


ReactDOM.render(<Root />, document.getElementById('root'));