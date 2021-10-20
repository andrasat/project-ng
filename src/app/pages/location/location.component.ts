import { Component, OnInit } from '@angular/core';
import { MapOptions, tileLayer, latLng, Map } from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';

import { LocationService, QSApiService } from '@core/services';
import { IAddress, IAutocompleteResult, IBranchList } from '@core/models';
import { environment } from '@environments/environment';
import { separateAddress } from '@utils/index';

import { take } from 'rxjs/operators';

@Component({
  selector: 'app-location',
  templateUrl: 'location.component.html',
  styleUrls: ['./location.component.scss'],
})

export class LocationComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public locationService: LocationService,
    public qsApiService: QSApiService
  ) {
    route.queryParams.subscribe(params => {
      this.params = params;
    });
  }

  map: Map | undefined = undefined
  mapOptions: MapOptions | null = null
  params: any = {}

  isFavoriteAddressCollapse = true
  branchList: IBranchList | undefined
  currentAddress: IAddress
  devicePosition: GeolocationPosition
  searchResults: IAutocompleteResult[] = []

  ngOnInit() {
    this.locationService.devicePosition
      .pipe(take(1))
      .subscribe(position => {
        this.qsApiService.getAddress(position.coords.latitude, position.coords.longitude)
          .subscribe(data => {
            this.currentAddress = separateAddress(data.address);
          });

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

        this.devicePosition = position;
      });
    
    this.locationService.currentPosition
      .subscribe(position => {
        this.qsApiService.getAddress(position.coords.latitude, position.coords.longitude)
          .subscribe(data => {
            this.currentAddress = separateAddress(data.address);
          });
      });
    
    this.qsApiService.branchList.subscribe(branchList => this.branchList = branchList);
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
    }
  }

  goToDeviceLocation() {
    if (this.map) {
      this.map.panTo(latLng(this.devicePosition.coords.latitude, this.devicePosition.coords.longitude));
    }
  }

  onChangeSearch(keyword: string) {
    this.qsApiService.getSearch(keyword).subscribe(results => {
      this.searchResults = [...results];
    });
  }

  onSelectLocation(data: IAutocompleteResult) {
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
        },
        () => {
          this.locationService.updateCurrentPosition({
            coords: {
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              latitude: -1.1310182000000,
              longitude: 133.5222313000000,
            },
            timestamp: Date.now(),
          });

          this.map?.panTo(latLng(-1.1310182000000, 133.5222313000000));
        }
      );
  }

  continueOnClick() {
    this.router.navigate([`/${this.params.companyCode || this.branchList?.companyCode}`]);
  }
}