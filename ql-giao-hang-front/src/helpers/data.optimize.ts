import {
  AddressCode,
  CustomerCreateType,
  ShopRegisterForm,
  Date7Days,
} from "@Common/types";
import { formatValue } from "react-currency-input-field";

type PartnersRegisterNotOptimize = {
  phoneNumber: string;
  name: string;
  addressDetail: string;
  address: AddressCode;
};

export const dataShopRegistrationOptimize = (
  data: PartnersRegisterNotOptimize
): ShopRegisterForm => {
  return {
    ...data,
    addresses: [
      {
        addressDetail: data.addressDetail,
        ...data.address,
      },
    ],
  };
};

export const dataCustomerCreateOptimize = (
  data: PartnersRegisterNotOptimize
): CustomerCreateType => {
  return {
    phoneNumber: data.phoneNumber,
    name: data.name,
    address: {
      addressDetail: data.addressDetail,
      ...data.address,
    },
  };
};

export const getTodayTime = (data?: Date): string => {
  let date: Date | null = null;

  if (data) {
    date = data;
  } else {
    date = new Date();
  }

  return (
    date.getFullYear() +
    "-" +
    ((date.getMonth() + 1).toString().length > 1
      ? date.getMonth() + 1
      : `0${date.getMonth() + 1}`) +
    "-" +
    (date.getDate().toString().length > 1
      ? date.getDate()
      : `0${date.getDate()}`)
  );
};

export const getDate7Days = (): Date7Days => {
  var date = new Date();
  var finalDate;
  var horizontalDate;
  let array7days = []; // ngày để so sánh vs database VD: 2/3/2023
  let arrayHorizontal = []; // ngày để trục ngang biểu đồ VD:2/3
  for (let i = 6; i >= 0; i--) {
    date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    finalDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    horizontalDate = date.getDate() + "/" + (date.getMonth() + 1);
    array7days.push(finalDate);
    arrayHorizontal.push(horizontalDate);
  }
  return {
    array7days: array7days,
    arrayHorizontal: arrayHorizontal,
  };
};

export const convertNumberToCurrency = (price: number) =>
  formatValue({
    value: price.toString(),
    groupSeparator: ",",
    decimalSeparator: ".",
    decimalScale: 2,
    suffix: " VNĐ",
  });
