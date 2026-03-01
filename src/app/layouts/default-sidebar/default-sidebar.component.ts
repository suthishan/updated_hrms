import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SideBar, SideBarMenu,SubMenu } from '../../core/models/models';
import { DataService } from '../../core/services/data/data.service';
import { SideBarService } from '../../core/services/side-bar/side-bar.service';
import { CommonService } from '../../core/services/common/common.service';
import { routes } from '../../core/routes/routes';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SettingService } from '../../core/services/settings/settings.service';
@Component({
    selector: 'app-default-sidebar',
    templateUrl: './default-sidebar.component.html',
    styleUrl: './default-sidebar.component.scss',
    imports: [CommonModule,RouterLink,NgScrollbarModule,RouterLinkActive]
})
export class DefaultSidebarComponent implements OnDestroy , OnInit{
  public routes = routes;
  public multilevel: boolean[] = [false, false, false];
  base = '';
  page = '';
  last = '';
  page1='';
  common_path='';
  isOpen=false;
  openMenuItem: any = null;
  openSubmenuOneItem: any = null;
  side_bar_data: SideBar[] = [];
  constructor(
    public router: Router,
    private data: DataService,
    private sideBar: SideBarService,
    private common: CommonService,
    private settings: SettingService
  ) {


    // get sidebar data as observable because data is controlled for design to expand submenus
    this.data.getSideBarData.subscribe((res: SideBar[]) => {
      this.side_bar_data = res;
    });
    this.common.base.subscribe((res: string) => {
      this.base = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page = res;
    });
    this.common.last.subscribe((res: string) => {
      this.last = res;
    });
    this.common.page.subscribe((res: string) => {
      this.page1 = res;
    });
   
  }
private previousBase: string | null = null;


  public miniSideBarMouseHover(position: string): void {
    if (position === 'over') {
      this.sideBar.expandSideBar.next(true);
      this.settings.hoverState.next('over');
    } else {
      this.sideBar.expandSideBar.next(false);
      this.settings.hoverState.next('out');
    }
  }
  public expandSubMenus(menu: SideBarMenu): void {
    this.isOpen= false
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.side_bar_data.map((mainMenus: SideBar) => {
      mainMenus.menu.map((resMenu: SideBarMenu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;

        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
 isActive(menuBase: string): boolean {
    return this.router.url.includes(menuBase);
  }

  public expandSubMenusActive(): void {
    const activeMenu = sessionStorage.getItem('menuValue');
    if(activeMenu === null) {
      this.side_bar_data.map((mainMenus: SideBar) => {
        mainMenus.menu.map((resMenu: SideBarMenu) => {
          // collapse other submenus which are open
          if (resMenu.menuValue == 'Dashboard') {
            resMenu.showSubRoute = true;
          } else {
            resMenu.showSubRoute = false;
          }
        });
      });
      this.isOpen = true
    }else {
      this.isOpen= false
    }
    this.side_bar_data.map((mainMenus: SideBar) => {
      mainMenus.menu.map((resMenu: SideBarMenu) => {
        // collapse other submenus which are open
        if (resMenu.menuValue === activeMenu) {
          resMenu.showSubRoute = true;

        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
private collapseAllMenus(newBase: string): void {
  this.side_bar_data.forEach((mainMenus: SideBar) => {
    mainMenus.menu.forEach((menu: SideBarMenu) => {
       menu.showSubRoute = menu.base === newBase; 
    });
  });

   sessionStorage.setItem('menuValue', newBase);
  this.isOpen = false;
   this.openMenuItem = null;
  this.openSubmenuOneItem = null;
}

private reopenActiveMenu(base: string): void {
  this.side_bar_data.forEach((mainMenus: SideBar) => {
    mainMenus.menu.forEach((menu: SideBarMenu) => {
      if (menu.base === base) {
        menu.showSubRoute = true;   // keep open
        sessionStorage.setItem('menuValue', menu.menuValue);
      }
    });
  });
}


  ngOnInit(): void {
    this.expandSubMenusActive();
    this.router.events.subscribe((event: object) => {
      if (event instanceof NavigationStart) {
        const splitVal = event.url.split('/');
        this.base = splitVal[1];
        this.page = splitVal[2];
        this.last = splitVal[3];
        this.page1 = splitVal[4];
      if(this.page === 'tenant-ticket-details'){
        this.common_path = 'tenant-support-tickets'
      }
      else if(this.page == 'agents' || this.page == 'sla-policies' || this.page == 'escalation-rules'){
        this.common_path = 'tickets'
      }
      else {
        this.common_path =''
      }
        const newBase = splitVal[1];
          // 🔥 Collapse ONLY if base changed
     if (this.previousBase && this.previousBase !== newBase) {
          this.collapseAllMenus(newBase);
        }
      

      // 🔥 If same base, keep current submenu open
      if (this.previousBase === newBase) {
        this.reopenActiveMenu(newBase);
      }

      this.previousBase = newBase;
      }
    
  });
  }
  ngOnDestroy(): void {
    this.data.resetData();
  }
  miniSideBarBlur(position: string) {
    if (position === 'over') {
      this.settings.hoverState.next('over');
    } else {
      this.settings.hoverState.next('out');
    }
  }

  miniSideBarFocus(position: string) {
    if (position === 'over') {
      this.settings.hoverState.next('over');
    } else {
      this.settings.hoverState.next('out');
    }
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
