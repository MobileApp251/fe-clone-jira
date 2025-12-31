import { useGoogleAuth } from "@/auth/GoogleAuthContext";
import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function ProtectedRequestCard() {
  const { fetchWithAuth } = useGoogleAuth();
  const [data, setData] = React.useState<any>(null);

  async function fetchProtectedData() {
    const response = await fetchWithAuth(
      `${process.env.EXPO_PUBLIC_BASE_URL}/api/protected/data`,
      {
        method: "GET",
      }
    );

    const data = await response.json();
    setData(data);
  }

  return (
    <View
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "gray",
        width: "90%",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Protected Request</Text>
      <Text
        style={{
          fontFamily: "monospace",
          padding: 10,
          borderRadius: 5,
          marginVertical: 10,
          fontSize: 12,
        }}
      >
        {data ? JSON.stringify(data, null, 2) : "No data fetched yet"}
      </Text>
      <Button title="Fetch protected data" onPress={fetchProtectedData} />
    </View>
  );
}
