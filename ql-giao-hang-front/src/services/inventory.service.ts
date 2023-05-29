import httpCommon from "@Services/http-common";
import { Inventory, ResponseReceived } from "@Common/types";

class InventoryService {
  async getAll(): Promise<ResponseReceived<Inventory[]>> {
    return httpCommon.get("/inventory").then();
  }
}

export default new InventoryService();
