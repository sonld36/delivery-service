// import { ProductList } from '@Components/dashboard/shop/ProductList';
import { AlertColor } from "@mui/material";
import { shopStatus } from "./const";
import { number } from "zod";
import { type } from "os";

export type LoginRegisterForm = {
  username?: string;
  password?: string;
};

export type ShopRegisterForm = {
  email?: string;
  username?: string;
  password?: string;
  phoneNumber: string;
  name: string;
  addresses: AddressToSave[];
};

export type ProductType = {
  id: number;
  productCode: string;
  name: string;
  salePrice: number;
  entryPrice: number;
  weight: number;
  active: boolean;
  pathImage: string;
};

export type ProductPaging = {
  totalPage: number;
  products: ProductType[];
};

export type ResponseReceived<Type> = {
  message?: string;
  status?: number;
  data: Type;
  code?: number;
};

export type UserDetail = {
  id: number | undefined;
  username: string;
  role: string;
  phoneNumber: string;
};

export type UserLogged = {
  user: UserDetail;
  token?: string;
};

export type ToastState = {
  status?: AlertColor;
  message: string;
  open: boolean;
};

export interface ProvinceCommonType {
  name: string;
  code: number;
  division_type: string;
  code_name: string;
  phone_code: number;
}

export type DistrictType = {
  name: string;
  code: number;
  division_type: string;
  code_name: string;
  province_code: number;
};

export type AddressToSave = {
  addressDetail: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
};

export type AddressCode = {
  provinceCode: number;
  districtCode: number;
  wardCode: number;
};

export type UploadImageType = {
  currentFile: File | undefined;
  previewImage: string | undefined;
  progress: number;
  message: string;
  isError: false;
  imageInfos: [];
};

export type ProductSaveType = {
  id?: number;
  name: string;
  productCode: string;
  salePrice: number;
  entryPrice: number;
  weight: number;
  active: boolean;
  image: File;
};

export type CustomerCreateType = {
  name: string;
  phoneNumber: string;
  address: AddressToSave;
};

export type CustomerType<AddressType> = {
  id: number;
  name: string;
  phoneNumber: string;
  shopId: number;
  addresses: AddressType;
};

export type ProductInOrder = {
  id: number;
  name: string;
  salePrice: number;
  weight: number;
  active: boolean;
  pathImage: string;
  quantity: number;
};

export type OrderCreateType = {
  customer: CustomerType<AddressToSave>;
  products: ProductInOrder[];
  timeReceiveExpected: Date;
  orderType: PaymentType;
  note: string;
  shipFee: number;
};

export type ProductOrderDisplayType = {
  product: ProductType;
  productQuantity: number;
  productPrice: number;
};

export type Date7Days = {
  array7days: Array<any>;
  arrayHorizontal: Array<any>;
};

export type OrderDisplayType = {
  id: number;
  type: PaymentType;
  status: OrderStatus;
  shipFee: number;
  paymentTotal: number;
  note: string;
  products: ProductOrderDisplayType[];
  address: AddressToSave | any;
  customer: CustomerType<null>;
  carrier: any;
  completedAt: Date;
};

export type OrderDisplayPagingType = {
  totalPage: number;
  orders: OrderDisplayType[];
};

export type CustomersPagingType = {
  totalPage: number;
  customers: CustomerType<AddressToSave[]>[];
};

export type ProductTop10Type = {
  totalByStatus: number;
  status: string;
  productId: number;
  productName: string;
};

export type OrderInThirtyDays = {
  countOrder: number;
  dateCreate: string;
  status: string;
};

export type ShopProfile = {
  email: string;
  id: number;
  status: shopStatus;
  account: AccountType;
  addresses: AddressToSave[];
};

export type AccountType = {
  id: number;
  username: string;
  phoneNumber: string;
  name: string;
  pathAvatar: string;
};

export type CODType = {
  id: number;
  date: string;
  shopId: number;
  status: number;
  orders: OrderDisplayType[];
  createdAt: Date;
};

export type CODPaging = {
  totalPage: number;
  cods: CODType[];
};

export enum PaymentType {
  COD = "COD",
  PAID = "PAID",
}

export enum OrderStatus {
  WAITING_FOR_ACCEPT_NEW_ORDER = "Chờ tiếp nhận đơn",
  REQUEST_SHIPPING = "Yêu cầu vận chuyển",
  PICKING_UP_GOODS = "Đang lấy hàng",
  BEING_TRANSPORTED = "Đang vận chuyển",
  DELIVERY_SUCCESSFUL = "Giao hàng thành công",
  NOT_CONTACT = "Không liên hệ được",
  PROBLEM_GOODS = "Kiện hàng có vấn đề",
  REFUNDS = "Hoàn đơn",
  DONE = "Hoàn thành",
}

export const CODStatus: {
  [key: number]: string;
} = {
  1: "Chờ đối soát",
  2: "Liên hệ cho cửa hàng",
  3: "Đối soát thành công",
};

export type OrderDPResponse = {
  orders?: Order[];
  totalRecord?: number;
};

export type Order = {
  maVanDon: number;
  createdAt: Date;
  receiverName: string;
  receiverPhone: string;
  carrierName: string;
  carrierPhone: string;
  status: string;
};

export type OrderInfDetailResponse = {
  shopName: string;
  shopAdd: AddressToSave | any;
  shopPhone: string;
  receiverName: string;
  receiverAdd: AddressToSave | any;
  receiverPhone: string;
  deliveryName: string;
  deliveryId: string;
  deliveryPhone: string;
  note: string;
  createdAt: Date;
  status: string;
};

export type Deliverier = {
  deliveryId: string,
  deliveryName: string,
  deliveryPhone: string
}

export type ProductInOrderByDP = {
  name: string
  pathImage: string
  productQuantity: number
  productPrice: number
  weight: number
}
export type ConvertProductInOrderByDP = {
  product: ProductInOrderByDP
  image: UploadImageType
  totalPrice: number
}

export type ProductInfInOrderByDP = {
  products: ProductInOrderByDP[]
  type: PaymentType
  deliveryFee: number;
}
