import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import { globalStyles } from "../../Styles/Global";
import Nav from "../../Components/Nav/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Choose from "./Components/Choose";

type Props = NativeStackScreenProps<RootStackParamList, "Investment">;

const Investment = (props: Props) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Nav navigation={props.navigation} screen="Investment" />
      <Choose />
    </SafeAreaView>
  );
};

export default Investment;

const styles = StyleSheet.create({});
