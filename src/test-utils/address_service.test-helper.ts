import { AddressServiceInterface } from "../providers/address_service_interface";
import * as addressProvider from "../index";

export const _setAddressService = (service: AddressServiceInterface) => {
  // Patch into the actual module-scoped addressService
  const hook = (globalThis as any).__addressServiceTestHook;
  hook.__TEST_setAddressService(service);
};
