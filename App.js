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
  Alert,
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
        storeData('authorization', json.type + ' ' + json.token)
        setAuthorization(json.type + ' ' + json.token)
      })
      .catch(error => {
        Logout()
        Alert.alert(error, [
          { text: 'Ok' }
        ]);
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
        setData(json)
      })
      .catch(error => {
        Logout()
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
    storeData('authorization', '')
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
      if (value !== null && value !== '' && key === 'authorization') {
        setAuthorization(value)
      }
    } catch (e) {
      // error reading value
    }
  }

  React.useEffect(() => {
    if (authorization !== '') {
      getData()
    }
  }, [authorization]);

  /*React.useEffect(() => {
    console.log('data', data)
  }, [data]);*/

  React.useEffect(() => {
    getStoredData('authorization')
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
              style={styles.loginButton}
              onPress={() => {
                Login()
              }}
            >
              <Text
                style={styles.loginButtonText}
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
                  style={styles.itemTitleText}
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
            style={styles.logoutButton}
            onPress={() => {
              Logout()
            }}
          >
            <Text
              style={styles.logoutButtonText}
            >
              LOGOUT
            </Text>
          </TouchableOpacity>
        </View>}
      {(currentVideoUrl !== '') &&
        <>
          <>
            <TouchableOpacity
              onPress={() => {
                setCurrentVideoUrl('')
              }}
            >
              <Text
                style={styles.backButtonText}
              >
                {'< ' + 'Back'}
              </Text>
            </TouchableOpacity>
          </>
          <Video source={{ uri: currentVideoUrl }}   // Can be a URL or a local file.
            resizeMode='cover'
            style={styles.video}
            controls={true}
          />
        </>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: 'rgb(181, 52, 45)',
    padding: 9,
    borderRadius: 5
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  itemTitleText: {
    fontSize: 18,
    fontWeight: '600'
  },
  logoutButton: {
    backgroundColor: 'white',
    borderColor: 'rgb(181, 52, 45)',
    borderWidth: 1,
    padding: 7,
    borderRadius: 5,
    alignSelf: 'center'
  },
  logoutButtonText: {
    color: 'rgb(181, 52, 45)',
    fontWeight: '600'
  },
  backButtonText: {
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 5
  },
  video: {
    width: 400,
    height: 300,
    alignSelf: 'center'
  },
});

export default App;
