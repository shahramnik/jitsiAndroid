import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import switchNavigator from './AppNavigators';
import {YellowBox} from 'react-native';

const App = createAppContainer(switchNavigator);
console.disableYellowBox = true

export default class Navigator extends Component {
    render() {
        return (
            <App ref={(ref) => { this.navigator = ref; }} />
        );
    }
}
