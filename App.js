/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Video from 'react-native-video';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

//import { Login } from './app/apiCalls/Login'

/*const Section = ({ children, title }): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};*/

const App: () => Node = () => {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [authorization, setAuthorization] = useState('');
  const [data, setData] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const Login = () => {
    let url = 'https://echo-serv.tbxnet.com';
    let path = '/v1/mobile/auth';
    let method = 'POST';
    let body = {
      sub: 'ToolboxMobileTest',
    }
    return fetch(url + path,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    )
      .then(handleErrors)
      .then(response =>
        response.json())
      .then(json => {
        console.log("LOGIN" + ' ' + 'OK')
        setAuthorization(json.type + ' ' + json.token)
      })
      .catch(error => {
        console.log('LOGIN_STATUS' + ' ' + error)
        //dispatch({ type: 'LOGIN_STATUS', payload: error.message });
      });
  }

  const getData = () => {
    let url = 'https://echo-serv.tbxnet.com';
    let path = '/v1/mobile/data';
    let method = 'GET';
    return fetch(url + path,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'authorization': authorization
        }
      }
    )
      .then(handleErrors)
      .then(response =>
        response.json())
      .then(json => {
        console.log("GET DATA" + ' ' + 'OK')
        setData(json)
      })
      .catch(error => {
        console.log('LOGIN_STATUS' + ' ' + error)
        Alert.alert(error, [
          { text: 'Ok' }
        ]);
      });
  }

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  }

  const Logout = () => {
    setAuthorization('')
  }

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  }

  const getStoredData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        // value previously stored
      }
      console.log('saved authorization', value)
      return value
    } catch (e) {
      // error reading value
    }
  }

  React.useEffect(() => {
    storeData('authorization', authorization)
    if (authorization !== '') {
      getData()
    }
  }, [authorization]);

  React.useEffect(() => {
    console.log('data', data)
  }, [data]);

  React.useEffect(() => {
    getStoredData('authorization')
  }, []);

  /*React.useEffect(() => {
    console.log('type: ', type)
    console.log('token: ', token)
    storeData('type', type)
  }, [type]);*/

  return (
    <SafeAreaView
      style={{
      }}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {console.log('authorization', authorization)}
      {(authorization === '' && currentVideoUrl === '') &&
        <View
          style={{
            marginTop: 50
          }}
        >
          <Image
            style={{
              width: Dimensions.get('window').width
            }}
            resizeMode={'center'}
            source={require('./assets/toolbox_logo.jpg')}
          />
          <View
            style={{
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: 'rgb(181, 52, 45)',
                padding: 9,
                borderRadius: 5
              }}
              onPress={() => {
                console.log('PRESS')
                Login()
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                LOGIN
              </Text>
            </TouchableOpacity>
          </View>
        </View>}
      {(authorization !== '' && currentVideoUrl === '') &&
        <View
          style={{
            alignSelf: 'center',
            marginTop: 50
          }}
        >
          <ScrollView
            //horizontal={true}
            style={{
              maxHeight: 600
            }}
          >
            {data !== null && data.map((item, index) => (
              <View
                key={index}
                style={{
                  marginVertical: 10
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600'
                  }}
                >
                  {item.title}
                </Text>
                <ScrollView
                  horizontal={true}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: 10,
                    width: Dimensions.get('window').width * 0.9,
                    height: item.type !== 'thumb' ? 240 : 165
                  }}
                >
                  {item.items.map((it, ind) => (
                    <View
                      key={ind}
                      style={{
                        width: item.type !== 'thumb' ? 140 : 230,
                        height: item.type !== 'thumb' ? 230 : 140,
                        marginHorizontal: 10,
                        alignItems: 'center'
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          if (it.videoUrl === undefined || it.videoUrl === null || it.videoUrl === '') {
                            Alert.alert('Video no disponible', [
                              { text: 'Ok' }
                            ]);
                            return
                          }
                          setCurrentVideoUrl(it.videoUrl)
                        }}
                      >
                        <Image
                          resizeMode='stretch'
                          style={{
                            width: item.type !== 'thumb' ? 140 : 230,
                            height: item.type !== 'thumb' ? 230 : 140,
                          }}
                          source={{
                            uri: it.imageUrl,
                          }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginTop: item.type !== 'thumb' ? -20 : 0,
                          fontWeight: 'bold'
                        }}
                      >
                        {it.title}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderColor: 'rgb(181, 52, 45)',
              borderWidth: 1,
              padding: 7,
              borderRadius: 5,
              alignSelf: 'center'
            }}
            onPress={() => {
              console.log('PRESS')
              Logout()
            }}
          >
            <Text
              style={{
                color: 'rgb(181, 52, 45)',
                fontWeight: '600'
              }}
            >
              LOGOUT
            </Text>
          </TouchableOpacity>
        </View>}
      {(currentVideoUrl !== '') &&
        <View
          style={{
          }}
        >
          <View>
            <TouchableOpacity
              onPress={() => {
                setCurrentVideoUrl('')
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 20,
                  marginLeft: 5
                }}
              >
                {'< ' + 'Back'}
              </Text>
            </TouchableOpacity>
          </View>
          <Video source={{ uri: currentVideoUrl }}   // Can be a URL or a local file.
            resizeMode='cover'
            style={{
              width: 400,
              height: 300,
              alignSelf: 'center'
            }}
            controls={true}
          />
        </View>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default App;
