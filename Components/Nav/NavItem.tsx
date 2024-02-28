import { Image, ImageProps, Pressable, StyleSheet } from "react-native";
import React from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { relH } from "../../constants/relative";

interface Props {
  image: ImageProps;
  link: "Investment" | "Business" | "Employment" | "Education" | "Profile";
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const NavItem = (props: Props) => {
  return (
    <Pressable onPress={() => props.navigation.navigate(props.link)}>
      <Image style={styles.image} source={props.image} />
    </Pressable>
  );
};

export default NavItem;

const styles = StyleSheet.create({
  image: {
    width: relH(30),
    height: relH(30),
  },
});
