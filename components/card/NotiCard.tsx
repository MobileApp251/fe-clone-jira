import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from "@/components/ui/hstack";
import { ChevronsRightIcon } from '@/components/ui/icon';
import { Text } from "@/components/ui/text";

type Props = {
    title: string;
    description: string;
    taskId: string;
    time: string;
};

export default function NotiCard({
    title,
    description,
    taskId,
    time,
}: Props) {

    return (
        <Box
            className="rounded-2xl p-4 mb-4 mx-6 shadow-sm"
            style={{
                backgroundColor: "#F5F7FA",
                // iOS
                shadowColor: "#000",
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.15,
                shadowRadius: 3,

                // Android shadow
                elevation: 3,
            }}
        >
            <HStack className="justify-between items-center">
                <Text className="text-lg font-semibold text-darkTextPrimary">
                    {title}
                </Text>

                <HStack
                    className={`items-center px-2.5 py-1 rounded-full`}
                >
                    <Text
                        className={`text-md font-light text-darkTextPrimary`}
                    >
                        {time}
                    </Text>
                </HStack>
            </HStack>

            <Text
                className="text-md mt-2 leading-5 text-darkTextPrimary"
            >
                {description}
            </Text>

            <Box className="h-[1px] bg-gray-300 my-3" />

            <HStack className="justify-end items-center">
                <Box className='flex-row justify-start'>
                    <Button className='bg-[#F5F7FA] p-0'>
                        <ButtonText className='text-lightPrimary font-normal text-md'>Go to task</ButtonText>
                        <ButtonIcon className='text-lightPrimary font-normal text-md' as={ChevronsRightIcon} />
                    </Button>
                </Box>
            </HStack>
        </Box>
    );
}
