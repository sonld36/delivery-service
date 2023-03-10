import { isNumber } from "lodash";
import {
  AddressCode,
  ProvinceCommonType,
  CustomerType,
  OrderCreateType,
  ProductType,
  AddressToSave,
  ProductInOrder,
} from "@Common/types";
import {
  any,
  boolean,
  number,
  object,
  string,
  preprocess,
  ZodSchema,
  lazy,
  date,
  nativeEnum,
} from "zod";
import { convertAddressToCode } from "./list.handle";

export enum PaymentType {
  COD = "COD",
  PAID = "PAID",
}

const Address: ZodSchema<AddressCode> = lazy(() =>
  object({
    provinceCode: number(),
    districtCode: number(),
    wardCode: number(),
  })
);

const AddressDetail: ZodSchema<AddressToSave> = lazy(() =>
  object({
    provinceCode: number(),
    districtCode: number(),
    wardCode: number(),
    addressDetail: string(),
  })
);

const Customer: ZodSchema<CustomerType<AddressToSave[]>> = lazy(() =>
  object({
    id: number(),
    name: string(),
    phoneNumber: string(),
    shopId: number(),
    addresses: AddressDetail.array(),
  })
);

const ProductOrder: ZodSchema<ProductInOrder | any> = object({
  id: number(),
  name: string(),
  salePrice: number(),
  weight: number(),
  active: boolean(),
  pathImage: string(),
  quantity: preprocess(
    (a) => parseInt(string().parse(a), 10),
    number().positive().max(100)
  ).default(1),
});

export const registerSchema = object({
  username: string()
    .min(8, "Tài khoản phải nhiều hơn 8 kí tự")
    .max(32, "Tên tài khoản ít hơn 32 kí tự"),
  email: string()
    .min(1, "Vui lòng nhập địa chỉ email")
    .email("Email không hợp lệ"),
  password: string()
    .min(8, "Mật khẩu phải nhiều hơn 8 kí tự")
    .max(32, "Mật khẩu phải ít hơn 32 kí tự"),
  passwordConfirm: string().min(1, "Vui lòng điền xác minh mật khẩu"),
  // terms: literal(true, {
  //   invalid_type_error: 'Accept Terms is required',
  // }),
  phoneNumber: string()
    .min(1, "Vui lòng nhập số điện thoại")
    .max(10, "Số điện thoại không được quá 10 số")
    .regex(
      new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
      "Số điện thoại bạn nhập không hợp lệ"
    ),
  name: string()
    .min(1, "Vui lòng nhập tên shop của bạn")
    .max(256, "Tên shop không được quá 256 kí tự"),
  address: any()
    .array()
    .nonempty("Vui lòng chọn địa chỉ")
    .transform((value) => convertAddressToCode(value)),
  addressDetail: string().max(256, "Địa chỉ chi tiết không quá 256 kí tự"),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Mật khẩu nhập lại chưa chính xác",
});

export const loginSchema = object({
  // username: string()
  //   .min(1, "Name is required")
  //   .max(32, "Name must be less than 100 characters"),
  username: string().min(1, "Username is required"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const addAddressSchema = object({
  address: preprocess((a) => {
    return convertAddressToCode(a);
  }, Address),
  addressDetail: string().max(256, "Địa chỉ chi tiết không quá 256 kí tự"),
});

export const partnersRegistrationSchema = object({
  phoneNumber: string()
    .min(1, "Vui lòng nhập số điện thoại")
    .max(10, "Số điện thoại không được quá 10 số")
    .regex(
      new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
      "Số điện thoại bạn nhập không hợp lệ"
    ),
  name: string()
    .min(1, "Vui lòng nhập tên shop của bạn")
    .max(256, "Tên shop không được quá 256 kí tự"),
  address: preprocess((a) => {
    return convertAddressToCode(a);
  }, Address),
  addressDetail: string().max(256, "Địa chỉ chi tiết không quá 256 kí tự"),
});

export const saveProductSchema = object({
  name: string()
    .min(1, "Vui lòng nhập tên sản phẩm")
    .max(256, "Sản phẩm không được quá 256 kí tự"),
  salePrice: preprocess(
    (a) => (isNumber(a) ? a : parseInt(string().parse(a), 10)),
    number().positive()
  ),
  entryPrice: preprocess(
    (a) => (isNumber(a) ? a : parseInt(string().parse(a), 10)),
    number().positive()
  ),
  weight: preprocess(
    (a) => (isNumber(a) ? a : parseFloat(string().parse(a))),
    number().positive()
  ),
  active: boolean(),
  productCode: string()
    .min(1, "Vui lòng nhập tên sản phẩm")
    .max(256, "Sản phẩm không được quá 256 kí tự"),
  image: any(),
  id: any(),
});

export const orderCreateSchema = object({
  customer: Customer,
  products: ProductOrder.array(),
  timeReceiveExpected: string(),
  orderType: nativeEnum(PaymentType),
  note: string(),
  shipFee: number(),
});
export const saveAvatarSchema = object({
  image: any(),
  name: string()
    .min(1, "Vui lòng nhập tên")
    .max(256, "Sản phẩm không được quá 256 kí tự"),
  phoneNumber: string()
    .min(1, "Vui lòng nhập số điện thoại")
    .max(10, "Số điện thoại không được quá 10 số")
    .regex(
      new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
      "Số điện thoại bạn nhập không hợp lệ"
    ),
  id: any(),
});

export const createFormData = (data: object): FormData => {
  let formData = new FormData();
  const dataObject = Object.create(data);
  Object.keys(data).forEach((key) => {
    if (key === "image") {
      formData.append(
        key,
        dataObject[key][0] ? dataObject[key][0] : new File([], "undefined")
      );
    } else {
      formData.append(key, dataObject[key]);
    }
  });

  return formData;
};
