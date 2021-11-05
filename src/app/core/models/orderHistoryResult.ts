export interface IOrderHistoryData {
  orderID: string,
  deliveryTransactionID: string,
  transactionDate: string,
  type: string,
  typeName: string,
  companyCode: string,
  branchCode: string,
  branchName: string,
  queueNum: string | null,
  status: string,
  editedDate: string,
  refundStatus: string | null,
  refundUrl: string | null,
}

export interface IOrderHistoryResult {
  data: IOrderHistoryData[],
  _pagination: {
    totalCount: number,
    pageCount: number,
    currentPage: string,
    perPage: string,
  }
}