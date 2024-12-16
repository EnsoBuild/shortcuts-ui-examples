import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ApprovalDataParams,
  ApproveData,
  RouterDataParams,
  RouterData,
} from "./types";

export { ApprovalDataParams, ApproveData, RouterDataParams, RouterData };

export class EnsoClient {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error: any) {
      throw new Error(`API Request failed: ${error.message}`);
    }
  }

  public async getApprovalData(params: ApprovalDataParams) {
    let url = "/wallet/approve?";

    Object.entries(params).forEach(([key, value]) => {
      url += `${key}=${value}&`;
    });
    url += "routingStrategy=router";

    return this.request<ApproveData>({
      method: "GET",
      url,
    });
  }

  public async getRouterData(params: RouterDataParams) {
    let url = "/shortcuts/route?";

    Object.entries(params).forEach(([key, value]) => {
      url += `${key}=${value}&`;
    });

    return this.request<RouterData>({
      method: "GET",
      url,
    });
  }
}
