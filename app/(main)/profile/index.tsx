import { useGoogleAuth } from '@/auth/GoogleAuthContext';
import { getUserProfile } from '@/auth/sign-in';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { ChevronsLeftIcon, Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { User } from '@/utils/userType';
import { useRouter } from 'expo-router';
import { LogOut, User2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function Profile() {
    const router = useRouter();
    const [profile, setProfile] = useState<User>({
        email: "",
        uid: "",
        username: "",
    })
    const { signOut } = useGoogleAuth();

    useEffect(() => {
        handleGetProfile()
    }, []);

    const handleGetProfile = async () => {
        try {
            const res = await getUserProfile();
            setProfile(res);
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogOut = async () => {
        signOut();
        router.replace("/login");
    }

    return (
        <View className="flex-1">
            <Box className='mx-6 flex-row justify-start'>
                <Button className='bg-white p-0' onPress={() => router.back()}>
                    <ButtonIcon className='text-lightPrimary font-semibold text-xl' as={ChevronsLeftIcon} />
                    <ButtonText className='text-lightPrimary font-semibold text-xl'>Back</ButtonText>
                </Button>
            </Box>

            <Box className='mx-6 mb-4 flex-row justify-center'>
                <Text className='text-2xl font-extrabold text-lightPrimary'>User Profile</Text>
            </Box>
            <VStack className='items-center'>
                <Box className="w-[89px] h-[89px] rounded-full bg-lightPrimaryLight items-center justify-center">
                    <Icon as={User2} className="stroke-lightPrimary" size="xl" />
                </Box>
                <Heading size="sm" className="text-bold mb-2 text-center text-darkTextPrimary">
                    {profile.email}
                </Heading>
                <Button variant="solid" size="md" action="positive" className='max-w-fit' onPress={handleLogOut}>
                    <ButtonIcon as={LogOut} className="mr-2 text-white" />
                    <ButtonText className='text-white'>Log out</ButtonText>
                </Button>
            </VStack>

        </View>
    );
}
