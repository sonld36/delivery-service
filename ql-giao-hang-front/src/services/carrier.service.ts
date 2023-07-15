import httpCommon from "@Services/http-common";
import { CarrierRespType, PagingResp, ResponseReceived } from "@Common/types";

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
}

export default new CarrierService();
