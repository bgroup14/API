import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import authReducer from './store/reducers/auth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppStackScreens from './src/stacks/AppStackScreens';
import LoginScreenTest from './src/screens/LoginScreen';

import HobbiesScreen from './src/screens/HobbiesScreen';
import HobbiesStackScreens from './src/stacks/HobbiesStackTest';


//<AppStackScreens />

const rootReducer = combineReducers({
  auth: authReducer
});

//can add this to  NavigationContainer theme={MyTheme} 
// const MyTheme = { 
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: '#f2f2f2',
//   },
// }

const store = createStore(rootReducer, applyMiddleware(thunk))

export default function App() {
  return (

    <Provider store={store}>
      <NavigationContainer  >
        <AppStackScreens />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

