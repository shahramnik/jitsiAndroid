import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Image, StatusBar } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import database from '@react-native-firebase/database';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Pdf from 'react-native-pdf';
import URL from '../router/url';
import { _doShare } from '../router/helper';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const STATUSBAR_HEIGHT = getStatusBarHeight(true);
const TABICON = [
    require('../assets/image/user-icon.png'),
    require('../assets/image/sheetmusic.png'),
    require('../assets/image/Bass.png')
];
const initialLayout = { width: WIDTH };

class BassVoiceCallScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.getParam('data', {}),
            index: 0,
            routes: [
                { key: 'Teacher', title: 'Teacher' },
                { key: 'SheetMusic', title: 'Sheet Music', webUrl: '', fileUri: '', OrientationStatus: '' }
            ],
            OrientationStatus: '',
            Height_Layout: '',
            Width_Layout: '',
        }
        this.onConferenceTerminated = this.onConferenceTerminated.bind(this);
        this.onConferenceJoined = this.onConferenceJoined.bind(this);
        this.onConferenceWillJoin = this.onConferenceWillJoin.bind(this);
    }

    componentDidMount() {
        const name = this.props.navigation.getParam('name', 'Test');
        const lessonID = this.props.navigation.getParam('lessonID', '');
        const url = URL.CallingURL + lessonID;
        const userInfo = { displayName: name, email: 'user@gmail.com', avatar: 'https:/gravatar.com/avatar/abc123' };
        JitsiMeet.call(url, userInfo);

        database()
            .ref('/songs')
            .on('value', snapshot => {
                const data = snapshot.val();
                songUrl = '';
                if (data[lessonID]) {
                    songUrl = data[lessonID].song;
                }
                this.setState({
                    routes:
                        [
                            { key: 'Teacher', title: 'Teacher' },
                            { key: 'SheetMusic', title: 'Sheet Music', webUrl: songUrl, fileUri: this.state.routes[1].fileUri, OrientationStatus: this.state.routes[1].OrientationStatus }
                        ]
                });
            });
    }

    DetectOrientation() {
        if (this.state.Width_Layout > this.state.Height_Layout) {
            this.setState({
                OrientationStatus: 'Landscape',
                routes:
                    [
                        { key: 'Teacher', title: 'Teacher' },
                        { key: 'SheetMusic', title: 'Sheet Music', webUrl: this.state.routes[1].webUrl, fileUri: this.state.routes[1].fileUri, fileUri: this.state.routes[1].fileUri, OrientationStatus: 'Landscape' }
                    ]
            });
        }
        else {
            this.setState({
                OrientationStatus: 'Portrait',
                routes:
                    [
                        { key: 'Teacher', title: 'Teacher' },
                        { key: 'SheetMusic', title: 'Sheet Music', webUrl: this.state.routes[1].webUrl, fileUri: this.state.routes[1].fileUri, OrientationStatus: 'Portrait' }
                    ]
            });
        }
    }

    CallRoute = () => {
        return (
            <View style={{ backgroundColor: 'black', flex: 1 }}>
                <JitsiMeetView
                    onConferenceTerminated={this.onConferenceTerminated}
                    onConferenceJoined={this.onConferenceJoined}
                    onConferenceWillJoin={this.onConferenceWillJoin}
                    style={{ flex: 1, height: '100%', width: '100%' }}
                />
            </View>
        )
    }

    MusicRoute = ({ route }) => {
        return (
            <View style={[styles.scene]}>
                <Pdf
                    source={{ uri: route.webUrl }}
                    onLoadComplete={(numberOfPages, filePath) => {
                        console.log(`number of pages: ${numberOfPages}`);
                        this.setState({
                            routes:
                                [
                                    { key: 'Teacher', title: 'Teacher' },
                                    { key: 'SheetMusic', title: 'Sheet Music', webUrl: this.state.routes[1].webUrl, fileUri: filePath, OrientationStatus: this.state.routes[1].OrientationStatus }
                                ]
                        });
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link presse: ${uri}`)
                    }}
                    enablePaging={true} 
                    scale={route.OrientationStatus == 'Portrait' ? 1.0 : 1.5}
                    style={[{ height: '100%', width: '100%' }]}
                />
                {route.fileUri != '' &&
                    <TouchableOpacity onPress={() => _doShare(route.fileUri, 'pdf')} style={{ position: 'absolute', bottom: (HEIGHT * 5 / 100), right: (WIDTH * 5 / 100) }}>
                        <View style={{ backgroundColor: 'lightgray', padding: 10, borderRadius: 50 }}>
                            <Image
                                source={require('../assets/image/share.png')}
                                style={{ height: 32, width: 32 }}
                            />
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    onConferenceTerminated(nativeEvent) {
        this.props.navigation.goBack();
    }

    onConferenceJoined(nativeEvent) {

    }

    onConferenceWillJoin(nativeEvent) {

    }

    onTabPress = async (i) => {
        this.setState({ index: i });
    }

    _renderTabBar = props => {
        const { data } = this.state;

        return (
            <View style={[styles.tabBar, { paddingTop: this.state.OrientationStatus == 'Portrait' ? STATUSBAR_HEIGHT : 0 }]}>
                {props.navigationState.routes.map((route, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            style={styles.tabItem}
                            onPress={() => this.onTabPress(i)}>
                            <View style={{ backgroundColor: this.state.index == i ? '#007bff' : 'white', padding: 10, borderRadius: 50 }}>
                                <Image
                                    source={(data.room_type == 'Bass' && i == 1) ? TABICON[2] : TABICON[i]}
                                    style={{ height: 30, width: 30, tintColor: this.state.index == i ? 'white' : 'black' }}
                                    resizeMode='contain'
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    render() {
        const { index, routes } = this.state;

        const renderScene = SceneMap({
            Teacher: this.CallRoute,
            SheetMusic: this.MusicRoute
        });

        return (
            <View style={{ backgroundColor: 'white', flex: 1 }}
                onLayout={(event) => this.setState({
                    Width_Layout: event.nativeEvent.layout.width,
                    Height_Layout: event.nativeEvent.layout.height
                }, () => this.DetectOrientation())}
            >
                <StatusBar
                    hidden={true}
                />
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    renderTabBar={this._renderTabBar}
                    onIndexChange={(index) => this.onTabPress(index)}
                    initialLayout={initialLayout}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f4ff' },
    scene: { flex: 1 },
    tabBar: { backgroundColor: 'black', flexDirection: 'row', justifyContent: 'center' },
    tabItem: { backgroundColor: 'transparent', flex: 1, alignItems: 'center', padding: 16, },
    tabBarTitle: { color: '#007bff' },
    activeTabSeparator: { padding: 2, borderRadius: 8, backgroundColor: '#007bff', marginTop: 5 },
});

export default BassVoiceCallScreen;