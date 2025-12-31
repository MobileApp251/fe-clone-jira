import { Pressable, Text, View } from "react-native";

export default function SignInWithGoogleButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        style={{
          width: "100%",
          height: 44,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#000' }}>
          Continue with Google
        </Text>
      </View>
    </Pressable>
  );
}
