import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ApproveParams,
  ApproveData,
  RouteParams,
  RouteData,
  QuoteData,
  QuoteParams,
  BalanceParams,
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

    if (!params.routingStrategy) {
      params.routingStrategy = "router";
    }

    return this.request<ApproveData>({
      url,
      method: "GET",
      params: {
        ...params,
      },
    });
  }

  public async getRouterData(params: RouteParams) {
    const url = "/shortcuts/route";

    if (!params.routingStrategy) {
      params.routingStrategy = "router";
    }

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

  public async getBalances(params: BalanceParams) {
    const url = "/wallet/balances";

    if (typeof params.useEoa === "undefined") {
      params.useEoa = true;
    }

    return this.request<QuoteData>({
      method: "GET",
      url,
      params,
    });
  }
}
