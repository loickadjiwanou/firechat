import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: "card",
      }}
    >
      <Stack.Screen name="contacts" />
    </Stack>
  );
}
