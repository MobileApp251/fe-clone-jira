import * as Google from 'expo-auth-session/providers/google';
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
import { ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '838025556290-csiqqqd721dhpupsv5pnf0aro07sfv6e.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    responseType: 'id_token',
  });
  if (request) {
  console.log('Redirect URI (tự động tạo):', request.redirectUri, " ", ResponseType.IdToken);
}

  useEffect(() => {
    console.log(response?.type)
    if (response?.type === 'success') {
      const { authentication } = response;

      console.log('ACCESS TOKEN:', authentication?.accessToken);

      Alert.alert('Thành công', 'Đã đăng nhập với Google!', [
        {
          text: 'OK',
          onPress: () => router.replace('/dashboard'),
        },
      ]);
    }

    if (response?.type === 'error') {
      console.error('Lỗi đăng nhập:', response.error);
      Alert.alert('Lỗi', 'Đăng nhập Google thất bại');
    }
  }, [response]);

  const handleLogin = async () => {
    await promptAsync();
  };
  
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
          onPress={handleLogin}
          disabled={!request}
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