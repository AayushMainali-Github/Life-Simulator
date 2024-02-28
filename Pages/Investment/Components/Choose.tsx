import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { relH, relW } from "../../../constants/relative";
import { Colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import IndividualChoose from "./IndividualChoose";
import { GetInvestments, GetInvestmentsOwned } from "../../../LocalStorage/Investment";
import { formatMoney } from "../../../Utilities/format";
import { useIsFocused } from "@react-navigation/native";
import { updateInterval } from "../../../LocalStorage/User";

const types: Record<number, "Commodity" | "Forex" | "Stocks" | "Crypto"> = {
  0: "Stocks",
  1: "Crypto",
  2: "Commodity",
  3: "Forex",
};

const Choose = () => {
  const focused = useIsFocused();
  const [active, setActive] = useState<0 | 1 | 2 | 3>(0);
  const [items, setItems] = useState<Array<JSX.Element>>([]);
  const [expand, setExpand] = useState<JSX.Element | null>(null);

  const update = async () => {
    const investments = await GetInvestments(types[active]);
    if (!investments) return;
    const keys = Object.keys(investments);
    const values = Object.values(investments);
    const tempA: Array<JSX.Element> = [];
    const tempB: Array<JSX.Element> = [];
    for (let i = 0; i < keys.length; i++) {
      const price = values[i].price;
      const history = values[i].history;
      const change = ((price - history[history.length - 2]) / history[history.length - 2]) * 100;
      const elem = (
        <IndividualChoose
          type={types[active]}
          setExpand={setExpand}
          desc={`Owned: ${formatMoney(await GetInvestmentsOwned(types[active], keys[i]), true)}`}
          key={(types[active], keys[i])}
          name={keys[i]}
          price={values[i].price}
          change={Math.abs(change)}
          color={change < 0 ? "red" : "green"}
        />
      );
      values[i].favorite ? tempA.push(elem) : tempB.push(elem);
    }
    setItems([...tempA, ...tempB]);
  };

  useEffect(() => {
    if (!expand) {
      (async () => {
        await update();
      })();
      const interval = setInterval(update, updateInterval);
      return () => clearInterval(interval);
    }
  }, [active, expand, focused]);

  return (
    expand || (
      <View style={styles.container}>
        <View style={styles.top}>
          <Pressable style={{ ...styles.topBox, borderTopLeftRadius: 25, backgroundColor: active === 0 ? Colors.yellowA : Colors.yellow }} onPress={() => setActive(0)}>
            <Text style={styles.topTxt}>Stocks</Text>
          </Pressable>
          <Pressable style={{ ...styles.topBox, backgroundColor: active === 1 ? Colors.yellowA : Colors.yellow }} onPress={() => setActive(1)}>
            <Text style={styles.topTxt}>Crypto</Text>
          </Pressable>
          <Pressable style={{ ...styles.topBox, backgroundColor: active === 2 ? Colors.yellowA : Colors.yellow }} onPress={() => setActive(2)}>
            <Text style={styles.topTxt}>Commodity</Text>
          </Pressable>
          <Pressable
            style={{ ...styles.topBox, borderRightWidth: 0, borderTopRightRadius: 25, backgroundColor: active === 3 ? Colors.yellowA : Colors.yellow }}
            onPress={() => setActive(3)}
          >
            <Text style={styles.topTxt}>Forex</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.body}>
          <View style={styles.bodyView}>{items}</View>
        </ScrollView>
      </View>
    )
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
