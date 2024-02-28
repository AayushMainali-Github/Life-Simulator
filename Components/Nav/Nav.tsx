import { StyleSheet,  View, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import NavItem from "./NavItem";
import { relH, relW } from "../../constants/relative";
import { Colors } from "../../constants/colors";

interface Props {
  screen: "Investment" | "Business" | "Employment" | "Education" | "Profile";
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
}

const Nav = (props: Props) => {
  const [show, setShow] = useState<boolean>(true);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", () => setShow(false));
    Keyboard.addListener("keyboardDidHide", () => setShow(true));
    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);
  return (
    <View style={{ ...styles.container, display: show ? "flex" : "none" }}>
      <NavItem
        navigation={props.navigation}
        link="Investment"
        image={props.screen == "Investment" ? require("../../assets/Nav/investmentD.png") : require("../../assets/Nav/investmentL.png")}
      />
      <NavItem
        navigation={props.navigation}
        link="Business"
        image={props.screen == "Business" ? require("../../assets/Nav/businessD.png") : require("../../assets/Nav/businessL.png")}
      />
      <NavItem
        navigation={props.navigation}
        link="Employment"
        image={props.screen == "Employment" ? require("../../assets/Nav/employmentD.png") : require("../../assets/Nav/employmentL.png")}
      />
      <NavItem
        navigation={props.navigation}
        link="Education"
        image={props.screen == "Education" ? require("../../assets/Nav/educationD.png") : require("../../assets/Nav/educationL.png")}
      />
      <NavItem
        navigation={props.navigation}
        link="Profile"
        image={props.screen == "Profile" ? require("../../assets/Nav/profileD.png") : require("../../assets/Nav/profileL.png")}
      />
    </View>
  );
};

export default Nav;

const styles = StyleSheet.create({
  container: {
    height: relH(70),
    width: relW(390),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: relW(20),
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    backgroundColor: Colors.yellow,
    borderTopWidth: relH(1),
  },
});
