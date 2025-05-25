import { AddressSuggestion } from "../types/address_suggestion";
import { DetailedError } from "../types/detailed_error";
import { Result } from "../types/result";

export interface AddressServiceInterface {
  resultLimit: number;
  apiKey: string;
  getSuggestions(
    partialAddess: string
  ): Promise<Result<AddressSuggestion[], DetailedError>>;
}
