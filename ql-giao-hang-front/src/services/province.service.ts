import { ProvinceCommonType, AddressToSave } from "@Common/types";
import provinceApi from "./province.api";

class ProvinceService {
  async getAllProvince(): Promise<ProvinceCommonType[]> {
    return provinceApi.get<ProvinceCommonType[]>("/p").then();
  }

  async getProvince(code: number): Promise<ProvinceCommonType> {
    return provinceApi
      .get<ProvinceCommonType>(`/p/${code}`)
      .then();
  }

  async getDistrictByProvinceCode(code: number): Promise<ProvinceCommonType[]> {
    return provinceApi
      .get<ProvinceCommonType[]>("/d", {
        params: {
          p: code,
        },
      })
      .then();
  }

  async getDistrict(code: number): Promise<ProvinceCommonType> {
    return provinceApi
      .get<ProvinceCommonType>(`/d/${code}`)
      .then();
  }

  async getWardByDistrictCode(code: number): Promise<ProvinceCommonType[]> {
    return provinceApi
      .get<ProvinceCommonType[]>("/w", {
        params: {
          d: code,
        },
      })
      .then();
  }

  async getWard(code: number): Promise<ProvinceCommonType> {
    return provinceApi
      .get<ProvinceCommonType>(`/w/${code}`)
      .then();
  }

  async getAddress(data: AddressToSave): Promise<string> {
    let detail = data.addressDetail;
    let province = await this.getProvince(data.provinceCode);
    let district = await this.getDistrict(data.districtCode);
    let ward = await this.getWard(data.wardCode);
    let address = data.addressDetail + " , " + ward.name + " , " + district.name + " , " + province.name;
    return address;
  }
}

export default new ProvinceService();
