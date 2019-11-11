import React, { Component } from 'react';
import { Main, SelectLocation } from "./components/screens"
import { createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const MainStack = createStackNavigator({
    main: {
        screen: Main,
        navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },
    SelectLocation: { screen: SelectLocation },
});

const AppContainer = createAppContainer(MainStack);




export default class Index extends Component {
    render() {
        return <AppContainer />
    }
}