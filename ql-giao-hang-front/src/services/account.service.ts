import {
    ResponseReceived,
} from "@Common/types";
import httpCommon from "@Services/http-common";

class AccountService {
    getAccountInfo = () => {
        return httpCommon.get("/account/info");
    };

    getAllAccount = () => {
        return httpCommon.get("/account");
    }

    async updateAccountInfo(data: FormData): Promise<ResponseReceived<any>> {
        return httpCommon
            .put<ResponseReceived<any>>("/account/update", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then();
    }

    getAccById = (id: Number) => {
        return httpCommon.get("/account/" + id);
    }
    getDeliverierList = () => {
        return httpCommon.get("account/get-list-inf-deliverier");
    }
}


export default new AccountService();