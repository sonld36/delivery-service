import {
  ResponseReceived,
  OrderDisplayPagingType,
  OrderInThirtyDays,
  OrderDisplayType,
  CODPaging,
} from "@Common/types";
import httpCommon from "@Services/http-common";

class CODService {
  getCODByDateAndShopId = (body: Object) => {
    return httpCommon.post("/cod/find-by-date-and-shop-id", body);
  };

  payCOD = (body: Object) => {
    return httpCommon.post("/cod/pay-cod", body);
  };

  async getCODByShopAndStatus(
    status: number,
    page: number
  ): Promise<ResponseReceived<CODPaging>> {
    return httpCommon
      .get<ResponseReceived<CODPaging>>("/cod", {
        params: {
          status,
          page,
        },
      })
      .then();
  }

  async setStatusForCod(
    idCod: number,
    status: number
  ): Promise<ResponseReceived<number>> {
    return httpCommon
      .put("/cod/status", {
        idCod,
        status,
      })
      .then();
  }

  async getDoneOrderControl(
    page: number
  ): Promise<ResponseReceived<CODPaging>> {
    return httpCommon
      .get<ResponseReceived<CODPaging>>("/cod/done", {
        params: {
          page,
        },
      })
      .then();
  }
}

export default new CODService();
