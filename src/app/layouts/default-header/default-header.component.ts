import { Component } from '@angular/core';
import { MainMenu, Menu } from '../../core/models/models';
import { DataService } from '../../core/services/data/data.service';
import { CommonService } from '../../core/services/common/common.service';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { SideBarService } from '../../core/services/side-bar/side-bar.service';
import { routes } from '../../core/routes/routes';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SettingService } from '../../core/services/settings/settings.service';
@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
    styleUrl: './default-header.component.scss',
    imports: [CommonModule,RouterLink,NgScrollbarModule]
})
export class DefaultHeaderComponent {
  showSubMenusTab = true;
  public multilevel: boolean[] = [false, false, false];
  openMenuItem: any = null;
  openSubmenuOneItem: any = null;
  base = 'dashboard';
  public page = '';
  last = '';
  public routes = routes;
  public miniSidebar = false;
  public baricon = false;
  themeIcon=true;
  toggleThemeIcon() {
    this.themeIcon = !this.themeIcon;
  }
  side_bar_data: MainMenu[] = [];
  constructor(
    private data: DataService,
    private sideBar: SideBarService,
    private common: CommonService,
    private router: Router,
    public settings: SettingService

  ) {
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.page.subscribe((res: string) => {
      this.last = res;
    });
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res === 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        if (
          this.base === 'components' ||
          this.page === 'tasks' ||
          this.page === 'email'
        ) {
          this.baricon = false;
          localStorage.setItem('baricon', 'false');
        } else {
          this.baricon = true;
          localStorage.setItem('baricon', 'true');
        }
      }
    });
    if (localStorage.getItem('baricon') == 'true') {
      this.baricon = true;
    } else {
      this.baricon = false;
    }
    // get sidebar data as observable because data is controlled for design to expand submenus
    this.data.getSideBarData3.subscribe((res: MainMenu[]) => {
      this.side_bar_data = res;
    });
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }
  elem = document.documentElement;
  fullscreen() {
    if (!document.fullscreenElement) {
      this.elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  public togglesMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
    
  }
  public menuToggle() {
    this.showSubMenusTab = !this.showSubMenusTab;
  }
  public expandSubMenus(menu: Menu): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: MainMenu) => {
      mainMenus.menu.map((resMenu: Menu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
          if (menu.showSubRoute === false) {
            sessionStorage.removeItem('menuValue');
          }
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
    public miniSideBarMouseHover(position: string): void {
      this.sideBar.toggleSideBar.subscribe((res: string) => {
        if (res === 'true' || res === 'true') {
          if (position === 'over') {
            this.sideBar.expandSideBar.next(true);
            this.showSubMenusTab = false;
          } else {
            this.sideBar.expandSideBar.next(false);
            this.showSubMenusTab = true;
          }
        }
      });
    }
    ngOnDestroy(): void {
      this.data.resetData2();
    }
    miniSideBarBlur(position: string) {
      if (position === 'over') {
        this.sideBar.expandSideBar.next(true);
      } else {
        this.sideBar.expandSideBar.next(false);
      }
    }

    miniSideBarFocus(position: string) {
      if (position === 'over') {
        this.sideBar.expandSideBar.next(true);
      } else {
        this.sideBar.expandSideBar.next(false);
      }
    }
    public submenus = false;
    openSubmenus() {
      this.submenus = !this.submenus;
    }

    openMenu(menu: any): void {
      if (this.openMenuItem === menu) {
        this.openMenuItem = null;
      } else {
        this.openMenuItem = menu;
      }
    }
    openSubmenuOne(subMenus: any): void {
      if (this.openSubmenuOneItem === subMenus) {
        this.openSubmenuOneItem = null;
      } else {
        this.openSubmenuOneItem = subMenus;
      }
    }
}
