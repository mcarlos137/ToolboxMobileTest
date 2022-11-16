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
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [token, setToken] = useState('');
  const [type, setType] = useState('');

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
        storeData('token', json.token)
        storeData('type', json.type)
        setToken(json.token)
        setType(json.type)
      })
      .catch(error => {
        console.log('LOGIN_STATUS' + ' ' + error)
        //dispatch({ type: 'LOGIN_STATUS', payload: error.message });
      });
  }

  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.status);
    }
    return response;
  }

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      // saving error
    }
  }

  const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  }

  React.useEffect(() => {
    console.log('token: ', token)
  }, [token]);

  React.useEffect(() => {
    console.log('type: ', type)
  }, [type]);

  return (
    <SafeAreaView
    //style={backgroundStyle}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {(getData('type') === undefined || getData('type') === null || getData('type') === '') &&
        <View
        //contentInsetAdjustmentBehavior="automatic"
        //style={backgroundStyle}
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
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: 'rgb(181, 52, 45)',
                padding: 7,
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
          {/*<Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>*/}
        </View>}
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
});

export default App;
