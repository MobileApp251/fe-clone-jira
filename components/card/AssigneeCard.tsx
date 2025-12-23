import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { Heading } from "../ui/heading";
import { VStack } from "../ui/vstack";

type Props = {
    name: string
};

export default function AssigneeCard({
    name
}: Props) {

    return (
        <Box
            className="rounded-2xl p-4 mb-4 shadow-sm"
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
            <VStack space="2xl">
                <HStack className="items-center" space="md">
                    <Avatar className="bg-lightPrimary">
                        <AvatarFallbackText className="text-white">
                            {name}
                        </AvatarFallbackText>
                    </Avatar>
                    <Heading className="text-darkTextPrimary" size="sm">{name}</Heading>
                </HStack>
            </VStack>
        </Box>
    );
}
