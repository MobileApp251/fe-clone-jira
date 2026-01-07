import React from "react";
import { Text, View } from "react-native";

export const Box = ({ children }: any) => <View>{children}</View>;
export const TextComponent = ({ children }: any) => <Text>{children}</Text>;
export const Button = ({ children, onPress }: any) => (
  <Text onPress={onPress}>{children}</Text>
);
