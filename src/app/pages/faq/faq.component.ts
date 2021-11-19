import { Component, OnInit } from '@angular/core';
import { IFAQData } from '@core/models';
import { QSApiService } from '@core/services';

@Component({
  selector: 'app-faq',
  templateUrl: 'faq.component.html',
  styleUrls: ['./faq.component.scss'],
})

export class FAQComponent implements OnInit {
  constructor(
    public qsApiService: QSApiService,
  ) { }

  faqData: IFAQData[] = []
  selectedFAQ: IFAQData | undefined

  ngOnInit() {
    this.qsApiService.getFAQData().subscribe(faqData => {
      this.faqData = faqData;

      this.selectedFAQ = faqData[0];
    });
  }

  selectFAQTab(faq: IFAQData) {
    this.selectedFAQ = faq;
  }
}