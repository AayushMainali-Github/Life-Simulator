import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { relH, relW } from "../../../constants/relative";
import { Colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { setEducationEnrolled } from "../../../LocalStorage/Education";

interface Props {
  type: "Diploma" | "Bachelor" | "Master" | "Phd";
  name: string;
  time: number;
}

const Status = (props: Props) => {
  const onDropOut = async () => {
    await setEducationEnrolled(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Currently enrolled in a</Text>
      <Text style={styles.text}>
        {props.type} in {props.name}
      </Text>
      <Text style={styles.text}>
        {Math.ceil(props.time / 30)} month{props.time > 30 ? "s" : ""} left
      </Text>
      <View style={styles.buttoCont}>
        <Pressable style={{ ...styles.button, backgroundColor: Colors.blue }}>
          <Text style={styles.buttonTxt}>Speed Up</Text>
        </Pressable>
        <Pressable onPress={onDropOut} style={{ ...styles.button, backgroundColor: Colors.red }}>
          <Text style={styles.buttonTxt}>Drop Out</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Status;

const styles = StyleSheet.create({
  container: {
    width: relW(300),
    height: relH(150),
    borderRadius: 25,
    borderWidth: relW(1),
    backgroundColor: Colors.yellow,
    alignSelf: "center",
    marginTop: relH(285),
    alignItems: "center",
    paddingTop: relH(15),
  },
  text: {
    fontSize: relW(16),
    fontFamily: Fonts.Inter[500],
    includeFontPadding: false,
  },
  buttoCont: {
    marginTop: relH(16),
    flexDirection: "row",
    gap: relW(40),
  },
  button: {
    width: relW(110),
    height: relH(35),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTxt: {
    fontSize: relW(16),
    fontFamily: Fonts.Inter[600],
    includeFontPadding: false,
    color: Colors.white,
  },
});
