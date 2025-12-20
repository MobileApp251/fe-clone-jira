import * as Google from "expo-auth-session/providers/google";
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import LottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from '@/constants/theme';
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Platform.select({
      ios: '533414330142-jr6nu65hm55u5lfjbm3ce6capa6lpd6k.apps.googleusercontent.com',
      android: '533414330142-uiipgttob8ocai8ld3gmrgg559sn3gab.apps.googleusercontent.com',
    }),
    scopes: ['profile', 'email'],
    redirectUri: makeRedirectUri({ scheme: 'clonejira' }),
  });

  if (request) {
    console.log('REDIRECT:', request.redirectUri);
  }

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.authentication?.accessToken;

      console.log('TOKEN:', accessToken);

      Alert.alert('Success', 'Login with Google', [
        { text: 'OK', onPress: handleContinueLogin },
      ]);
    }
    if (response?.type === "error") {
      console.log(response.error);
      Alert.alert('Error', 'Login with Google failed.')
    }
  }, [response]);

  const handleContinueLogin = () => {
    router.replace('/dashboard')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.topBar}>
        <Text style={styles.headerText}>CloneJira</Text>
      </View>

      <View style={styles.content}>
        <LottieView
          source={require('../../assets/animations/register.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => promptAsync()}
        >
          <Image
            source={require('@/assets/images/icons8-google-48.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.loginButtonText}>
            Login with Google account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContinueLogin}>
          <Text>Continue without login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  animation: {
    height: '30%',
    width: '70%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 200,
    color: Colors.light.text_primary,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
    backgroundColor: Colors.light.primary,
    padding: 16,
    paddingLeft: 40,
    paddingRight: 40,
    borderRadius: 20,
    marginTop: 20,
  },
  googleIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    backgroundColor: 'white',
    borderRadius: 50
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 16,
  },
  topBar: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 2,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    color: Colors.light.primary,
  },
});