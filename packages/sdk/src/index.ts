import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ApproveParams,
  ApproveData,
  RouteParams,
  RouteData,
  QuoteData,
  QuoteParams,
} from "./types";

export {
  ApproveParams,
  ApproveData,
  RouteParams,
  RouteData,
  QuoteData,
  QuoteParams,
};

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

  public async getApprovalData(params: ApproveParams) {
    const url = "/wallet/approve";

    return this.request<ApproveData>({
      url,
      method: "GET",
      params: {
        ...params,
        routingStrategy: "router",
      },
    });
  }

  public async getRouterData(params: RouteParams) {
    const url = "/shortcuts/route";

    return this.request<RouteData>({
      method: "GET",
      url,
      params,
    });
  }

  public async getQuoteData(params: QuoteParams) {
    const url = "/shortcuts/quote";

    return this.request<QuoteData>({
      method: "GET",
      url,
      params,
    });
  }
}
