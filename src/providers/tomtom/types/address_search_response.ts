export interface AddressSearchResponse {
  summary: {
    query: string;
    queryType: string;
    queryTime: number;
    numResults: number;
    offset: number;
    totalResults: number;
    fuzzyLevel: number;
    queryIntent: any[];
  };
  results: SearchResult[];
}

export interface SearchResult {
  type:
    | "POI"
    | "Cross Street"
    | "Street"
    | "Point Address"
    | "Address Range"
    | string;
  id: string;
  score: number;
  address: AddressDetail;
  position: LatLon;
  viewport: {
    topLeftPoint: LatLon;
    btmRightPoint: LatLon;
  };
  entryPoints?: EntryPoint[];
  addressRanges?: AddressRange;
}

export interface AddressDetail {
  streetNumber: string;
  streetName: string;
  municipalitySubdivision?: string;
  municipality: string;
  countrySecondarySubdivision?: string;
  countrySubdivision: string;
  countrySubdivisionName: string;
  countrySubdivisionCode: string;
  postalCode: string;
  countryCode: string;
  country: string;
  countryCodeISO3: string;
  freeformAddress: string;
  localName: string;
}

export interface LatLon {
  lat: number;
  lon: number;
}

export interface EntryPoint {
  type: string;
  position: LatLon;
}

export interface AddressRange {
  rangeRight: string;
  from: LatLon;
  to: LatLon;
}
