import axios from "axios";
import { AddressSuggestion } from "../../types/address_suggestion";
import { AddressServiceInterface } from "../address_service_interface";
import {
  AddressSearchResponse,
  SearchResult,
} from "./types/address_search_response";
import { DetailedError } from "../../types/detailed_error";
import { Result } from "../../types/result";

export class TomTomAddressService implements AddressServiceInterface {
  private readonly baseUrl = "https://api.tomtom.com/search/2/search";
  apiKey: string;
  resultLimit: number;

  constructor(apiKey: string, resultLimit: number) {
    this.apiKey = apiKey;
    this.resultLimit = resultLimit;
  }

  async getSuggestions(
    partialAddess: string
  ): Promise<Result<AddressSuggestion[], DetailedError>> {
    if (this.resultLimit > 100) {
      return {
        success: false,
        error: {
          message: "Max result number is limit to 100",
          type: "ERR_REQUEST",
        },
      };
    }
    const url = `${this.baseUrl}/${encodeURIComponent(
      partialAddess
    )}.json?key=${this.apiKey}&limit=${
      this.resultLimit
    }&countrySet=AU&typeahead=true&idxSet=PAD,Addr`;
    try {
      const response = await axios.get<AddressSearchResponse>(url);
      const data = response.data.results
        .sort((a1: SearchResult, a2: SearchResult) => a2.score - a1.score)
        .map((a: SearchResult) =>
          mapAddressSearchResponseToAddressSuggestion(a)
        );
      return { success: true, data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: {
            message:
              "Error has occurred while sending request to provider, please check details field for more information",
            type: "ERR_PROVIDER",
            details: error.response?.data.detailedError,
          },
        };
      }
      let errorMessage =
        "Unexpected error has occurred while processing request";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {
        success: false,
        error: { message: errorMessage, type: "ERR_OTHERS" },
      };
    }
  }
}

const mapAddressSearchResponseToAddressSuggestion = (
  source: SearchResult
): AddressSuggestion => {
  return {
    fullAddress: source.address.freeformAddress,
    streetNumber: source.address.streetNumber,
    streetName: source.address.streetName,
    suburb: source.address.localName,
    state: source.address.countrySubdivisionCode,
    postcode: source.address.postalCode,
    country: source.address.country,
    latitude: source.position.lat,
    longitude: source.position.lon,
  };
};
