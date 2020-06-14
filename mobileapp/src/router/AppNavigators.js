import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import InitialScreen from '../screens/InitialScreen';
import GeneralCallScreen from '../screens/GeneralCallScreen';
import GuitarPianoCallScreen from '../screens/GuitarPianoCallScreen';
import BassVoiceCallScreen from '../screens/BassVoiceCallScreen';
import DrumCallScreen from '../screens/DrumCallScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import MeetingScreen from '../screens/MeetingScreen';


const AuthStack = createStackNavigator({
    Initial: {
        screen: InitialScreen,
    },
    Meeting: {
        screen: MeetingScreen,
    },
    ForgotPassword: {
        screen: ForgotPasswordScreen,
    },
    NewPassword: {
        screen: NewPasswordScreen,
    },
    GeneralCall: {
        screen: GeneralCallScreen
    },
    GuitarPianoCall: {
        screen: GuitarPianoCallScreen
    },
    BassVoiceCall: {
        screen: BassVoiceCallScreen
    },
    DrumCall: {
        screen: DrumCallScreen
    }
}, {
    headerMode: 'none',
    defaultNavigationOptions: {
        gesturesEnabled: false,
    }
});

const switchNavigator = createSwitchNavigator({
    Auth: {
        screen: AuthStack
    }
}, {
    initialRouteName: 'Auth'
});

export default switchNavigator;