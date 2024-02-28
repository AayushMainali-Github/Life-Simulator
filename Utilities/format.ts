// 0 -> $0
// 1.4 -> $1.4
// 1.4534 -> $1.45
// 25.32421 -> $25.3
// 134 -> $134
// 1242 -> $1.24K
// 12345 -> $12.3K
// 123456 -> $123K
// MAX -> $999q
const endings = ["", "K", "M", "B", "T", "Q", "q"];
export const formatMoney = (money: number, removeDollar?: boolean): string => {
  if (money >= 999999999999999999999n) return "$999q";
  const moneyStr = money.toString().split(".")[0];
  let sliced = moneyStr.slice(0, 3);
  if (moneyStr.length % 3 == 1 && sliced.length > 1) sliced = `${sliced[0]}.${sliced.slice(1)}`;
  else if (moneyStr.length % 3 == 2 && sliced.length > 2) sliced = `${sliced.slice(0, 2)}.${sliced[2]}`;
  const ending = endings[Math.ceil(moneyStr.length / 3) - 1];
  if (moneyStr.length == 1) return `${removeDollar ? "" : "$"}${money.toFixed(3)}`;
  else if (moneyStr.length == 2) return `${removeDollar ? "" : "$"}${money.toFixed(2)}`;
  else if (moneyStr.length == 3) return `${removeDollar ? "" : "$"}${money.toFixed(1)}`;
  return `${removeDollar ? "" : "$"}${sliced}${ending}`;
};

//Format in "2024 Jan 16"
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const yy = date.getFullYear();
  const mm = months[date.getMonth()];
  const dd = date.getDate();
  return `${yy} ${mm} ${dd}`;
};
