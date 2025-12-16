import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import {
    Input,
    InputField,
    InputIcon,
    InputSlot
} from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { Filter, Plus, Search } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

export default function SearchBar() {
    return (
        <HStack space="sm" className="items-center">
            <Box className="flex-1">
                <Input
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-lg border-lightBorder"
                >
                    <InputSlot className="pl-3">
                        <InputIcon as={Search} />
                    </InputSlot>
                    <InputField
                        placeholder="Enter text here..."
                        className="pl-2"
                    />
                </Input>
            </Box>

            <Box className="w-12 h-12">
                <TouchableOpacity
                    className="h-full w-full rounded-lg items-center justify-center border border-lightPrimary"
                >
                    <Plus size={22} color={Colors.light.primary} />
                </TouchableOpacity>
            </Box>

            <Box className="w-12 h-12">
                <TouchableOpacity
                    className="h-full w-full rounded-lg items-center justify-center border border-lightPrimary"
                >
                    <Filter size={22} color={Colors.light.primary} />
                </TouchableOpacity>
            </Box>
        </HStack>
    );
}
