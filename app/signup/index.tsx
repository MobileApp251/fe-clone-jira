
import { signUp } from '@/auth/sign-up';
import { Box } from '@/components/ui/box';
import { Input, InputField } from '@/components/ui/input';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SignUp() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            router.replace("/dashboard");
        } catch (err) {
            console.error(err);
        }
    };

    const handleBack = async() => {
        router.back();
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.topBar}>
                <Text style={styles.headerText}>CloneJira</Text>
            </View>
            <Box className='flex-1 p-4 items-center justify-center'>
                <Text className="font-bold text-3xl mb-6 text-lightPrimary text-center">
                    Sign Up
                </Text>
                <Input className="h-14 mb-4 rounded-lg border-lightPrimary">
                    <InputField
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        className="text-darkTextPrimary text-lg"
                    />
                </Input>
                <Input className="h-14 mb-12 rounded-lg border-lightPrimary">
                    <InputField
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        className="text-darkTextPrimary text-lg"
                    />
                </Input>

                <TouchableOpacity
                    onPress={handleSignUp}
                    className="w-4/5 flex-row justify-center items-center rounded-2xl bg-lightPrimary py-3 mb-4"
                >
                    <Text className="text-white font-bold text-lg">Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleBack}
                    className="w-4/5 flex-row justify-center items-center rounded-2xl border border-lightPrimary py-3"
                >
                    <ChevronLeft color="#0F55A1" />
                    <Text className="text-lightPrimary font-bold text-lg ml-2">Back</Text>
                </TouchableOpacity>
            </Box>
        </KeyboardAvoidingView>
    );
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
        backgroundColor: Colors.light.primary,
        padding: 12,
        paddingLeft: 40,
        paddingRight: 40,
        borderRadius: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: '80%',
        gap: 40,
        borderWidth: 1,
        borderColor: Colors.light.primary,
        padding: 12,
        paddingLeft: 40,
        paddingRight: 40,
        borderRadius: 20,
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