import { AddressServiceInterface } from "./providers/address_service_interface";
import { TomTomAddressService } from "./providers/tomtom/tom_tom_address_service";
import { AddressProvider } from "./types/address_provider";
import { AddressSuggestion } from "./types/address_suggestion";
import { DetailedError } from "./types/detailed_error";
import { Result } from "./types/result";

let addressService: AddressServiceInterface;

/**
 * Returns address suggestions from partial address string.
 * @param partialAddress The address search string.
 * @returns A list of address suggestions, if success, return detailed error otherwise.
 */
export const getSuggestions = async (
  partialAddress: string
): Promise<Result<AddressSuggestion[], DetailedError>> => {
  if (!addressService) {
    return {
      success: false,
      error: {
        message: "Please call init method to initialise service first",
        type: "ERR_REQUEST",
      },
    };
  }
  const trimmedPartialAddress = partialAddress.trim();
  if (trimmedPartialAddress === "") {
    return {
      success: false,
      error: {
        message: "Partial address can not be empty",
        type: "ERR_REQUEST",
      },
    };
  }
  if (addressService.apiKey === "") {
    return {
      success: false,
      error: {
        message: "API key can not be empty",
        type: "ERR_REQUEST",
      },
    };
  }
  try {
    return await addressService.getSuggestions(trimmedPartialAddress);
  } catch (error) {
    let errorMessage = "Unexpected error has occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      success: false,
      error: {
        type: "ERR_OTHERS",
        message: errorMessage,
      },
    };
  }
};

/**
 * Init address service by providing api key and address provider.
 * @param apiKey The api key to be used to send query to address provider.
 * @param resultLimit Optional limit of results, default to 20, max number of result is 100.
 * @param provider Optional address provider to use, default to TomTom.
 */
export const initAddressService = (
  apiKey: string,
  resultLimit: number = 20,
  provider: AddressProvider = AddressProvider.TomTom
) => {
  switch (provider) {
    case AddressProvider.TomTom: {
      addressService = new TomTomAddressService(apiKey, resultLimit);
      break;
    }
  }
};

/** @internal Used for testing only. Not for external consumers. */
const __TEST_setAddressService = (service: AddressServiceInterface) => {
  addressService = service;
};

(globalThis as any).__addressServiceTestHook = {
  __TEST_setAddressService,
};

export { AddressProvider } from "./types/address_provider";

export default {
  getSuggestions,
  initAddressService,
  AddressProvider,
};
