import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { relH, relW } from "../../../constants/relative";
import { Colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { formatMoney } from "../../../Utilities/format";
import { addBalance, getBalance, updateInterval } from "../../../LocalStorage/User";
import { getEducation, getEducationEnrolled, setEducationEnrolled } from "../../../LocalStorage/Education";

interface Props {
  type: "Diploma" | "Bachelor" | "Master" | "Phd";
  name: string;
  time: number;
  cost: number;
}

const IndividualChoose = (props: Props) => {
  const [bought, setBought] = useState<boolean>(false);
  const [canBuy, setCanBuy] = useState<boolean>(false);

  const update = async () => {
    if ((await getEducation(props.type)).includes(props.name)) setBought(true);
    else {
      setBought(false);
      const balance = await getBalance();
      if (balance < props.cost) return setCanBuy(false);
      if (props.type === "Bachelor") return setCanBuy((await getEducation("Diploma")).includes(props.name));
      if (props.type === "Master") return setCanBuy((await getEducation("Bachelor")).includes(props.name));
      if (props.type === "Phd") return setCanBuy((await getEducation("Master")).includes(props.name));
      setCanBuy(true);
    }
  };

  useEffect(() => {
    (async () => await update())();
    const interval = setInterval(update, updateInterval);
    return () => clearInterval(interval);
  }, [props]);

  const onBuy = async () => {
    const balance = await getBalance();
    if (!canBuy || (await getEducationEnrolled()).enrolled || balance < props.cost) return;
    await addBalance(-props.cost);
    await setEducationEnrolled(true, {
      type: props.type,
      name: props.name,
      time: props.time * 30,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image style={styles.img} source={require("../../../assets/Nav/educationL.png")} />
        <View style={styles.textCont}>
          <Text style={styles.title}>
            {props.type} in {props.name}
          </Text>
          <Text style={styles.desc}>{props.time} months</Text>
        </View>
      </View>
      {bought ? (
        <Pressable style={{ ...styles.button, backgroundColor: Colors.green }}>
          <Image style={{ width: relH(22), height: relH(22) }} source={require("../../../assets/Global/check.png")} />
        </Pressable>
      ) : (
        <Pressable onPress={onBuy} style={{ ...styles.button, backgroundColor: canBuy ? Colors.green : Colors.gray }}>
          <Text style={styles.buttonTxt}>{formatMoney(props.cost)}</Text>
        </Pressable>
      )}
    </View>
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
    fontFamily: Fonts.Roboto[500],
    fontSize: relW(8),
  },
  button: {
    width: relW(50),
    height: relH(22),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonTxt: {
    includeFontPadding: false,
    fontFamily: Fonts.Signika[500],
    fontSize: relW(12),
    color: Colors.white,
  },
});
