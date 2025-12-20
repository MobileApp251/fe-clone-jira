import { useLocalSearchParams } from "expo-router";
import { Text } from "react-native";

export default function ProjectDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <Text>Project detail: {id}</Text>
    )
} 