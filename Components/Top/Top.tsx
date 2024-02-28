import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Fonts } from "../../constants/fonts";
import { relH, relW } from "../../constants/relative";
import { Colors } from "../../constants/colors";
import { formatDate, formatMoney } from "../../Utilities/format";
import { balanceInterval, dateInterval, getBalance, getDate, UpdateDate } from "../../LocalStorage/User";
import { UpdateEducation } from "../../LocalStorage/Education";
import { UpdatePrices } from "../../LocalStorage/Investment";
import { UpdateBusiness } from "../../LocalStorage/Business";
import { UpdateEmployment } from "../../LocalStorage/Employment";
import { UpdateNetworth } from "../../LocalStorage/NetWorth";

interface Props {
  header: string;
}

const Top = (props: Props) => {
  const [date, setDate] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    //update initially
    (async () => {
      setDate(await getDate());
      setBalance(await getBalance());
    })();

    //update date
    const dInterval = setInterval(async () => {
      await UpdatePrices();
      await UpdateEducation();
      await UpdateBusiness();
      await UpdateEmployment();
      await UpdateNetworth();
      await UpdateDate();

      setDate(await getDate());
    }, dateInterval);

    //update balance
    const bInterval = setInterval(async () => {
      setBalance(await getBalance());
    }, balanceInterval);

    //Clearing the interval
    return () => {
      clearInterval(dInterval);
      clearInterval(bInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.head}>{props.header}</Text>
        <Text style={styles.date}>{formatDate(date)}</Text>
      </View>
      <Text style={styles.dollar}>{formatMoney(balance)}</Text>
    </View>
  );
};

export default Top;

const styles = StyleSheet.create({
  container: {
    width: relW(390),
    height: relH(55),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: relW(12),
    backgroundColor: Colors.yellow,
    borderBottomWidth: relH(1),
  },
  dollar: {
    fontFamily: Fonts.Signika[700],
    fontSize: relW(20),
    includeFontPadding: false,
  },
  left: {
    gap: relH(4),
  },
  head: {
    fontFamily: Fonts.Roboto[700],
    fontSize: relW(16),
    includeFontPadding: false,
  },
  date: {
    fontFamily: Fonts.Roboto[700],
    fontSize: relW(10),
    includeFontPadding: false,
  },
});
