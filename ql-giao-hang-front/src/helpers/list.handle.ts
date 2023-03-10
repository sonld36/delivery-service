import {
  ProvinceCommonType,
  AddressCode,
  ProductType,
  ProductSaveType,
  UploadImageType,
} from "@Common/types";
import fileService from "@Services/file.service";

const stateAddress: {
  [key: number]: string;
} = {
  0: "provinceCode",
  1: "districtCode",
  2: "wardCode",
};

export const getAddressByCode = (
  list: any[],
  code: number,
  fieldCheck: string
) => {
  return list.filter((item) => item[fieldCheck] === code);
};

export const convertAddressToCode = (
  list: ProvinceCommonType[] | any
): AddressCode => {
  let res: AddressCode = {
    provinceCode: NaN,
    districtCode: NaN,
    wardCode: NaN,
  };
  list.map((item: any, index: any) => {
    res = {
      ...res,
      [stateAddress[index]]: item.code,
    };
    return null;
  });

  return res;
};

export const checkSeprateList = (
  list: ProvinceCommonType[] | any
): ProvinceCommonType[] | [] => {
  const res: ProvinceCommonType[] = [];
  const province: string[] = ["tỉnh", "thành phố trung ương"];
  const district: string[] = ["huyện", "quận", "thành phố"];
  const ward: string[] = ["thị xã", "xã", "thị trấn", "phường"];

  if (list[0] && !province.includes(list[0].division_type)) {
    return res;
  } else if (list[1] && !district.includes(list[1].division_type)) {
    res.push(list[0]);
    return res;
  } else if (list[2] && !ward.includes(list[2].division_type)) {
    res.push(list[1]);
    return res;
  } else {
    return list;
  }
};

export const MappingProduct = async (
  source: ProductType
): Promise<ProductSaveType | any> => {
  const { pathImage, ...newSource } = source;

  const image: BlobPart = await fileService.getImage(pathImage);

  return {
    ...newSource,
    image: new File([image], pathImage),
  };
};


