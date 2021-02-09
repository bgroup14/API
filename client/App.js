import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import authReducer from './store/reducers/auth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import { NavigationContainer } from '@react-navigation/native';
import AppStackScreens from './src/stacks/AppStackScreens';




const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer)

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppStackScreens />
      </NavigationContainer>
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
