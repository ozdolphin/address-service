import { initAddressService, getSuggestions, AddressProvider } from "../index";
import { TomTomAddressService } from "../../src/providers/tomtom/tom_tom_address_service";
import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";

const API_KEY = "adasd";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.resetAllMocks(); // clears usage data like call count, etc.
});

describe("TomTom Service with invalid init", () => {
  it("should return error when limit is greater than 100", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            type: "Point Address",
            score: 3.9093766212,
            address: {
              streetNumber: "100",
              streetName: "Queen Circuit",
              countrySubdivisionCode: "VIC",
              postalCode: "3020",
              country: "Australia",
              freeformAddress: "100 Queen Circuit, Sunshine, VIC, 3020",
              localName: "Sunshine",
            },
            position: {
              lat: -37.796648,
              lon: 144.828886,
            },
          },
        ],
      },
    });

    initAddressService(API_KEY, 110, AddressProvider.TomTom);
    const result = await getSuggestions("100 Queen");

    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error.type).toBe("ERR_REQUEST");
    }
  });
  it("should return error when limit is greater than 100", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            type: "Point Address",
            score: 3.9093766212,
            address: {
              streetNumber: "100",
              streetName: "Queen Circuit",
              countrySubdivisionCode: "VIC",
              postalCode: "3020",
              country: "Australia",
              freeformAddress: "100 Queen Circuit, Sunshine, VIC, 3020",
              localName: "Sunshine",
            },
            position: {
              lat: -37.796648,
              lon: 144.828886,
            },
          },
        ],
      },
    });
    initAddressService(API_KEY, 110, AddressProvider.TomTom);
    const result = await getSuggestions("100 Queen");

    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error.type).toBe("ERR_REQUEST");
    }
  });
});

describe("Address service with default init", () => {
  it("should return results from a valid partial address input", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            type: "Point Address",
            score: 3.9093766212,
            address: {
              streetNumber: "100",
              streetName: "Queen Circuit",
              countrySubdivisionCode: "VIC",
              postalCode: "3020",
              country: "Australia",
              freeformAddress: "100 Queen Circuit, Sunshine, VIC, 3020",
              localName: "Sunshine",
            },
            position: {
              lat: -37.796648,
              lon: 144.828886,
            },
          },
        ],
      },
    });
    initAddressService(API_KEY);
    const result = await getSuggestions("100 Queen");

    expect(result.success).toBeTruthy();
    if (result.success) {
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      for (const suggestion of result.data) {
        expect(suggestion).toHaveProperty("fullAddress");
      }
    }
  });
});

describe("TomTom Service with invalid API key", () => {
  it("should return error with incorrect API key", async () => {
    const axiosError = {
      name: "AxiosError",
      message: "Request failed",
      isAxiosError: true,
      response: {
        data: {
          detailedError: {
            code: "Forbidden",
            message: "You are not allowed to access this endpoint",
          },
        },
        status: 403,
        statusText: "Forbidden",
        headers: {},
        config: {},
      },
      code: "ERR_BAD_REQUEST",
      config: {},
      toJSON: () => ({}),
    };

    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    mockedAxios.get.mockRejectedValue(axiosError);
    initAddressService(API_KEY);
    const result = await getSuggestions("100 Queen");

    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error.type).toBe("ERR_PROVIDER");
    }
  });
});

describe("TomTom address service with proper init", () => {
  beforeEach(() => {
    initAddressService(API_KEY, 10, AddressProvider.TomTom);
  });
  it("should return error for empty partial address input", async () => {
    const result = await getSuggestions("");

    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error.type).toBe("ERR_REQUEST");
    }
  });
  it("should return results from a valid partial address input", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [
          {
            type: "Point Address",
            score: 3.9093766212,
            address: {
              streetNumber: "100",
              streetName: "Queen Circuit",
              countrySubdivisionCode: "VIC",
              postalCode: "3020",
              country: "Australia",
              freeformAddress: "100 Queen Circuit, Sunshine, VIC, 3020",
              localName: "Sunshine",
            },
            position: {
              lat: -37.796648,
              lon: 144.828886,
            },
          },
          {
            type: "Point Address",
            score: 3.9093766212,
            address: {
              streetNumber: "100",
              streetName: "Quinn Crescent",

              countrySubdivisionCode: "VIC",
              postalCode: "3796",

              country: "Australia",

              freeformAddress: "100 Quinn Crescent, Mount Evelyn, VIC, 3796",
              localName: "Mount Evelyn",
            },
            position: {
              lat: -37.790149,
              lon: 145.365722,
            },
          },
        ],
      },
    });
    const result = await getSuggestions("100 Queen");

    expect(result.success).toBeTruthy();
    if (result.success) {
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(10);
      expect(result.data.length).toBeGreaterThan(0);
      for (const suggestion of result.data) {
        expect(suggestion).toHaveProperty("fullAddress");
      }
    }
  });

  it("should return empty result for invalid input", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        results: [],
      },
    });
    const result = await getSuggestions("aslkdjfalskdjf");
    expect(result.success).toBeTruthy();
    if (result.success) {
      expect(result.data.length).toBe(0);
    }
  });
});

describe("TomTom Service that catch generic error", () => {
  it("returns ERR_OTHERS if non-Axios error is thrown", async () => {
    const service = new TomTomAddressService("", 10);

    // jest.spyOn(service, "getSuggestions").mockImplementation(() => {
    //   throw new Error("Something went wrong");
    // });
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const result = await getSuggestions("Some input");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.type).toBe("ERR_OTHERS");
  });
});
