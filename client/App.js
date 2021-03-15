import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';

import { NavigationContainer } from '@react-navigation/native';
import AppStackScreens from './src/stacks/AppStackScreens';




const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});



const store = createStore(rootReducer, applyMiddleware(thunk))

export default function App() {
  const windowHeight = useWindowDimensions().height;

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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

