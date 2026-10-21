import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/theme/shared/service/language.service';
@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent implements OnInit, OnDestroy {
  navCollapsed = true;
  adminview: number = 1;
  managementview: number = 1;
  parkingitems: number = 1;
  analyticsview: number = 1;
  financeview: number = 1;
  selectedMenu: any = '';
  pageTitle = '';
  pageSubtitle = '';
  instanceId = Math.random(); // TEMP DEBUG

  private langSub?: Subscription;

  constructor(public router: Router, private translate: TranslateService, private cdr: ChangeDetectorRef, private languageService: LanguageService) {
    console.log('Component CREATED, instanceId:', this.instanceId,);
  }

  ngOnInit() {
    console.log('Same TranslateService instance as nav-right?', (window as any).navRightTranslateService === this.translate);
    console.log('ngOnInit called for instanceId:', this.instanceId);

    this.updateTranslations();

  this.langSub = this.languageService.currentLang$.subscribe(lang => {
    this.translate.use(lang);       // force this component's own translate call to switch too
    this.updateTranslations();
  });

    const nav = document.querySelector('.pcoded-navbar');
    if (nav) {
      nav.classList.add('navbar-collapsed');
    }
    this.privilegeSettings();
  }

  updateTranslations() {
    this.translate
      .get([
        'Cochin Smart Mission Limited',
        'Smart urban infrastructure and intelligent parking solutions for the future city of Kochi.'
      ])
      .subscribe(translations => {
        this.pageTitle = translations['Cochin Smart Mission Limited'];
        this.pageSubtitle =
          translations['Smart urban infrastructure and intelligent parking solutions for the future city of Kochi.'];

        console.log('pageTitle set to:', this.pageTitle, 'on instanceId:', this.instanceId);

        try {
          this.cdr.detectChanges();
        } catch (e) {
          console.warn('detectChanges skipped (component likely destroyed):', e);
        }
      });
  }

  showNavbar() {
    const nav = document.querySelector('.pcoded-navbar');
    if (nav) {
      nav.classList.remove('navbar-collapsed');
    }
  }

  openMenu(item: any) {
    // Expand sidebar
    const nav = document.querySelector('.pcoded-navbar');
    if (nav) {
      nav.classList.remove('navbar-collapsed');
    }

    setTimeout(() => {
      // Remove other opened menus
      document.querySelectorAll('.pcoded-hasmenu').forEach((el: any) => {
        el.classList.remove('pcoded-trigger');
      });

      // Open management menu
      const menu: any = document.getElementById(item);
      if (menu) {
        menu.classList.add('pcoded-trigger');

        // Optional for some templates
        const submenu = menu.querySelector('.pcoded-submenu');
        if (submenu) {
          submenu.style.display = 'block';
        }
      }
    }, 300);
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();

    const nav = document.querySelector('.pcoded-navbar');
    if (nav) {
      nav.classList.remove('navbar-collapsed');
    }
  }

  privilegeSettings() {
    const privilege = localStorage.getItem('privilege');

    if (!privilege) {
      return;
    }

    const StaffPriData = JSON.parse(privilege);

    const data = StaffPriData?.Privileges;

    if (!data || data.length === 0) {
      return;
    }

    const finance = data[0]?.Finanace;
    const analytics = data[0]?.Analytics;
    const adminsetting = data[0]?.AdminSetting;
    const parksetting = data[0]?.ParkingSetting;
    const management = data[0]?.Management;

    // ADMIN
    if (
      !adminsetting?.OrgProf?.View &&
      !adminsetting?.Role?.View &&
      !adminsetting?.Staff?.View &&
      !adminsetting?.Tariff?.View &&
      !adminsetting?.OrgType?.View &&
      !adminsetting?.orgfunctionalmap?.View &&
      !adminsetting?.orgdomain?.View
    ) {
      this.adminview = 0;
    }

    // MANAGEMENT
    if (
      !management?.MonthlyPass?.View &&
      !management?.CustomerDet?.View &&
      !management?.BookingDetails?.View &&
      !management?.NetworkMonitor?.View &&
      !management?.servicemonitor?.View &&
      !management?.boombarrierlog?.View &&
      !management?.valetdetails?.View &&
      !management?.employeetag?.View &&
      !management?.attendanceregister?.View &&
      !management?.blacklistedvehicles?.View &&
      !management?.assets?.View
    ) {
      this.managementview = 0;
    }

    // PARKING
    if (
      !parksetting?.ParkingSpace?.View &&
      !parksetting?.ParkingLots?.View &&
      !parksetting?.boombarrier?.View &&
      !parksetting?.sensor?.View &&
      !parksetting?.display?.View &&
      !parksetting?.posdevices?.View &&
      !parksetting?.rfreaders?.View
    ) {
      this.parkingitems = 0;
    }

    // ANALYTICS
    if (
      !analytics?.ParkingAreaReport?.View &&
      !analytics?.ParkedVehicle?.View &&
      !analytics?.Summary?.View &&
      !analytics?.Occupancy?.View &&
      !analytics?.customanalytics?.View &&
      !analytics?.parkinghistory?.View
    ) {
      this.analyticsview = 0;
    }

    // FINANCE
    if (
      !finance?.Paymentlog?.View &&
      !finance?.Refunds?.View &&
      !finance?.Reconciliation?.View &&
      !management?.FasTagdetails?.View
    ) {
      this.financeview = 0;
    }
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu;
    // existing function
    this.openMenu(menu);
  }
}