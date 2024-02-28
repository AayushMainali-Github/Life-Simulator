import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { relH } from "../constants/relative";

export const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    height: relH(844),
  },
});
