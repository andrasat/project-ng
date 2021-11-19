import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MapOptions, tileLayer, latLng, Map } from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, LocationService, NavigationService, QSApiService, StorageService } from '@core/services';
import { IAddress, IAutocompleteResult, IBranches, IBranchList, IOrderInput, IProfile, IProfileAddress, ISaveAddressInput, IUserData } from '@core/models';
import { environment } from '@environments/environment';

import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-location',
  templateUrl: 'location.component.html',
  styleUrls: ['./location.component.scss'],
})

export class LocationComponent implements OnInit, OnDestroy {
  constructor(
    public zone: NgZone,
    public route: ActivatedRoute,
    public router: Router,
    public locationService: LocationService,
    public navigation: NavigationService,
    public qsApiService: QSApiService,
    public authService: AuthService,
    public storageService: StorageService,
  ) {
    route.queryParams.subscribe(queryParams => {
      this.queryParams = queryParams;
    });
  }

  private unsubscribe$ = new Subject<void>()

  map: Map | undefined = undefined
  mapOptions: MapOptions | null = null
  queryParams: any = {}

  hideCollapse = true
  showOutOfReachError = false
  isLoggedIn = false
  branchList: IBranchList | undefined
  currentAddress: IAddress | undefined
  user: IUserData | undefined
  orderInput: IOrderInput
  devicePosition: GeolocationPosition
  currentPosition: GeolocationPosition
  searchResults: IAutocompleteResult[] = []
  openBranches: IBranches[] = []
  savedAddresses: IProfileAddress[] = []

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.locationService.devicePosition
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(position => this.devicePosition = position);
    this.locationService.currentPosition
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(position => this.currentPosition = position);

    this.locationService.currentPosition
      .pipe(take(1))
      .subscribe(position => {
        this.currentPosition = position;
        this.mapOptions = {
          layers: [
            tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
              attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
              maxZoom: 18,
              id: 'mapbox/streets-v11',
              tileSize: 512,
              zoomOffset: -1,
              accessToken: environment.mapboxToken,
            })
          ],
          zoomControl: false,
          zoom: 15,
          center: latLng(position.coords.latitude, position.coords.longitude)
        };

        this.qsApiService.getBranchList(position.coords.latitude, position.coords.longitude);
        this.qsApiService.getAddress(position.coords.latitude, position.coords.longitude);
      });

    this.qsApiService.branchList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(branchList => {
        this.branchList = branchList;

        this.openBranches = branchList ?
          branchList.branches.filter(branch => branch.businessHour.status.includes('open') && branch.flagNearMe)
          : [];
      });

    this.qsApiService.currentAddress
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(address => {
        this.zone.run(() => this.currentAddress = address);

        if (this.queryParams.companyCode && this.queryParams.branchCode && address) {
          const orderInputData = this.storageService.getItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`);

          if (orderInputData) {
            this.orderInput = JSON.parse(orderInputData);
            this.orderInput.deliveryAddress = `${address.addressName}, ${address.address}`;
          }
        }
      });

    this.qsApiService.profile
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(profile => {

        if (profile) this.savedAddresses = [...profile.addresses];
      });

    this.authService.isLoggedIn
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        const userData = this.storageService.getItem('user');

        if (isLoggedIn && userData) {
          const user = JSON.parse(userData) as IUserData;
          this.user = user;

          if (user.token) this.qsApiService.getProfile(user.token);
        }
      });
  }

  openCollapse() {
    this.hideCollapse = false;
  }

  setNotes(notes: string) {
    this.storageService.setItem('deliveryAddressInfo', notes);

    if (this.queryParams.companyCode && this.queryParams.branchCode && this.orderInput) {
      this.orderInput.deliveryAddressInfo = notes;
      this.storageService.setItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`, JSON.stringify(this.orderInput));
    }
  }

  saveFavouriteAddress(data: IAutocompleteResult) {
    this.hideCollapse = true;

    this.qsApiService.getPlace(data.placeId)
      .subscribe(place => {
        this.locationService.updateCurrentPosition({
            coords: {
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              latitude: place.lat,
              longitude: place.long,
            },
            timestamp: Date.now(),
          });

          this.map?.panTo(latLng(place.lat, place.long));

          if (this.user && this.user.token) {
            const notes = this.storageService.getItem('deliveryAddressInfo');
            const addressData = {
              description: data.description,
              latitude: String(place.lat),
              longitude: String(place.long),
              notes: notes || '',
            } as ISaveAddressInput;

            this.qsApiService.saveAddress(addressData, this.user.token)
              .subscribe(() => this.qsApiService.getProfile(this.user!.token!));
          }
      });
  }

  deleteFavouriteAddress(data: IProfileAddress) {
    if (this.user && this.user.token) {
      this.qsApiService.deleteAddress(Number(data.latitude), Number(data.longitude), this.user.token)
        .subscribe(() => this.qsApiService.getProfile(this.user!.token!));
    }
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('moveend', () => this.onMapMoveEnd());
  }

  onMapMoveEnd() {
    const center = this.map?.getCenter();

    if (center) {
      this.locationService.updateCurrentPosition({
        coords: {
          accuracy: 0,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          latitude: center.lat,
          longitude: center.lng,
        },
        timestamp: Date.now(),
      });

      this.qsApiService.getAddress(center.lat, center.lng);
    }
  }

  goToDeviceLocation() {
    if (this.map) {
      this.map.panTo(latLng(this.devicePosition.coords.latitude, this.devicePosition.coords.longitude));
    }
  }

  onChangeSearch(keyword: string) {
    this.qsApiService.getSearch(keyword).subscribe(results => {
      this.searchResults = results.reduce((filteredResults: IAutocompleteResult[], nextAddress) => {
        const foundFavAddress = this.savedAddresses.find(address => address.addressDescription === nextAddress.description);
        if (foundFavAddress) return filteredResults;
        return [...filteredResults, nextAddress];
      }, []);
    });
  }

  onSelectFavouriteLocation(data: IProfileAddress) {
    this.hideCollapse = true;

    this.locationService.updateCurrentPosition({
      coords: {
        accuracy: 0,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      },
      timestamp: Date.now(),
    });

    this.map?.panTo(latLng(Number(data.latitude), Number(data.longitude)));
  }

  onSelectLocation(data: IAutocompleteResult) {
    this.hideCollapse = true;

    this.qsApiService.getPlace(data.placeId)
      .subscribe(
        place => {
          this.locationService.updateCurrentPosition({
            coords: {
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              latitude: place.lat,
              longitude: place.long,
            },
            timestamp: Date.now(),
          });

          this.map?.panTo(latLng(place.lat, place.long));
        }
      );
  }

  goToRestaurant(branchCode: string) {
    return this.navigation.navigate(`/${this.queryParams.companyCode || this.branchList?.companyCode}/${branchCode}`, { replaceUrl: true });
  }

  goBack() {
    if (this.queryParams.companyCode && this.queryParams.branchCode && this.queryParams.from) {
      this.navigation.back(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/checkout`, {
        queryParams: {
          mode: this.orderInput.type,
        }
      });
      return;
    }

    this.navigation.back(`/${this.queryParams.companyCode || this.branchList?.companyCode}`);
  }

  continueOnClick() {
    if (this.queryParams.companyCode && this.queryParams.branchCode && this.queryParams.from) {

      this.qsApiService.validateRadius(this.currentPosition.coords.latitude, this.currentPosition.coords.longitude, this.queryParams.branchCode)
        .subscribe(
          result => {
            if (!result?.inRange) {
              this.hideCollapse = false;
              this.showOutOfReachError = true;
              return;
            }

            this.storageService.setItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`, JSON.stringify(this.orderInput));

            this.navigation.navigate(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/checkout`, {
              queryParams: {
                mode: this.orderInput.type,
              }
            });
          },
          () => {
            this.storageService.setItem(`order_${this.queryParams.companyCode}_${this.queryParams.branchCode}`, JSON.stringify(this.orderInput));

            this.navigation.navigate(`/${this.queryParams.companyCode}/${this.queryParams.branchCode}/checkout`, {
              queryParams: {
                mode: this.orderInput.type,
              }
            });
          }
        );

      return;
    }

    this.navigation.navigate(`/${this.queryParams.companyCode || this.branchList?.companyCode}`);
  }
}