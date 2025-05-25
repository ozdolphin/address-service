import { initAddressService, getSuggestions, AddressProvider } from "../index";
import { AddressServiceInterface } from "../providers/address_service_interface";
import { _setAddressService } from "../test-utils/address_service.test-helper";

describe("Address service without proper init", () => {
  it("should return error for not init service", async () => {
    const result = await getSuggestions("100 Queen");
    expect(result.success).toBeFalsy();
  });

  it("should return error with empty API key", async () => {
    initAddressService("");
    const result = await getSuggestions("100 queen");
    expect(result.success).toBeFalsy();
  });

  it("should return error for trying to init service provider that is not implemented", async () => {
    initAddressService("FAKE_API", 20, AddressProvider.Google);
    const result = await getSuggestions("100 queen");
    expect(result.success).toBeFalsy();
  });
});

describe("Address service with proper init", () => {
  it("should catch error throws from provider service", async () => {
    const mockAddressService: AddressServiceInterface = {
      getSuggestions: jest.fn().mockRejectedValue(new Error("Failed to fetch")),
      apiKey: "sss",
      resultLimit: 20,
    };
    _setAddressService(mockAddressService);
    const result = await getSuggestions("100 queen");
    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error.type).toBe("ERR_OTHERS");
    }
  });
});
