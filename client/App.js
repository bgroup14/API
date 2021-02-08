import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import authReducer from './store/reducers/auth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';


const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer)

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Login />
        <Register />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
