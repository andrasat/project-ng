import { Component } from '@angular/core';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss']
})
export class QrCodeScannerComponent {
  scanError: Error | undefined
  cameraError: Error | undefined
  hasPermission: boolean | undefined

  scanFailureHandler() {
    this.scanError = new Error('Scan failed');
  }

  scanErrorHandler(error: Error) {
    this.scanError = error;
  }

  camerasFoundHandler(devices: MediaDeviceInfo[]) {
    const hasDevices = Boolean(devices && devices.length);
    if (!hasDevices) this.cameraError = new Error('No cameras');
  }

  scanSuccessHandler(result: string) {
    this.scanError = undefined;
    window.location.href = result;
  }

  hasPermissionHandler(hasPermission: boolean) {
    if (!hasPermission) this.cameraError = new Error('No permission');
  }
}
