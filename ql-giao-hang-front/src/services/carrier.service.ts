import httpCommon from "@Services/http-common";
import {
  CarrierInfoManagerType,
  CarrierRespType,
  PagingResp,
  ResponseReceived,
} from "@Common/types";

export interface CarrierDetailType {
  numberOfOrderDelivering: number;
  numberOfOrderDelivered: number;
  totalCashNotPayment: number;
}

class CarrierService {
  async getAll(
    page: number
  ): Promise<ResponseReceived<PagingResp<CarrierRespType>>> {
    return httpCommon.get("carrier", {
      params: {
        page,
      },
    });
  }

  async getDetail(id: number): Promise<ResponseReceived<CarrierDetailType>> {
    return httpCommon.get(`carrier/detail/${id}`);
  }

  async getByShopId(
    shopId?: number
  ): Promise<ResponseReceived<CarrierRespType[]>> {
    return httpCommon.get(`carrier/recommend/${shopId}`);
  }

  async getAllWithoutPaging(): Promise<
    ResponseReceived<CarrierInfoManagerType[]>
  > {
    return httpCommon.get("carrier/all").then();
  }

  async getById(id: number): Promise<ResponseReceived<CarrierRespType>> {
    return httpCommon.get(`carrier/${id}`);
  }
}

export default new CarrierService();
