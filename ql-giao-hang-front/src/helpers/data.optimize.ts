import {
  AddressCode,
  CustomerCreateType,
  ShopRegisterForm,
  Date7Days,
} from "@Common/types";
import mapService from "@Services/map.service";
import provinceService from "@Services/province.service";
import { formatValue } from "react-currency-input-field";

type PartnersRegisterNotOptimize = {
  phoneNumber: string;
  name: string;
  addressDetail: string;
  address: AddressCode;
};

export const dataShopRegistrationOptimize = async (
  data: PartnersRegisterNotOptimize
): Promise<ShopRegisterForm> => {
  const address = await provinceService.getAddress({
    addressDetail: data.addressDetail,
    ...data.address,
  });

  const longlat = await mapService.getCoordinate(address);
  return {
    ...data,
    addresses: [
      {
        addressDetail: data.addressDetail,
        ...data.address,
      },
    ],
    latitude: longlat[1],
    longitude: longlat[0],
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

export const getDateTime = (data?: Date): string => {
  let date: Date | null = null;

  if (data) {
    date = data;
  } else {
    date = new Date();
  }

  return (
    date.getHours() +
    ":" +
    (date.getMinutes().toString().length === 1
      ? `0${date.getMinutes()}`
      : date.getMinutes())
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
    decimalScale: 1,
    suffix: " VNĐ",
  });

export const getCurrentPath = (path: string) => {
  const splitPath: string[] = path.split("/");
  return splitPath[splitPath.length - 1];
};
