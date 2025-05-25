export interface DetailedError {
  message: string;
  details?: any;
  type: "ERR_REQUEST" | "ERR_PROVIDER" | "ERR_OTHERS";
}
