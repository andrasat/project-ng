export interface IFAQs {
  id: number,
  question: string,
  answer: string,
}

export interface IFAQData {
  id: string,
  name: string,
  faqs: IFAQs[],
}