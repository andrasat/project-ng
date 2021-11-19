export interface IValidatePaymentResult {
  companyCode: string,
  branchCode: string,
  status: string,
  flagPushToPOS: boolean,
  errorMessage: string,
}