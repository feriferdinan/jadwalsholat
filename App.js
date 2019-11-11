import React, { Component } from 'react';
import { View, StatusBar } from 'react-native'
import Index from './src/Index'

export default class App extends Component {
  render() {
    return (
      <View style={{ flex: 1 }} >
        <StatusBar backgroundColor="#057130" barStyle="light-content" />
        <Index />
      </View>

    );
  }
};
