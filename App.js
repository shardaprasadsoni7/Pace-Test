import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import { connect, Provider } from 'react-redux';
import configureStore from './src/store/configureStore';
const store = configureStore()
const RouterWithRedux = connect()(Router);

import RegistrationForm from './src/components/RegistrationForm';
import List from './src/components/List';
import Detail from './src/components/Detail';


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RouterWithRedux>
          <Scene key="root">
            <Scene key="registrationForm" component={RegistrationForm} title="Registration Form" initial={true}/>
            <Scene key="list" component={List} title="List"/>
            <Scene key="detail" component={Detail} title="Detail"/>
          </Scene>
        </RouterWithRedux>
      </Provider>

    )
  }
}
