import { StyleSheet, Text, SafeAreaView } from "react-native";
import React from "react";
import { globalStyles } from "../../Styles/Global";
import Nav from "../../Components/Nav/Nav";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Choose from "./Components/Choose";

type Props = NativeStackScreenProps<RootStackParamList, "Business">;

const Business = (props: Props) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Nav navigation={props.navigation} screen="Business" />
      <Choose />
    </SafeAreaView>
  );
};

export default Business;

const styles = StyleSheet.create({});
