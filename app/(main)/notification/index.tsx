import NotiCard from '@/components/card/NotiCard'
import { Box } from '@/components/ui/box'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { ChevronsLeftIcon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, View } from 'react-native'
import { notification } from './notification_data'

export default function Notification() {
    const router = useRouter();
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

            <FlatList
                className="mt-4"
                data={notification}
                keyExtractor={(item) => item.taskId}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <NotiCard
                        title={item.title}
                        description={item.description}
                        taskId={item.taskId}
                        time={item.time}
                    />
                )}
            />
        </View>
    )
}
