// import React from 'react';
// import { Platform, Linking, Dimensions, View, TouchableOpacity, Text, TextInput, ScrollView, ImageBackground, StatusBar, KeyboardAvoidingView } from 'react-native';
// import NetInfo from "@react-native-community/netinfo";
// import { Chase } from 'react-native-animated-spinkit'
// import URL from '../router/url';

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;

// class InitialScreen extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: '',
//             lessonID: '',
//             width: WIDTH,
//             height: HEIGHT,
//             isCononected: false,
//             isLoading: false,
//             errorMessage: '',
//         }
//     }

//     componentDidMount() {
//         this.unsubscribe = NetInfo.addEventListener(state => {
//             this.setState({ isCononected: state.isInternetReachable });
//         });
//         if (Platform.OS === 'android') {
//             Linking.getInitialURL().then(url => {
//                 this.handleLessonID(url);
//             });
//         }
//         Linking.addEventListener('url', this.handleOpenURL);
//     }

//     componentWillUnmount() {
//         this.unsubscribe();
//         Linking.removeEventListener('url', this.handleOpenURL);
//     }

//     handleOpenURL = (event) => {
//         this.handleLessonID(event.url);
//     }

//     handleLessonID = (url) => {
//         if (url) {
//             const route = url.split('/');

//             if (route[3]) {
//                 var lessonID = route[3].substr(0, 11);

//                 this.setState({ lessonID });
//             }
//         }
//     }

//     _doCall = () => {
//         const { name, lessonID, isCononected } = this.state;

//         if (name == '' || lessonID == '') {
//             this.setState({ errorMessage: 'Name and Lesson ID Should not be empty.' });
//         } else {
//             this.setState({ errorMessage: '' });
//             var data = {
//                 name,
//                 lessonID,
//                 data: {}
//             };
//             // this.props.navigation.navigate('DrumCall', { ...data });
//             if (isCononected == true) {
//                 this.setState({ isLoading: true });
//                 console.log(URL.Base_URL + 'room/' + lessonID);
//                 fetch(URL.Base_URL + 'room/' + lessonID)
//                     .then((response) => response.json())
//                     .then((json) => {
//                         console.log('json', json);
//                         this.setState({ isLoading: false });
//                         if (json.code == 1) {
//                             var data = {
//                                 name,
//                                 lessonID,
//                                 data: json.data
//                             };
//                             if (json.data.room_type == 'Guitar' || json.data.room_type == 'Ukulele' || json.data.room_type == 'Piano') {
//                                 this.props.navigation.navigate('GuitarPianoCall', { ...data });
//                             } else if (json.data.room_type == 'Bass' || json.data.room_type == 'Voice') {
//                                 this.props.navigation.navigate('BassVoiceCall', { ...data });
//                             } else if (json.data.room_type == 'General') {
//                                 this.props.navigation.navigate('GeneralCall', { ...data });
//                             } else if (json.data.room_type == 'Drum') {
//                                 this.props.navigation.navigate('DrumCall', { ...data });
//                             } else {
//                                 this.setState({ errorMessage: 'Something went wrong.' });
//                             }
//                         } else {
//                             this.setState({ errorMessage: json.message });
//                         }
//                     })
//                     .catch((error) => {
//                         this.setState({ errorMessage: 'Something went wrong.', isLoading: false });
//                     });
//             } else {
//                 this.setState({ errorMessage: 'Please check your internet connection.' });
//             }
//         }
//     }

//     render() {
//         const { name, lessonID, width, height, isLoading, errorMessage } = this.state;

//         return (
//             <ImageBackground
//                 source={require('../assets/image/jitsisplash.jpg')}
//                 style={{ flex: 1, width: '100%', alignItems: 'center' }}
//                 onLayout={(event) => {
//                     var { x, y, width, height } = event.nativeEvent.layout;

//                     if (width >= 414) {
//                         this.setState({ width: 414, height });
//                     } else {
//                         this.setState({ width, height });
//                     }
//                 }}
//             >
//                 <StatusBar
//                     hidden={true}
//                 />
//                 <ScrollView contentContainerStyle={{ flexGrow: 1 }}
//                     keyboardShouldPersistTaps='handled'
//                 >
//                     <View style={{ width: width, height: height, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 15 }}>
//                         <KeyboardAvoidingView
//                             behavior={Platform.OS == "ios" ? "padding" : "height"}
//                             style={{ flex: 1, justifyContent: 'center' }}
//                         >
//                             <View style={{ paddingVertical: 10 }}>
//                                 <Text style={{ color: 'white', fontSize: 30, fontWeight: '700' }}>Your Virtual Lesson</Text>
//                             </View>
//                             <View style={{ paddingVertical: 10 }}>
//                                 <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Your Name</Text>
//                                 <TextInput
//                                     placeholder='Your Name'
//                                     placeholderTextColor='#484f57'
//                                     style={{ height: 50, backgroundColor: 'white', borderRadius: 5, paddingHorizontal: 15, color: '#484f57' }}
//                                     onChangeText={(name) => this.setState({ name })}
//                                     value={name}
//                                     returnKeyType={"next"}
//                                     onSubmitEditing={() => { this.lessonIDTextInput.focus(); }}
//                                     blurOnSubmit={false}
//                                 />
//                             </View>
//                             <View style={{ paddingVertical: 10 }}>
//                                 <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Lesson ID</Text>
//                                 <TextInput
//                                     ref={(input) => { this.lessonIDTextInput = input; }}
//                                     placeholder='Lesson ID'
//                                     placeholderTextColor='#484f57'
//                                     style={{ height: 50, backgroundColor: 'white', borderRadius: 5, paddingHorizontal: 15, color: '#484f57' }}
//                                     onChangeText={(lessonID) => this.setState({ lessonID })}
//                                     value={lessonID}
//                                 />
//                             </View>
//                             <Text style={{ color: 'red', fontSize: 16 }}>{errorMessage}</Text>
//                             <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'center' }}>
//                                 <TouchableOpacity onPress={() => this._doCall()} style={{ backgroundColor: '#007bff', borderRadius: 5, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 20 }}>
//                                     <Text style={{ color: 'white', fontSize: 18 }}>Join Room</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </KeyboardAvoidingView>
//                     </View>
//                 </ScrollView>
//                 {isLoading &&
//                     <View style={{ position: 'absolute', height: HEIGHT, width: WIDTH, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
//                         <Chase size={50} color="#FFF" />
//                     </View>
//                 }
//             </ImageBackground>
//         );
//     }
// }

// export default InitialScreen;

//------------------

import React from 'react';
import { Platform, Linking, Dimensions, View, TouchableOpacity, Text, TextInput, ScrollView, ImageBackground, StatusBar, KeyboardAvoidingView } from 'react-native';
//import NetInfo from "@react-native-community/netinfo";
import { Chase } from 'react-native-animated-spinkit'
import URL from '../router/url';
console.disableYellowBox = true

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class InitialScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
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
        const { email, password, isCononected } = this.state;
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
       // if (email == '' || password == '') {
            if (reg.test(email) == '' || password == '') {
           // this.setState({ errorMessage: 'Email and Password Should not be empty.' });
           this.setState({ errorMessage: 'Please Enter Valid Email And Password' });
            } 
       
        
        else {
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
        const { email, password, width, height, isLoading, errorMessage } = this.state;

        return (
            // <ImageBackground
            //     source={require('../assets/image/jitsisplash.jpg')}
            //     style={{ flex: 1, width: '100%', alignItems: 'center' }}
            //     onLayout={(event) => {
            //         var { x, y, width, height } = event.nativeEvent.layout;

            //         if (width >= 414) {
            //             this.setState({ width: 414, height });
            //         } else {
            //             this.setState({ width, height });
            //         }
            //     }}
            // >
            <View style={{flex:1,}}>
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
                             <View style={{ alignSelf:'center',justifyContent: 'center',marginBottom:40 }}>
                                <Text style={{ color: 'black', fontSize: 30, fontWeight: '700' }}>Sign In</Text>
                            </View>
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ color: 'black', fontSize: 18, marginBottom: 20 }}>Email Address</Text>
                                <TextInput
                                    placeholder='Enter Email'
                                    placeholderTextColor='#484f57'
                                    style={{ height: 50,borderColor: 'grey', borderWidth: 1,borderRadius: 5, paddingHorizontal: 15, color: '#484f57' }}
                                    onChangeText={(email) => this.setState({ email })}
                                    value={email}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => { this.lessonIDTextInput.focus(); }}
                                    blurOnSubmit={false}
                                />
                            </View>
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ color: 'black', fontSize: 18, marginBottom: 20 }}>Password</Text>
                                <TextInput
                                    ref={(input) => { this.lessonIDTextInput = input; }}
                                    secureTextEntry
                                    placeholder='Enter Password'
                                    placeholderTextColor='#484f57'
                                    style={{ height: 50, borderColor: 'grey', borderWidth: 1, borderRadius: 5, paddingHorizontal: 15, color: '#484f57' }}
                                    onChangeText={(password) => this.setState({ password })}
                                    value={password}
                                />
                            </View>
                            <Text style={{ color: 'red', fontSize: 16 }}>{errorMessage}</Text>
                            <View style={{ paddingVertical: 10, flexDirection: 'row', }}>
                                <TouchableOpacity onPress={() => this._doCall()} 
                                style={{ backgroundColor: '#007bff', borderRadius: 5, paddingVertical: 10, width:'100%' }}>
                                    <Text style={{ color: 'white', fontSize: 18,alignSelf:'center' }}>Submit</Text>
                                  
                                </TouchableOpacity>
                                
                            </View>
                            <View style={{ paddingVertical: 10,  }}>
                                <TouchableOpacity onPress={() =>  this.props.navigation.navigate('ForgotPassword')} 
                                style={{ alignItems:'flex-end'  }}>
                                    <Text style={{ color: 'rgb(111,173,253)', fontSize: 15, }}>Forgot Password?</Text>
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
            // </ImageBackground>
        );
    }
}

export default InitialScreen;





