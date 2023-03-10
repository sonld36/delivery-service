import {
  AddressToSave,
  ProductPaging,
  ProductTop10Type,
  ProductType,
  ResponseReceived,
  ShopProfile,
} from "@Common/types";
import httpCommon from "@Services/http-common";
class ShopService {
  async createProduct(data: FormData): Promise<ResponseReceived<any>> {
    return httpCommon
      .post<ResponseReceived<any>>("/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then();
  }

  async getProductList(page: number): Promise<ResponseReceived<ProductPaging>> {
    return httpCommon
      .get("/product", {
        params: {
          page,
        },
      })
      .then();
  }

  async updateProduct(data: FormData): Promise<ResponseReceived<any>> {
    return httpCommon
      .put<ResponseReceived<any>>("/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then();
  }

  async deleteProduct(id: number): Promise<ResponseReceived<number>> {
    return httpCommon.delete<ResponseReceived<number>>(`/product/${id}`).then();
  }

  async getShop(id: Number): Promise<ResponseReceived<any>> {
    return httpCommon.get(`/shop/${id}`).then();
  }

  changeStatus = (id: Number, status: string) => {
    return httpCommon.get("/shop/change-status/" + id + "?status=" + status);
  };

  getShopByStatus = (status: string) => {
    return httpCommon.get("/shop?status=" + status);
  };

  async searchProduct(name: string): Promise<ResponseReceived<ProductType[]>> {
    return httpCommon
      .get<ResponseReceived<ProductType[]>>("/product/search", {
        params: {
          name,
        },
      })
      .then();
  }

  async getAddressByShopId(): Promise<ResponseReceived<AddressToSave>> {
    return httpCommon
      .get<ResponseReceived<AddressToSave>>("/shop/address")
      .then();
  }

  async getTop10ProductByRangeDate(
    startDate: string,
    endDate: string
  ): Promise<ResponseReceived<ProductTop10Type[]>> {
    return httpCommon
      .get<ResponseReceived<ProductTop10Type[]>>("/product", {
        params: {
          startDate,
          endDate,
        },
      })
      .then();
  }

  async getProfileShop(): Promise<ResponseReceived<ShopProfile>> {
    return httpCommon
      .get<ResponseReceived<ShopProfile>>("/shop/profile")
      .then();
  }
}

export default new ShopService();
