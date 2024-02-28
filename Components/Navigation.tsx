import { StatusBar, StyleSheet } from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../constants/colors";
import Investment from "../Pages/Investment/Investment";
import Business from "../Pages/Business/Business";
import Employment from "../Pages/Employment/Employment";
import Education from "../Pages/Education/Education";
import Profile from "../Pages/Profile/Profile";
import Top from "./Top/Top";

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const [name, setName] = useState<string>("Employment");
  return (
    <NavigationContainer onStateChange={(state) => setName(state?.routes[state.index].name || "Employment")}>
      <Top header={name} />
      <StatusBar backgroundColor={Colors.yellow} />
      <Stack.Navigator initialRouteName="Employment" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Investment" component={Investment} options={{ animation: "fade" }} />
        <Stack.Screen name="Business" component={Business} options={{ animation: "fade" }} />
        <Stack.Screen name="Employment" component={Employment} options={{ animation: "fade" }} />
        <Stack.Screen name="Education" component={Education} options={{ animation: "fade" }} />
        <Stack.Screen name="Profile" component={Profile} options={{ animation: "fade" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
