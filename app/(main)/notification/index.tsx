import { getUserNotifications } from '@/api/users'
import NotiCard from '@/components/card/NotiCard'
import { Box } from '@/components/ui/box'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { ChevronsLeftIcon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { NotificationType } from '@/utils/notification'
import { useRouter } from 'expo-router'
import { Inbox } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, View } from 'react-native'

export default function Notification() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    useEffect(() => {
        const fetchNoti = async () => {
            const res = await getUserNotifications();
            setNotifications(res);
        }

        fetchNoti();

    }, []);

    return (
        <View className="flex-1">
            <Box className='mx-6 flex-row justify-start'>
                <Button className='bg-white p-0' onPress={() => router.back()}>
                    <ButtonIcon className='text-lightPrimary font-semibold text-xl' as={ChevronsLeftIcon} />
                    <ButtonText className='text-lightPrimary font-semibold text-xl'>Back</ButtonText>
                </Button>
            </Box>

            <Box className='mx-6 mb-4 flex-row justify-center'>
                <Text className='text-2xl font-extrabold text-lightPrimary'>Notifications</Text>
            </Box>
            {notifications.length <= 0 ?
                (
                    <Box className='items-center my-auto'>
                        <Inbox size={48} color="#999999" />
                        <Text className='text-center text-darkTextPrimary'>Empty notification</Text>
                    </Box>
                ) :
                (
                    <FlatList
                        className="mt-4"
                        data={notifications}
                        keyExtractor={(item) => item.noti_id}
                        showsVerticalScrollIndicator={false}
                        renderItem={
                            ({ item }) => (
                                <NotiCard
                                    title={item.title}
                                    description={item.content}
                                    notifyType={item.notifyType}
                                    time={item.notifyAt}
                                />
                            )}
                    />
                )
            }

        </View>
    )
}
