import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { relH, relW } from "../../../constants/relative";
import { Colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { formatMoney } from "../../../Utilities/format";
import Expanded from "./Expanded";
import { InvestmentsImages } from "../../../constants/images";

interface Props {
  name: string;
  desc: string;
  price: number;
  change: number;
  color: "green" | "red";
  type: "Commodity" | "Forex" | "Stocks" | "Crypto";
  setExpand: Dispatch<SetStateAction<JSX.Element | null>>;
}

const IndividualChoose = (props: Props) => {
  return (
    <Pressable
      onPress={() => {
        props.setExpand(<Expanded setExpand={props.setExpand} name={props.name} type={props.type} />);
      }}
      style={styles.container}
    >
      <View style={styles.left}>
        <Image style={styles.img} source={InvestmentsImages[props.type][props.name] || require("../../../assets/Nav/investmentL.png")} />
        <View style={styles.textCont}>
          <Text style={styles.title}>{props.name}</Text>
          <Text style={styles.desc}>{props.desc}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={{ ...styles.rightTop, color: Colors[props.color] }}>{formatMoney(props.price)}</Text>
        <View style={styles.rightBottom}>
          {props.color == "green" ? (
            <Image style={styles.rightBottomImage} source={require("../../../assets/Investment/green.png")} />
          ) : (
            <Image style={styles.rightBottomImage} source={require("../../../assets/Investment/red.png")} />
          )}
          <Text style={{ ...styles.rightBottomText, color: Colors[props.color] }}>{props.change.toFixed(2)}%</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default IndividualChoose;

const styles = StyleSheet.create({
  container: {
    width: relW(330),
    height: relH(52),
    flexDirection: "row",
    backgroundColor: Colors.yellowA,
    borderRadius: 8,
    shadowOpacity: 0.25,
    elevation: 8,
    alignItems: "center",
    paddingHorizontal: relW(10),
    justifyContent: "space-between",
    marginBottom: relH(12),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: relW(7),
  },
  img: {
    width: relH(30),
    height: relH(30),
  },
  textCont: {
    gap: relH(2),
  },
  title: {
    includeFontPadding: false,
    fontFamily: Fonts.Roboto[500],
    fontSize: relW(12),
  },
  desc: {
    includeFontPadding: false,
    fontFamily: Fonts.Signika[500],
    fontSize: relW(8),
  },
  right: {
    gap: relH(1),
    alignItems: "flex-end",
  },
  rightTop: {
    fontFamily: Fonts.Signika[500],
    fontSize: relW(12),
    includeFontPadding: false,
  },
  rightBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: relW(1),
  },
  rightBottomImage: {
    height: relH(11),
    width: relH(11),
  },
  rightBottomText: {
    fontFamily: Fonts.Signika[500],
    fontSize: relW(10),
    includeFontPadding: false,
  },
});
