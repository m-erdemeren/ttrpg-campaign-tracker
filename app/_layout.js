import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'D&D Characters',
          headerShown: false // HomeScreen kendi title'ını gösterecek
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create Character',
          presentation: 'modal' // Modal olarak açılsın
        }} 
      />
      <Stack.Screen 
        name="character/[id]" 
        options={{ 
          title: 'Character Sheet'
        }} 
      />
    </Stack>
  );
}