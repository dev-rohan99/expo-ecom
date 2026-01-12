import { View, Text, Button } from 'react-native';
import { useAuth, useSSO } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const { startSSOFlow } = useSSO();

  const signIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google', // or 'oauth_email'
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoaded) return <Text>Loading auth...</Text>;

  if (!isSignedIn) {
    return (
      <View>
        <Text>You are signed out</Text>
        <Button title="Sign In" onPress={signIn} />
      </View>
    );
  }

  return <Text>Welcome! You are signed in 🎉</Text>;
}
