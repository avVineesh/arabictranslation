import { Component, DoCheck, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatMsgComponent } from './chat-msg/chat-msg.component';
import { ThemeConfig } from 'src/app/app-config';

import { TranslateService } from '@ngx-translate/core';
import { LoginserviceService } from 'src/app/demo/extra/login/loginservice.service';
import { RouterModule } from '@angular/router';
import { LanguageService } from 'src/app/theme/shared/service/language.service';
@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [
    SharedModule,
    ChatUserListComponent,
    ChatMsgComponent,
    RouterModule
  ],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class NavRightComponent implements DoCheck, OnInit {

  visibleUserList: boolean;
  chatMessage: boolean;
  friendId: boolean;
  config;
  username: any;

  constructor(
    config: NgbDropdownConfig,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    public service: LoginserviceService,
     private languageService: LanguageService   // add this
  ) {

    config.placement = 'bottom-right';

    this.visibleUserList = false;
    this.chatMessage = false;

    this.config = ThemeConfig;

    this.translate.setDefaultLang(ThemeConfig.i18n);
  }

  ngOnInit() {
(window as any).navRightTranslateService = this.translate;
    this.translate.onLangChange.subscribe((event) => {
    console.log('Lang changed to:', event.lang);
    this.translate.get('Cochin Smart Mission Limited').subscribe(res => {
      console.log('Translated after lang change:', res);
    });
  });

    this.username = localStorage.getItem('username');
  }

  onChatToggle(friend_id) {

    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;

  }

  ngDoCheck() {

    if (document.querySelector('body')?.classList.contains('datta-rtl')) {

      this.config['rtl-layout'] = true;

    } else {

      this.config['rtl-layout'] = false;

    }

  }

  // LANGUAGE CHANGE
  useLanguage(language: string) {
 console.log('Requested language:', language);
    // Change translation
    this.translate.use(language);
this.languageService.setLanguage(language);   // add this line
    // Arabic = RTL
    if (language === 'ar') {

      this.enableRTL();

    } else {

      this.disableRTL();

    }

    // Save selected language
    localStorage.setItem('language', language);
  }

  // ENABLE RTL
  private enableRTL() {

    const body = document.body;

    body.classList.add('datta-rtl');

    body.setAttribute('dir', 'rtl');

    body.setAttribute('lang', 'ar');

    this.config['rtl-layout'] = true;

  }

  // DISABLE RTL
  private disableRTL() {

    const body = document.body;

    body.classList.remove('datta-rtl');

    body.setAttribute('dir', 'ltr');

    body.setAttribute('lang', 'en');

    this.config['rtl-layout'] = false;

  }

  logout() {

    this.authenticationService.logout();

  }

  OnLogOut() {

    localStorage.removeItem('access_token');
    localStorage.removeItem('orgid');
    localStorage.removeItem('Role');
    localStorage.removeItem('privilege');

  }

}