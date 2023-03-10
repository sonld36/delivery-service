import httpCommon from "@Services/http-common";
import {
  AddressToSave,
  CustomerCreateType,
  CustomersPagingType,
  CustomerType,
  ResponseReceived,
} from "@Common/types";

class CustomerService {
  async create(
    data: CustomerCreateType
  ): Promise<ResponseReceived<CustomerType<AddressToSave[]>>> {
    return httpCommon
      .post<ResponseReceived<CustomerType<AddressToSave[]>>>("/customer", data)
      .then();
  }

  async searchByPhoneNumber(
    phoneNumber: string
  ): Promise<ResponseReceived<CustomerType<AddressToSave[]>[]>> {
    return httpCommon
      .get<ResponseReceived<CustomerType<AddressToSave[]>[]>>(
        "/customer/search",
        {
          params: {
            phoneNumber,
          },
        }
      )
      .then();
  }

  async addAddress(
    data: AddressToSave,
    customerId: number
  ): Promise<ResponseReceived<AddressToSave>> {
    return httpCommon
      .post<ResponseReceived<AddressToSave>>(`/customer/${customerId}`, {
        ...data,
      })
      .then();
  }

  async getAddress(
    page: number
  ): Promise<ResponseReceived<CustomersPagingType>> {
    return httpCommon
      .get<ResponseReceived<CustomersPagingType>>("/customer", {
        params: {
          page,
        },
      })
      .then();
  }

  async deleteAddress(
    addressId: number,
    customerId: number
  ): Promise<ResponseReceived<boolean>> {
    return httpCommon
      .delete<ResponseReceived<boolean>>(`/customer/address/${addressId}`, {
        params: {
          customerId: customerId,
        },
      })
      .then();
  }

  async deleteCustomer(customerId: number): Promise<ResponseReceived<number>> {
    return httpCommon.delete(`/customer/${customerId}`).then();
  }
}

export default new CustomerService();
