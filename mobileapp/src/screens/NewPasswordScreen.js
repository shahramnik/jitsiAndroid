import React from 'react';
import { Platform, Linking, Dimensions, View, TouchableOpacity, Text, TextInput, ScrollView, ImageBackground, StatusBar, KeyboardAvoidingView } from 'react-native';
//import NetInfo from "@react-native-community/netinfo";
import { Chase } from 'react-native-animated-spinkit'
import URL from '../router/url';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class NewPasswordScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            password: '',
            width: WIDTH,
            height: HEIGHT,
            isCononected: false,
            isLoading: false,
            errorMessage: '',
        }
    }

    // componentDidMount() {
    //     this.unsubscribe = NetInfo.addEventListener(state => {
    //         this.setState({ isCononected: state.isInternetReachable });
    //     });
    //     if (Platform.OS === 'android') {
    //         Linking.getInitialURL().then(url => {
    //             this.handleLessonID(url);
    //         });
    //     }
    //     Linking.addEventListener('url', this.handleOpenURL);
    // }

    // componentWillUnmount() {
    //     this.unsubscribe();
    //     Linking.removeEventListener('url', this.handleOpenURL);
    // }

    // handleOpenURL = (event) => {
    //     this.handleLessonID(event.url);
    // }

    // handleLessonID = (url) => {
    //     if (url) {
    //         const route = url.split('/');

    //         if (route[3]) {
    //             var lessonID = route[3].substr(0, 11);

    //             this.setState({ lessonID });
    //         }
    //     }
    // }

    _doCall = () => {
        const { otp, password, isCononected } = this.state;

        if (otp == '' || password == '') {
            this.setState({ errorMessage: 'Email and Password Should not be empty.' });
        } else {
            this.setState({ errorMessage: '' });
            this.props.navigation.navigate('Meeting');
            // var data = {
            //     email,
            //     password,
            //     data: {}
            // };
            // this.props.navigation.navigate('DrumCall', { ...data });
            // if (isCononected == true) {
            //     this.setState({ isLoading: true });
            //     console.log(URL.Base_URL + 'room/' + lessonID);
            //     fetch(URL.Base_URL + 'room/' + lessonID)
            //         .then((response) => response.json())
            //         .then((json) => {
            //             console.log('json', json);
            //             this.setState({ isLoading: false });
            //             if (json.code == 1) {
            //                 var data = {
            //                     name,
            //                     password,
            //                     data: json.data
            //                 };
            //                 if (json.data.room_type == 'Guitar' || json.data.room_type == 'Ukulele' || json.data.room_type == 'Piano') {
            //                     this.props.navigation.navigate('GuitarPianoCall', { ...data });
            //                 } else if (json.data.room_type == 'Bass' || json.data.room_type == 'Voice') {
            //                     this.props.navigation.navigate('BassVoiceCall', { ...data });
            //                 } else if (json.data.room_type == 'General') {
            //                     this.props.navigation.navigate('GeneralCall', { ...data });
            //                 } else if (json.data.room_type == 'Drum') {
            //                     this.props.navigation.navigate('DrumCall', { ...data });
            //                 } else {
            //                     this.setState({ errorMessage: 'Something went wrong.' });
            //                 }
            //             } else {
            //                 this.setState({ errorMessage: json.message });
            //             }
            //         })
            //         .catch((error) => {
            //             this.setState({ errorMessage: 'Something went wrong.', isLoading: false });
            //         });
            // } else {
            //     this.setState({ errorMessage: 'Please check your internet connection.' });
            // }
        }
    }

    render() {
        const { otp, password, width, height, isLoading, errorMessage } = this.state;

        return (
            <View style={{ flex: 1, }}>
                <StatusBar
                    hidden={true}
                />

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='handled'
                >

                    <View style={{paddingBottom:'50%', width: width, height: height, justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 15 }}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            style={{ flex: 1, justifyContent: 'center' }}
                        >
                            <View style={{ alignSelf: 'center', justifyContent: 'center', marginBottom: 40 }}>
                                <Text style={{ color: 'black', fontSize: 30, fontWeight: '700' }}>Create New Password</Text>
                            </View>
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ color: 'black', fontSize: 18, marginBottom: 20 }}>Enter OTP</Text>
                                <TextInput
                                    placeholder='Enter 6 Digit Code Sent To Your Email'
                                    placeholderTextColor='#484f57'
                                    style={{ height: 50, borderColor: 'grey', borderWidth: 1, borderRadius: 5, paddingHorizontal: 15, color: '#484f57' }}
                                    onChangeText={(otp) => this.setState({ otp })}
                                    keyboardType={'numeric'}
                                    maxLength={6}
                                    value={otp}
                                    returnKeyType={"next"}
                                    //  onSubmitEditing={() => { this.lessonIDTextInput.focus(); }}
                                    blurOnSubmit={false}
                                />
                            </View>
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ color: 'black', fontSize: 18, marginBottom: 20 }}>New Password</Text>
                                <TextInput
                                    ref={(input) => { this.lessonIDTextInput = input; }}
                                    secureTextEntry
                                    placeholder='Enter New Password'
                                    placeholderTextColor='#484f57'
                                    style={{ height: 50, borderColor: 'grey', borderWidth: 1, borderRadius: 5, paddingHorizontal: 15, color: '#484f57' }}
                                    onChangeText={(password) => this.setState({ password })}
                                    value={password}
                                />
                            </View>
                            <Text style={{ color: 'red', fontSize: 16 }}>{errorMessage}</Text>
                            <View style={{ paddingVertical: 10, flexDirection: 'row', }}>
                                <TouchableOpacity onPress={() => this._doCall()}
                                    style={{ backgroundColor: '#007bff', borderRadius: 5, paddingVertical: 10, width: '100%' }}>
                                    <Text style={{ color: 'white', fontSize: 18, alignSelf: 'center' }}>Submit</Text>

                                </TouchableOpacity>

                            </View>

                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
                {isLoading &&
                    <View style={{ position: 'absolute', height: HEIGHT, width: WIDTH, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <Chase size={50} color="#FFF" />
                    </View>
                }
            </View>

        );
    }
}

export default NewPasswordScreen;
