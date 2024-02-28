import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { relH, relW } from "../../../constants/relative";
import { Colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import IndividualChoose from "./IndividualChoose";
import Business from "../../../Database/Business.json";

const types: Record<number, "TierA" | "TierB" | "TierC" | "TierD"> = {
  0: "TierA",
  1: "TierB",
  2: "TierC",
  3: "TierD",
};

const Choose = () => {
  const [active, setActive] = useState<0 | 1 | 2 | 3>(0);
  const [items, setItems] = useState<Array<JSX.Element>>([]);

  useEffect(() => {
    const data = Business[types[active]];
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);
    const tempItem: Array<JSX.Element> = [];
    for (let i = 0; i < dataKeys.length; i++) {
      tempItem.push(<IndividualChoose key={(types[active], dataKeys[i])} type={types[active]} name={dataKeys[i]} cost={dataValues[i].cost} income={dataValues[i].income} />);
    }
    tempItem.sort((a, b) => {
      return a.props.cost - b.props.cost;
    });
    setItems(tempItem);
  }, [active]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Pressable style={{ ...styles.topBox, borderTopLeftRadius: 25, backgroundColor: active === 0 ? Colors.yellowA : Colors.yellow }} onPress={() => setActive(0)}>
          <Text style={styles.topTxt}>Tier A</Text>
        </Pressable>
        <Pressable style={{ ...styles.topBox, backgroundColor: active === 1 ? Colors.yellowA : Colors.yellow }} onPress={() => setActive(1)}>
          <Text style={styles.topTxt}>Tier B</Text>
        </Pressable>
        <Pressable style={{ ...styles.topBox, backgroundColor: active === 2 ? Colors.yellowA : Colors.yellow }} onPress={() => setActive(2)}>
          <Text style={styles.topTxt}>Tier C</Text>
        </Pressable>
        <Pressable
          style={{ ...styles.topBox, borderRightWidth: 0, borderTopRightRadius: 25, backgroundColor: active === 3 ? Colors.yellowA : Colors.yellow }}
          onPress={() => setActive(3)}
        >
          <Text style={styles.topTxt}>Tier D</Text>
        </Pressable>
      </View>
      <ScrollView style={styles.body}>
        <View style={styles.bodyView}>{items}</View>
      </ScrollView>
    </View>
  );
};

export default Choose;

const styles = StyleSheet.create({
  container: {
    marginTop: relH(32),
    alignSelf: "center",
    width: relW(371),
    height: relH(635),
    borderWidth: relW(1),
    borderRadius: 25,
    backgroundColor: Colors.yellow,
  },
  top: {
    flexDirection: "row",
    borderBottomWidth: relW(1),
    height: relH(41),
  },
  topBox: {
    height: relH(40),
    width: relW(92),
    borderRightWidth: relW(1),
    backgroundColor: "#F9FFB2",
    justifyContent: "center",
  },
  topTxt: {
    textAlign: "center",
    includeFontPadding: false,
    fontFamily: Fonts.Roboto[700],
    fontSize: relW(14),
  },
  body: {
    width: relW(350),
    maxHeight: relH(546),
    alignSelf: "center",
    marginTop: relH(25.5),
  },
  bodyView: {
    alignItems: "center",
  },
});
