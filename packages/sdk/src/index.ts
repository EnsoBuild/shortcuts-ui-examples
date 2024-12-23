import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ApproveParams,
  ApproveData,
  RouteParams,
  RouteData,
  QuoteData,
  QuoteParams,
  BalanceParams,
  BalanceData,
} from "./types";

export {
  ApproveParams,
  ApproveData,
  RouteParams,
  RouteData,
  QuoteData,
  QuoteParams,
};

const DEFAULT_BASE_URL = "https://api.enso.finance/api/v1";

export class EnsoClient {
  private client: AxiosInstance;

  constructor({
    baseURL = DEFAULT_BASE_URL,
    apiKey,
  }: {
    baseURL?: string;
    apiKey: string;
  }) {
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

  // Method to get approval data to spend a token
  public async getApprovalData(params: ApproveParams) {
    const url = "/wallet/approve";

    if (!params.routingStrategy) {
      params.routingStrategy = "router";
    }

    return this.request<ApproveData>({
      url,
      method: "GET",
      params,
    });
  }

  // Method to get execution data for best route from a token to another
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

  // Method to quote swap from a token to another even if the user doesn't have the token or approve
  public async getQuoteData(params: QuoteParams) {
    const url = "/shortcuts/quote";

    return this.request<QuoteData>({
      method: "GET",
      url,
      params,
    });
  }

  // Method to get wallet balances per chain
  public async getBalances(params: BalanceParams) {
    const url = "/wallet/balances";

    if (typeof params.useEoa === "undefined") {
      params.useEoa = true;
    }

    return this.request<BalanceData>({
      method: "GET",
      url,
      params,
    });
  }
}
