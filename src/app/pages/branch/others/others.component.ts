import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserData } from '@core/models';
import { AuthService, NavigationService, StorageService } from '@core/services';
import { capitalize } from '@utils/capitalize';

@Component({
  selector: 'app-others',
  templateUrl: 'others.component.html',
  styleUrls: ['./others.component.scss'],
})

export class OthersComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    public storageService: StorageService,
    public navigation: NavigationService,
  ) {
    route.params.subscribe(params => this.params = { ...this.params, ...params });
  }

  user: IUserData | undefined
  params: any = {}

  ngOnInit() {
    const userData = this.storageService.getItem('user');
    
    if (userData) {
      this.user = JSON.parse(userData) as IUserData;
    }
  }

  checkUserLogin() {
    return this.user && !!this.user.token;
  }

  capitalizeWord(word: string) {
    return capitalize(word);
  }

  async loginHandler(type: string = 'default') {
    switch(type) {
      case 'google':
        await this.authService.signInGoogle();
        break;
      case 'facebook':
        await this.authService.signInFacebook();
        break;
    }
  }

  goToContact() {
    return this.navigation.navigate('/contacts', {
      queryParams: { companyCode: this.params.companyCode },
    });
  }

  goToFAQ() {
    return this.navigation.navigate('/faq');
  }

  goToAboutUs() {
    return this.navigation.navigate('about-us', {
      relativeTo: this.route,
    });
  }

  goToTNC() {
    return this.navigation.navigate('/tnc');
  }

  async logout() {
    await this.authService.signOut();
    window.location.reload();
    return;
  }
}