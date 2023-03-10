import httpCommon from "@Services/http-common";
import { sortedUniq } from "lodash";
class FileService {
  async getImage(fileName: string): Promise<BlobPart> {
    return httpCommon
      .get<BlobPart>(`file/product/${fileName}`, {
        responseType: "blob",
      })
      .then();
  }

  async getAvatar(fileName: string): Promise<BlobPart> {
    // console.log("filename", fileName);
    return httpCommon
      .get<BlobPart>(`file/account/${fileName}`, {
        responseType: "blob",
      })
      .then();
  }
}

export default new FileService();
