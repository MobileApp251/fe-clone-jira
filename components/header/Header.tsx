import { Colors } from '@/constants/theme';

import { Center } from '@/components/ui/center';
import { Divider } from '@/components/ui/divider';
import { Avatar, AvatarImage, Text } from '@gluestack-ui/themed';
import { Bell, User } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

export default function Header() {
    const userInfo = {
        name: 'User',
        avatar: '',
    };
    const notificationCount = 3;

    return (
        <Center className='mt-20'>
            <View className="flex-row justify-between items-center px-5">
                <View className="flex-row items-center flex-1 items-center">
                    <Avatar className="w-14 h-14 rounded-full mr-3">
                    {userInfo.avatar ? (
                        <AvatarImage 
                        source={{ uri: userInfo.avatar }} 
                        alt={userInfo.name} 
                        />
                    ) : (
                        <TouchableOpacity 
                        className="w-14 h-14 rounded-full items-center justify-center bg-lightPrimaryLight"
                        onPress={() => console.log('Pressed')}
                        >
                            <User size={26} color={Colors.light.primary} />
                        </TouchableOpacity>
                    )}
                    </Avatar>
                    
                    <View className="flex-col">
                    <Text className="text-sm text-gray-500 font-medium">Hi!</Text>
                    <Text className="text-lg text-gray-800 font-semibold">{userInfo.name}</Text>
                    </View>
                </View>

                <View className="relative">
                    <TouchableOpacity
                        className="w-14 h-14 rounded-full items-center justify-center bg-lightPrimaryLight"
                        onPress={() => {
                            console.log('Notification pressed');
                        }}
                        >
                        <Bell size={24} color="#333" />
                    </TouchableOpacity>
                    
                    {notificationCount > 0 && (
                    <View className="absolute top-1 right-1 bg-red-500 rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                        <Text className="text-white text-xs font-bold">
                        {notificationCount > 9 ? '9+' : notificationCount}
                        </Text>
                    </View>
                    )}
                </View>
            </View>
            <Divider className="my-4 w-[90%]"
                style={{ backgroundColor: Colors.light.border }}
            />
        </Center>
    )
}
