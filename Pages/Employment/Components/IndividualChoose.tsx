import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { relH, relW } from "../../../constants/relative";
import { Colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { formatMoney } from "../../../Utilities/format";
import { getEducation } from "../../../LocalStorage/Education";
import { setEmploymentEnrolled } from "../../../LocalStorage/Employment";

interface Props {
  type: "Intern" | "Junior" | "Senior" | "Executive";
  name: string;
  requirement: {
    type: "Diploma" | "Bachelor" | "Master" | "Phd" | "None";
    major: string;
  };
  income: number;
}

const IndividualChoose = (props: Props) => {
  const [canEnroll, setCanEnroll] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (props.requirement.type === "None") return setCanEnroll(true);
      const educations = await getEducation(props.requirement.type);
      if (educations.includes(props.requirement.major)) setCanEnroll(true);
      else setCanEnroll(false);
    })();
  });

  const onEnroll = async () => {
    if (props.requirement.type != "None" && !(await getEducation(props.requirement.type)).includes(props.requirement.major)) return;
    await setEmploymentEnrolled(true, { name: props.name, type: props.type, pay: props.income });
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image style={styles.img} source={require("../../../assets/Nav/employmentL.png")} />
        <View style={styles.textCont}>
          <Text style={styles.title}>{props.name}</Text>
          {props.requirement.type != "None" ? (
            <Text style={styles.desc}>
              Must have a {props.requirement.type} in {props.requirement.major}
            </Text>
          ) : (
            <Text style={styles.desc}>No Requirements</Text>
          )}
        </View>
      </View>
      {canEnroll ? (
        <Pressable onPress={onEnroll} style={{ ...styles.button, backgroundColor: Colors.green }}>
          <Text style={styles.buttonTxt}>{formatMoney(props.income)}/day</Text>
        </Pressable>
      ) : (
        <Pressable style={{ ...styles.button, backgroundColor: Colors.gray }}>
          <Text style={styles.buttonTxt}>{formatMoney(props.income)}/day</Text>
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
    width: relW(72),
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
