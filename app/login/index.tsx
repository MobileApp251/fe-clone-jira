
import { useGoogleAuth } from '@/auth/GoogleAuthContext';
import { signIn as signInWithEmail } from '@/auth/sign-in';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    AppState,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function Login() {
    const router = useRouter();

    const { user, isLoading, signIn } = useGoogleAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [waitingForAuth, setWaitingForAuth] = useState(false);

    useEffect(() => {
        const sub = AppState.addEventListener("change", state => {
            if (state === "active") {
                setWaitingForAuth(true)
            }
        });
        return () => sub.remove();
    }, []);

    useEffect(() => {
        if (!isLoading && user) {
            router.replace("/dashboard");
        }
    }, [user, isLoading, router]);

    if (waitingForAuth || isLoading) {
        return (
            <Box className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </Box>
        );
    }

    const handleSignUp = async () => {
        router.push("/signup");
    };

    const handleSignInWithGoogle = async () => {
        try {
            await signIn();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSignInWithEmail = async () => {
        try {
            await signInWithEmail(email, password);
            router.replace("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    const handleState = () => {
        setShowPassword((showState) => {
            return !showState;
        });
    };

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
            </View>
            <LinearGradient
                style={{
                    height: '60%',
                    width: '100%',
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    overflow: 'hidden',
                }}
                colors={['#8637CF', '#0F55A1']}
                start={[0, 1]}
                end={[1, 0]}
            >
                <Box className='h-[60%] p-4 items-center '>
                    <Text className="font-bold text-3xl mb-6 text-white text-center">
                        Sign in
                    </Text>
                    <Text className="font-bold text-3xl mb-6 text-white text-center">
                        {user?.name}
                    </Text>
                    <Input className="h-14 mb-4 rounded-lg bg-white border-white">
                        <InputField
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            className="text-darkTextPrimary text-lg"
                        />
                    </Input>
                    <Input className="h-14 mb-2 rounded-lg bg-white border-white">
                        <InputField
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Password"
                            className="text-darkTextPrimary text-lg"
                            type={showPassword ? 'text' : 'password'}
                        />
                        <InputSlot className="pr-3" onPress={handleState}>
                            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                        </InputSlot>
                    </Input>

                    <HStack className="w-full justify-between mb-6">
                        <TouchableOpacity onPress={handleSignUp} >
                            <Text className="text-white font-medium">Sign Up</Text>
                        </TouchableOpacity>
                    </HStack>

                    <TouchableOpacity style={styles.loginButton} onPress={handleSignInWithEmail}>
                        <Text style={styles.loginButtonText}>
                            Login
                        </Text>
                    </TouchableOpacity>

                    <Box className="w-[80%] flex-row items-center my-4 px-6">
                        <Box className="flex-1 h-[1px] bg-white/40" />
                        <Text className="mx-3 text-white font-semibold">OR</Text>
                        <Box className="flex-1 h-[1px] bg-white/40" />
                    </Box>

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleSignInWithGoogle}
                    >
                        <Image
                            source={require('@/assets/images/icons8-google-48.png')}
                            style={styles.googleIcon}
                        />
                        <Text style={styles.loginButtonText}>
                            Login with Google
                        </Text>
                    </TouchableOpacity>
                </Box>
            </LinearGradient>
        </KeyboardAvoidingView>)
}


const styles = StyleSheet.create({
    animation: {
        height: '70%',
        width: '70%',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    loginButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        gap: 40,
        backgroundColor: 'white',
        padding: 12,
        paddingLeft: 40,
        paddingRight: 40,
        borderRadius: 20,
    },
    googleIcon: {
        width: 40,
        height: 40,
        resizeMode: "contain",
        backgroundColor: 'white',
        borderRadius: 50
    },
    loginButtonText: {
        color: Colors.light.primary,
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