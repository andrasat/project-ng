import { Inject, Injectable } from "@angular/core";
import { StorageService as NgStorageService } from "@ng-web-apis/storage";

import { utf8ToBase64, base64ToUtf8 } from '@utils/index';

@Injectable()
export class StorageService {
  constructor(
    @Inject(NgStorageService) private readonly storageService: Storage
  ) {}

  setItem(key: string, value: string) {
    this.storageService.setItem(utf8ToBase64(key), utf8ToBase64(value));
  }

  removeItem(key: string) {
    this.storageService.removeItem(utf8ToBase64(key));
  }

  getItem(key: string) {
    const value = this.storageService.getItem(utf8ToBase64(key));
    return value ? base64ToUtf8(value) : null;
  }
}