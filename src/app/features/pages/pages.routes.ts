import { Routes } from '@angular/router';

export const Page_routes: Routes = [
  { path: '', redirectTo: 'dashboard/index', pathMatch: 'full' },
  {
    path: '', loadComponent: () => import('./pages.component').then(m => m.PagesComponent),
    children: [
      {
        path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
          { path: 'index', loadComponent: () => import('./dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
          { path: 'employee', loadComponent: () => import('./dashboard/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent) },
          { path: 'deals', loadComponent: () => import('./dashboard/deals-dashboard/deals-dashboard.component').then(m => m.DealsDashboardComponent) },
          { path: 'leads', loadComponent: () => import('./dashboard/leads-dashboard/leads-dashboard.component').then(m => m.LeadsDashboardComponent) },
          { path: 'hr', loadComponent: () => import('./dashboard/hr-dashboard/hr-dashboard.component').then(m => m.HrDashboardComponent) },
          { path: 'payroll', loadComponent: () => import('./dashboard/payroll-dashboard/payroll-dashboard.component').then(m => m.PayrollDashboardComponent) },
          { path: 'recruitment', loadComponent: () => import('./dashboard/recruitment-dashboard/recruitment-dashboard.component').then(m => m.RecruitmentDashboardComponent) },
          { path: 'attendance', loadComponent: () => import('./dashboard/attendance-dashboard/attendance-dashboard.component').then(m => m.AttendanceDashboardComponent) },
          { path: 'finance', loadComponent: () => import('./dashboard/finance-dashboard/finance-dashboard.component').then(m => m.FinanceDashboardComponent) },
          { path: 'it-admin', loadComponent: () => import('./dashboard/it-admin-dashboard/it-admin-dashboard.component').then(m => m.ItAdminDashboardComponent) },
          { path: 'asset', loadComponent: () => import('./dashboard/asset-dashboard/asset-dashboard.component').then(m => m.AssetDashboardComponent) },
          { path: 'help-desk', loadComponent: () => import('./dashboard/help-desk-dashboard/help-desk-dashboard.component').then(m => m.HelpDeskDashboardComponent) },
        ]
      },
      //Application//
      { path: 'application', loadComponent: () => import('./application/application.component').then(m => m.ApplicationComponent),
          children: [
            { path: 'chats', loadComponent: () => import('./application/chat/chat.component').then(m => m.ChatComponent) },
            { path: 'calendar', loadComponent: () => import('./application/calendar/calendar.component').then((m) => m.CalendarComponent),},
            { path: 'email', loadComponent: () => import('./application/email/email.component').then((m) => m.EmailComponent),},
            { path: 'calls/call-history', loadComponent: () => import('./application/call/call-history/call-history.component').then(m => m.CallHistoryComponent) },
            { path: 'calls/voice-call', loadComponent: () => import('./application/call/voice-call/voice-call.component').then(m => m.VoiceCallComponent) },
            { path: 'calls/video-call', loadComponent: () => import('./application/call/video-call/video-call.component').then(m => m.VideoCallComponent) },
            { path: 'calls/outgoing-call', loadComponent: () => import('./application/call/outgoing-call/outgoing-call.component').then(m => m.OutgoingCallComponent) },
            { path: 'calls/incoming-call', loadComponent: () => import('./application/call/incoming-call/incoming-call.component').then(m => m.IncomingCallComponent) },
            { path: 'todo', loadComponent: () => import('./application/todo/todo.component').then(m => m.TodoComponent) },
            { path: 'notes', loadComponent: () => import('./application/notes/notes.component').then(m => m.NotesComponent) },
            { path: 'todo-list', loadComponent: () => import('./application/todo-list/todo-list.component').then(m => m.TodoListComponent) },
            { path: 'file-manager', loadComponent: () => import('./application/file-manager/file-manager.component').then(m => m.FileManagerComponent) },
            { path: 'social-feed', loadComponent: () => import('./application/social-feed/social-feed.component').then(m => m.SocialFeedComponent) },
            { path: 'kanban-view', loadComponent: () => import('./application/kanban-view/kanban-view.component').then(m => m.KanbanViewComponent) },

          ]
        },
        //Super Admin//
        {path: 'super-admin', loadComponent: () => import('./super-admin/super-admin.component').then(m => m.SuperAdminComponent),
        children: [
            { path: 'super-admin-dashboard', loadComponent: () => import('./super-admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'companies', loadComponent: () => import('./super-admin/companies/companies.component').then(m => m.CompaniesComponent) },
            { path: 'subscriptions', loadComponent: () => import('./super-admin/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent) },
            { path: 'packages', loadComponent: () => import('./super-admin/packages/packages.component').then(m => m.PackagesComponent) },
            { path: 'packages-grid', loadComponent: () => import('./super-admin/packages-grid/packages-grid.component').then(m => m.PackagesGridComponent) },
            { path: 'purchase-transaction', loadComponent: () => import('./super-admin/purchase-transaction/purchase-transaction.component').then(m => m.PurchaseTransactionComponent) },
            { path: 'domain', loadComponent: () => import('./super-admin/domain/domain.component').then(m => m.DomainComponent) },
            { path: 'tenant-usage-metrics', loadComponent: () => import('./super-admin/tenant-usage-metrics/tenant-usage-metrics.component').then(m => m.TenantUsageMetricsComponent) },
            { path: 'tenant-support-tickets', loadComponent: () => import('./super-admin/tenant-support-tickets/tenant-support-tickets.component').then(m => m.TenantSupportTicketsComponent) },
            { path: 'tenant-ticket-details', loadComponent: () => import('./super-admin/tenant-ticket-details/tenant-ticket-details.component').then(m => m.TenantTicketDetailsComponent) },
            { path: 'agents', loadComponent: () => import('./super-admin/tickets/agents/agents.component').then(m => m.AgentsComponent) },
            { path: 'sla-policies', loadComponent: () => import('./super-admin/tickets/sla-policies/sla-policies.component').then(m => m.SlaPoliciesComponent) },
            { path: 'escalation-rules', loadComponent: () => import('./super-admin/tickets/escalation-rules/escalation-rules.component').then(m => m.EscalationRulesComponent) },
          ]
        },
        //Projects//
        { path: 'client', loadComponent: () => import('./client/client.component').then(m => m.ClientComponent),
          children:[
                    { path: 'client-list', loadComponent: () => import('./client/client-list/client-list.component').then(m => m.ClientListComponent) },
              { path: 'client-grid', loadComponent: () => import('./client/client-grid/client-grid.component').then(m => m.ClientGridComponent) },
              { path: 'client-details', loadComponent: () => import('./client/client-details/client-details.component').then(m => m.ClientDetailsComponent) },
          ]
         },
         //pages//
         { path: 'starter', loadComponent: () => import('./pages/starter/starter.component').then(m => m.StarterComponent) },
          { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
          { path: 'gallery', loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent) },
          { path: 'search-result', loadComponent: () => import('./pages/search-result/search-result.component').then(m => m.SearchResultComponent) },
          { path: 'timeline', loadComponent: () => import('./pages/timeline/timeline.component').then(m => m.TimelineComponent) },
          { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },

          { path: 'privacy-policy', loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent) },
          { path: 'terms-condition', loadComponent: () => import('./pages/terms-condition/terms-condition.component').then(m => m.TermsConditionComponent) },
         { path: 'api-keys', loadComponent: () => import('./pages/api-keys/api-keys.component').then(m => m.ApiKeysComponent) },
         

        { path:'projects',loadComponent:() => import('./projects/projects.component').then((m)=>m.ProjectsComponent),
          children: [
            { path: 'project-list', loadComponent: () => import('./projects/project-list/project-list.component').then(m => m.ProjectListComponent) },
            { path: 'project-grid', loadComponent: () => import('./projects/project-grid/project-grid.component').then(m => m.ProjectGridComponent) },
            { path: 'project-details', loadComponent: () => import('./projects/project-details/project-details.component').then(m => m.ProjectDetailsComponent) },
            { path: 'task-details', loadComponent: () => import('./projects/task-details/task-details.component').then(m => m.TaskDetailsComponent) },
            { path: 'tasks', loadComponent: () => import('./projects/tasks/tasks.component').then(m => m.TasksComponent) },
            { path: 'task-board', loadComponent: () => import('./projects/task-board/task-board.component').then(m => m.TaskBoardComponent) }
          ]
        },
        //Content//
        { path: 'pages', loadComponent: () => import('./content/pages/pages.component').then(m => m.PagesComponent) },
      { path: 'blogs', loadComponent: () => import('./content/blogs/blogs.component').then(m => m.BlogsComponent),
        children:[
          { path: 'all-blogs', loadComponent: () => import('./content/blogs/all-blogs/all-blogs.component').then(m => m.AllBlogsComponent) },
          { path: 'blog-categories', loadComponent: () => import('./content/blogs/blog-categories/blog-categories.component').then(m => m.BlogCategoriesComponent) },
          { path: 'blog-tags', loadComponent: () => import('./content/blogs/blog-tags/blog-tags.component').then(m => m.BlogTagsComponent) },
          { path: 'blog-comments', loadComponent: () => import('./content/blogs/blog-comments/blog-comments.component').then(m => m.BlogCommentsComponent) },
        ]
       },
      { path: 'locations', loadComponent: () => import('./content/locations/locations.component').then(m => m.LocationsComponent),
        children:[
          { path: 'countries', loadComponent: () => import('./content/locations/countries/countries.component').then(m => m.CountriesComponent) },
          { path: 'states', loadComponent: () => import('./content/locations/states/states.component').then(m => m.StatesComponent) },
          { path: 'cities', loadComponent: () => import('./content/locations/cities/cities.component').then(m => m.CitiesComponent) },
        ]
       },
      { path: 'faq', loadComponent: () => import('./content/faq/faq.component').then(m => m.FaqComponent) },
      { path: 'testimonials', loadComponent: () => import('./content/testimonials/testimonials.component').then(m => m.TestimonialsComponent) },
        //Settings//
        { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
          children:[
            { path: 'general-settings', loadComponent: () => import('./settings/general-settings/general-settings.component').then(m => m.GeneralSettingsComponent),
              children:[
                { path: 'connected-apps', loadComponent: () => import('./settings/general-settings/connected-apps/connected-apps.component').then(m => m.ConnectedAppsComponent) },
                { path: 'notification-settings', loadComponent: () => import('./settings/general-settings/notification-settings/notification-settings.component').then(m => m.NotificationSettingsComponent) },
                { path: 'security-settings', loadComponent: () => import('./settings/general-settings/security-settings/security-settings.component').then(m => m.SecuritySettingsComponent) },
                { path: 'profile-settings', loadComponent: () => import('./settings/general-settings/profile-settings/profile-settings.component').then(m => m.ProfileSettingsComponent) },
              ]
             },
            { path: 'website-settings', loadComponent: () => import('./settings/website-settings/website-settings.component').then(m => m.WebsiteSettingsComponent),
              children:[
                { path: 'ai-settings', loadComponent: () => import('./settings/website-settings/ai-settings/ai-settings.component').then(m => m.AiSettingsComponent) },
                { path: 'authentication-settings', loadComponent: () => import('./settings/website-settings/authentication-settings/authentication-settings.component').then(m => m.AuthenticationSettingsComponent) },
                { path: 'add-language', loadComponent: () => import('./settings/website-settings/add-language/add-language.component').then(m => m.AddLanguageComponent) },
                { path: 'language', loadComponent: () => import('./settings/website-settings/language/language.component').then(m => m.LanguageComponent) },
                { path: 'language-web', loadComponent: () => import('./settings/website-settings/language-web/language-web.component').then(m => m.LanguageWebComponent) },
                { path: 'appearance', loadComponent: () => import('./settings/website-settings/appearance/appearance.component').then(m => m.AppearanceComponent) },
                { path: 'preferences', loadComponent: () => import('./settings/website-settings/preferences/preferences.component').then(m => m.PreferencesComponent) },
                { path: 'prefixes', loadComponent: () => import('./settings/website-settings/prefixes/prefixes.component').then(m => m.PrefixesComponent) },
                { path: 'localization-settings', loadComponent: () => import('./settings/website-settings/localization-settings/localization-settings.component').then(m => m.LocalizationSettingsComponent) },
                { path: 'seo-settings', loadComponent: () => import('./settings/website-settings/seo-settings/seo-settings.component').then(m => m.SeoSettingsComponent) },
                { path: 'bussiness-settings', loadComponent: () => import('./settings/website-settings/bussiness-settings/bussiness-settings.component').then(m => m.BussinessSettingsComponent) },

              ]
             },
            { path: 'app-settings', loadComponent: () => import('./settings/app-settings/app-settings.component').then(m => m.AppSettingsComponent),
              children:[
                { path: 'custom-fields', loadComponent: () => import('./settings/app-settings/custom-fields/custom-fields.component').then(m => m.CustomFieldsComponent) },
                { path: 'leave-type', loadComponent: () => import('./settings/app-settings/leave-type/leave-type.component').then(m => m.LeaveTypeComponent) },
                { path: 'invoice-settings', loadComponent: () => import('./settings/app-settings/invoice-settings/invoice-settings.component').then(m => m.InvoiceSettingsComponent) },
                { path: 'approval-settings', loadComponent: () => import('./settings/app-settings/approval-settings/approval-settings.component').then(m => m.ApprovalSettingsComponent) },
                { path: 'salary-settings', loadComponent: () => import('./settings/app-settings/salary-settings/salary-settings.component').then(m => m.SalarySettingsComponent) },
              ]
             },
            { path: 'system-settings', loadComponent: () => import('./settings/system-settings/system-settings.component').then(m => m.SystemSettingsComponent),
              children:[
                { path: 'maintenance-mode', loadComponent: () => import('./settings/system-settings/maintenance-mode/maintenance-mode.component').then(m => m.MaintenanceModeComponent) },
                { path: 'gdpr', loadComponent: () => import('./settings/system-settings/gdpr/gdpr.component').then(m => m.GdprComponent) },
                { path: 'otp-settings', loadComponent: () => import('./settings/system-settings/otp-settings/otp-settings.component').then(m => m.OtpSettingsComponent) },
                { path: 'sms-template', loadComponent: () => import('./settings/system-settings/sms-template/sms-template.component').then(m => m.SmsTemplateComponent) },
                { path: 'sms-settings', loadComponent: () => import('./settings/system-settings/sms-settings/sms-settings.component').then(m => m.SmsSettingsComponent) },
                { path: 'email-template', loadComponent: () => import('./settings/system-settings/email-template/email-template.component').then(m => m.EmailTemplateComponent) },
                { path: 'email-settings', loadComponent: () => import('./settings/system-settings/email-settings/email-settings.component').then(m => m.EmailSettingsComponent) },
              ]
             },
            { path: 'financial-settings', loadComponent: () => import('./settings/financial-settings/financial-settings.component').then(m => m.FinancialSettingsComponent),
              children:[
                { path: 'currencies', loadComponent: () => import('./settings/financial-settings/currencies/currencies.component').then(m => m.CurrenciesComponent) },
                { path: 'tax-rates', loadComponent: () => import('./settings/financial-settings/tax-rates/tax-rates.component').then(m => m.TaxRatesComponent) },
                { path: 'payment-gateways', loadComponent: () => import('./settings/financial-settings/payment-gateways/payment-gateways.component').then(m => m.PaymentGatewaysComponent) },

              ]
             },
            { path: 'other-settings', loadComponent: () => import('./settings/other-settings/other-settings.component').then(m => m.OtherSettingsComponent),
              children:[
                { path: 'clear-cache', loadComponent: () => import('./settings/other-settings/clear-cache/clear-cache.component').then(m => m.ClearCacheComponent) },
                { path: 'backup', loadComponent: () => import('./settings/other-settings/backup/backup.component').then(m => m.BackupComponent) },
                { path: 'ban-ip-address', loadComponent: () => import('./settings/other-settings/ban-ip-address/ban-ip-address.component').then(m => m.BanIpAddressComponent) },
                { path: 'storage-settings', loadComponent: () => import('./settings/other-settings/storage-settings/storage-settings.component').then(m => m.StorageSettingsComponent) },
                { path: 'cronjob', loadComponent: () => import('./settings/other-settings/cronjob/cronjob.component').then(m => m.CronjobComponent) },
                { path: 'cronjob-schedule', loadComponent: () => import('./settings/other-settings/cronjob-schedule/cronjob-schedule.component').then(m => m.CronjobScheduleComponent) },
                { path: 'custom-js', loadComponent: () => import('./settings/other-settings/custom-js/custom-js.component').then(m => m.CustomJsComponent) },
                { path: 'custom-css', loadComponent: () => import('./settings/other-settings/custom-css/custom-css.component').then(m => m.CustomCssComponent) },

              ]
             },
          ]
        },
        
        //UI Interface //
        { path: 'table', loadComponent: () => import('./ui-interface/table/table.component').then(m => m.TableComponent),
          children: [
            { path: 'tables-basic', loadComponent: () => import('./ui-interface/table/tables-basic/tables-basic.component').then(m => m.TablesBasicComponent) },
            { path: 'data-tables', loadComponent: () => import('./ui-interface/table/data-tables/data-tables.component').then(m => m.DataTablesComponent) }
          ]
         },
        { path: 'maps', loadComponent: () => import('./ui-interface/maps/maps.component').then(m => m.MapsComponent),
          children:[
            { path: 'leaflets', loadComponent: () => import('./ui-interface/maps/leaflet/leaflet.component').then(m => m.LeafletComponent) }
          ]
         },
        { path: 'forms', loadComponent: () => import('./ui-interface/forms/forms.component').then(m => m.FormsComponent),
          children: [
            { path: 'form-elements/form-basic-inputs', loadComponent: () => import('./ui-interface/forms/form-elements/form-basic-inputs/form-basic-inputs.component').then(m => m.FormBasicInputsComponent) },
            { path: 'form-elements/form-checkbox-radios', loadComponent: () => import('./ui-interface/forms/form-elements/form-checkbox-radios/form-checkbox-radios.component').then(m => m.FormCheckboxRadiosComponent) },
            { path: 'form-elements/form-grid-gutters', loadComponent: () => import('./ui-interface/forms/form-elements/form-grid-gutters/form-grid-gutters.component').then(m => m.FormGridGuttersComponent) },
            { path: 'form-elements/form-elements', loadComponent: () => import('./ui-interface/forms/form-elements/form-elements/form-elements.component').then(m => m.FormElementsComponent) },
            { path: 'form-elements/form-fileupload', loadComponent: () => import('./ui-interface/forms/form-elements/form-fileupload/form-fileupload.component').then(m => m.FormFileuploadComponent) },
            { path: 'form-elements/form-input-groups', loadComponent: () => import('./ui-interface/forms/form-elements/form-input-groups/form-input-groups.component').then(m => m.FormInputGroupsComponent) },
            { path: 'form-elements/form-select', loadComponent: () => import('./ui-interface/forms/form-elements/form-select/form-select.component').then(m => m.FormSelectComponent) },
            { path: 'form-elements/form-mask', loadComponent: () => import('./ui-interface/forms/form-elements/form-mask/form-mask.component').then(m => m.FormMaskComponent) },
            { path: 'layouts/form-floating-labels', loadComponent: () => import('./ui-interface/forms/layouts/form-floating-labels/form-floating-labels.component').then(m => m.FormFloatingLabelsComponent) },
            { path: 'layouts/form-horizontal', loadComponent: () => import('./ui-interface/forms/layouts/form-horizontal/form-horizontal.component').then(m => m.FormHorizontalComponent) },
            { path: 'layouts/form-vertical', loadComponent: () => import('./ui-interface/forms/layouts/form-vertical/form-vertical.component').then(m => m.FormVerticalComponent) },
            { path: 'form-validation', loadComponent: () => import('./ui-interface/forms/form-validation/form-validation.component').then(m => m.FormValidationComponent) },
            { path: 'form-pickers', loadComponent: () => import('./ui-interface/forms/form-pickers/form-pickers.component').then(m => m.FormPickersComponent) },
          ]
         },
        { path: 'icon', loadComponent: () => import('./ui-interface/icons/icons.component').then(m => m.IconsComponent),
          children: [
                { path: 'icon-fontawesome', loadComponent: () => import('./ui-interface/icons/icon-fontawesome/icon-fontawesome.component').then(m => m.IconFontawesomeComponent) },
                { path: 'icon-feather', loadComponent: () => import('./ui-interface/icons/icon-feather/icon-feather.component').then(m => m.IconFeatherComponent) },
                { path: 'icon-ionic', loadComponent: () => import('./ui-interface/icons/icon-ionic/icon-ionic.component').then(m => m.IconIonicComponent) },
                { path: 'icon-material', loadComponent: () => import('./ui-interface/icons/icon-material/icon-material.component').then(m => m.IconMaterialComponent) },
                { path: 'icon-pe7', loadComponent: () => import('./ui-interface/icons/icon-pe7/icon-pe7.component').then(m => m.IconPe7Component) },
                { path: 'icon-simpleline', loadComponent: () => import('./ui-interface/icons/icon-simpleline/icon-simpleline.component').then(m => m.IconSimplelineComponent) },
                { path: 'icon-themify', loadComponent: () => import('./ui-interface/icons/icon-themify/icon-themify.component').then(m => m.IconThemifyComponent) },
                { path: 'icon-weather', loadComponent: () => import('./ui-interface/icons/icon-weather/icon-weather.component').then(m => m.IconWeatherComponent) },
                { path: 'icon-typicon', loadComponent: () => import('./ui-interface/icons/icon-typicon/icon-typicon.component').then(m => m.IconTypiconComponent) },
                { path: 'icon-flag', loadComponent: () => import('./ui-interface/icons/icon-flag/icon-flag.component').then(m => m.IconFlagComponent) },
                { path: 'icon-bootstrap', loadComponent: () => import('./ui-interface/icons/icon-bootstrap/icon-bootstrap.component').then(m => m.IconBootstrapComponent) },
                { path: 'icon-remix', loadComponent: () => import('./ui-interface/icons/icon-remix/icon-remix.component').then(m => m.IconRemixComponent) },
                { path: 'icon-tabler', loadComponent: () => import('./ui-interface/icons/icon-tabler/icon-tabler.component').then(m => m.IconTablerComponent) }
              ]

         },
        { path: 'charts', loadComponent: () => import('./ui-interface/charts/charts.component').then(m => m.ChartsComponent),
          children:[
              { path: 'prime-ng', loadComponent: () => import('./ui-interface/charts/prime-ng/prime-ng.component').then(m => m.PrimeNgComponent) },
              { path: 'apex-charts', loadComponent: () => import('./ui-interface/charts/chart-apex/chart-apex.component').then(m => m.ChartApexComponent) }
          ]
         },
        { path: 'base-ui', loadComponent: () => import('./ui-interface/base-ui/base-ui.component').then(m => m.BaseUiComponent),
          children: [
              { path: 'ui-spinner', loadComponent: () => import('./ui-interface/base-ui/ui-spinner/ui-spinner.component').then(m => m.UiSpinnerComponent) },
              { path: 'ui-rangeslider', loadComponent: () => import('./ui-interface/base-ui/ui-rangeslider/ui-rangeslider.component').then(m => m.UiRangesliderComponent) },
              { path: 'ui-progress', loadComponent: () => import('./ui-interface/base-ui/ui-progress/ui-progress.component').then(m => m.UiProgressComponent) },
              { path: 'ui-video', loadComponent: () => import('./ui-interface/base-ui/ui-video/ui-video.component').then(m => m.UiVideoComponent) },
              { path: 'ui-typography', loadComponent: () => import('./ui-interface/base-ui/ui-typography/ui-typography.component').then(m => m.UiTypographyComponent) },
              { path: 'ui-carousel', loadComponent: () => import('./ui-interface/base-ui/ui-carousel/ui-carousel.component').then(m => m.UiCarouselComponent) },
              { path: 'ui-cards', loadComponent: () => import('./ui-interface/base-ui/ui-cards/ui-cards.component').then(m => m.UiCardsComponent) },
              { path: 'ui-buttons-group', loadComponent: () => import('./ui-interface/base-ui/ui-buttons-group/ui-buttons-group.component').then(m => m.UiButtonsGroupComponent) },
              { path: 'ui-buttons', loadComponent: () => import('./ui-interface/base-ui/ui-buttons/ui-buttons.component').then(m => m.UiButtonsComponent) },
              { path: 'ui-breadcrumb', loadComponent: () => import('./ui-interface/base-ui/ui-breadcrumb/ui-breadcrumb.component').then(m => m.UiBreadcrumbComponent) },
              { path: 'ui-borders', loadComponent: () => import('./ui-interface/base-ui/ui-borders/ui-borders.component').then(m => m.UiBordersComponent) },
              { path: 'ui-badges', loadComponent: () => import('./ui-interface/base-ui/ui-badges/ui-badges.component').then(m => m.UiBadgesComponent) },
              { path: 'ui-accordion', loadComponent: () => import('./ui-interface/base-ui/ui-accordion/ui-accordion.component').then(m => m.UiAccordionComponent) },
              { path: 'ui-alerts', loadComponent: () => import('./ui-interface/base-ui/ui-alerts/ui-alerts.component').then(m => m.UiAlertsComponent) },
              { path: 'ui-avatar', loadComponent: () => import('./ui-interface/base-ui/ui-avatar/ui-avatar.component').then(m => m.UiAvatarComponent) },
              { path: 'ui-popovers', loadComponent: () => import('./ui-interface/base-ui/ui-popovers/ui-popovers.component').then(m => m.UiPopoversComponent) },
              { path: 'ui-placeholders', loadComponent: () => import('./ui-interface/base-ui/ui-placeholders/ui-placeholders.component').then(m => m.UiPlaceholdersComponent) },
              { path: 'ui-pagination', loadComponent: () => import('./ui-interface/base-ui/ui-pagination/ui-pagination.component').then(m => m.UiPaginationComponent) },
              { path: 'ui-offcanvas', loadComponent: () => import('./ui-interface/base-ui/ui-offcanvas/ui-offcanvas.component').then(m => m.UiOffcanvasComponent) },
              { path: 'ui-nav-tabs', loadComponent: () => import('./ui-interface/base-ui/ui-nav-tabs/ui-nav-tabs.component').then(m => m.UiNavTabsComponent) },
              { path: 'ui-modals', loadComponent: () => import('./ui-interface/base-ui/ui-modals/ui-modals.component').then(m => m.UiModalsComponent) },
              { path: 'ui-media', loadComponent: () => import('./ui-interface/base-ui/ui-media/ui-media.component').then(m => m.UiMediaComponent) },
              { path: 'ui-lightbox', loadComponent: () => import('./ui-interface/base-ui/ui-lightbox/ui-lightbox.component').then(m => m.UiLightboxComponent) },
              { path: 'ui-images', loadComponent: () => import('./ui-interface/base-ui/ui-images/ui-images.component').then(m => m.UiImagesComponent) },
              { path: 'ui-grid', loadComponent: () => import('./ui-interface/base-ui/ui-grid/ui-grid.component').then(m => m.UiGridComponent) },
              { path: 'ui-tooltips', loadComponent: () => import('./ui-interface/base-ui/ui-tooltips/ui-tooltips.component').then(m => m.UiTooltipsComponent) },
              { path: 'ui-toasts', loadComponent: () => import('./ui-interface/base-ui/ui-toasts/ui-toasts.component').then(m => m.UiToastsComponent) },
              { path: 'ui-dropdowns', loadComponent: () => import('./ui-interface/base-ui/ui-dropdowns/ui-dropdowns.component').then(m => m.UiDropdownsComponent) },
              { path: 'ui-colors', loadComponent: () => import('./ui-interface/base-ui/ui-colors/ui-colors.component').then(m => m.UiColorsComponent) },
              { path: 'ui-sortable', loadComponent: () => import('./ui-interface/base-ui/ui-sortable/ui-sortable.component').then(m => m.UiSortableComponent) }
            ]

         },
        { path: 'advanced-ui', loadComponent: () => import('./ui-interface/advanced-ui/advanced-ui.component').then(m => m.AdvancedUiComponent),
          children: [
              { path: 'ui-timeline', loadComponent: () => import('./ui-interface/advanced-ui/ui-timeline/ui-timeline.component').then(m => m.UiTimelineComponent) },
              { path: 'ui-text-editor', loadComponent: () => import('./ui-interface/advanced-ui/ui-text-editor/ui-text-editor.component').then(m => m.UiTextEditorComponent) },
              { path: 'ui-scrollbar', loadComponent: () => import('./ui-interface/advanced-ui/ui-scrollbar/ui-scrollbar.component').then(m => m.UiScrollbarComponent) },
              { path: 'ui-ribbon', loadComponent: () => import('./ui-interface/advanced-ui/ui-ribbon/ui-ribbon.component').then(m => m.UiRibbonComponent) },
              { path: 'ui-rating', loadComponent: () => import('./ui-interface/advanced-ui/ui-rating/ui-rating.component').then(m => m.UiRatingComponent) },
              { path: 'ui-drag-drop', loadComponent: () => import('./ui-interface/advanced-ui/ui-drag-drop/ui-drag-drop.component').then(m => m.UiDragDropComponent) },
              { path: 'ui-counter', loadComponent: () => import('./ui-interface/advanced-ui/ui-counter/ui-counter.component').then(m => m.UiCounterComponent) },
              { path: 'ui-clipboard', loadComponent: () => import('./ui-interface/advanced-ui/ui-clipboard/ui-clipboard.component').then(m => m.UiClipboardComponent) },
              { path: 'ui-stickynote', loadComponent: () => import('./ui-interface/advanced-ui/ui-stickynote/ui-stickynote.component').then(m => m.UiStickynoteComponent) }
            ]
         },
           //Layout//
           { path: 'layout-horizontal', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-detached', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-modern', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-two-column', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-hovered', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-boxed', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-horizontal-single', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-horizontal-overlay', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-horizontal-box', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-horizontal-sidemenu', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-vertical-transparent', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-without-header', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-default', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-rtl', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
{ path: 'layout-dark', loadComponent: () => import('./dashboard/modal-dashboard/modal-dashboard.component').then(m => m.ModalDashboardComponent) },
 
       { path: '' , loadComponent: () => import('./crm/crm.component').then(m => m.CrmComponent),
        children: [ 
          {path: 'contact/contacts-list', loadComponent: () => import('./crm/contacts-list/contacts-list.component').then(m => m.ContactsListComponent),},
          {path: 'contact/contacts-grid', loadComponent: () => import('./crm/contacts-grid/contacts-grid.component').then(m => m.ContactsGridComponent),},
          {path: 'contact/contacts-details', loadComponent: () => import('./crm/contacts-details/contacts-details.component').then(m => m.ContactsDetailsComponent),},
          {path: 'activity', loadComponent: () => import('./crm/activity/activity.component').then(m => m.ActivityComponent),},
          {path: 'analytics', loadComponent: () => import('./crm/analytics/analytics.component').then(m => m.AnalyticsComponent),},
          {path: 'pipeline', loadComponent: () => import('./crm/pipeline/pipeline.component').then(m => m.PipelineComponent),},
          {path: 'leads/leads-list', loadComponent: () => import('./crm/leads-list/leads-list.component').then(m => m.LeadsListComponent),},
          {path: 'leads/leads-grid', loadComponent: () => import('./crm/leads-grid/leads-grid.component').then(m => m.LeadsGridComponent),},
          {path: 'leads/leads-details', loadComponent: () => import('./crm/leads-details/leads-details.component').then(m => m.LeadsDetailsComponent),},
          {path: 'deals/deals-list', loadComponent: () => import('./crm/deals-list/deals-list.component').then(m => m.DealsListComponent),},
          {path: 'deals/deals-grid', loadComponent: () => import('./crm/deals-grid/deals-grid.component').then(m => m.DealsGridComponent),},
          {path: 'deals/deals-details', loadComponent: () => import('./crm/deals-details/deals-details.component').then(m => m.DealsDetailsComponent),},
          {path: 'company/companies-grid', loadComponent: () => import('./crm/companies-grid/companies-grid.component').then(m => m.CompaniesGridComponent),},
          {path: 'company/companies-list', loadComponent: () => import('./crm/companies/companies.component').then(m => m.CompaniesComponent),},
          {path: 'company/company-details', loadComponent: () => import('./crm/company-details/company-details.component').then(m => m.CompanyDetailsComponent),},
        ]
      },
      {
        path: 'employees' , loadComponent: () => import('./hrm/employees/employees.component').then(m => m.EmployeesComponent),
        children: [
          {path: 'employee-list', loadComponent: () => import('./hrm/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent),},
          {path: 'employee-grid', loadComponent: () => import('./hrm/employees/employee-grid/employee-grid.component').then(m => m.EmployeeGridComponent),},
          {path: 'employee-details', loadComponent: () => import('./hrm/employees/employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent),},
          {path: 'departments', loadComponent: () => import('./hrm/employees/departments/departments.component').then(m => m.DepartmentsComponent),},
          {path: 'designations', loadComponent: () => import('./hrm/employees/designations/designations.component').then(m => m.DesignationsComponent),},
          {path: 'policy', loadComponent: () => import('./hrm/employees/policy/policy.component').then(m => m.PolicyComponent),},
        ]
      },
      {
        path: 'tickets' , loadComponent: () => import('./hrm/tickets/tickets.component').then(m => m.TicketsComponent),
        children: [
          {path: 'ticket-grid', loadComponent: () => import('./hrm/tickets/ticket-grid/ticket-grid.component').then(m => m.TicketGridComponent),},
          {path: 'ticket-list', loadComponent: () => import('./hrm/tickets/ticket/ticket.component').then(m => m.TicketComponent),},
          {path: 'ticket-details', loadComponent: () => import('./hrm/tickets/ticket-details/ticket-details.component').then(m => m.TicketDetailsComponent),},
          {path: 'ticket-automation', loadComponent: () => import('./hrm/tickets/ticket-automation/ticket-automation.component').then(m => m.TicketAutomationComponent),},
          {path: 'ticket-reports', loadComponent: () => import('./hrm/tickets/ticket-reports/ticket-reports.component').then(m => m.TicketReportsComponent),},
        ]
      },
      {
        path: 'holidays' , loadComponent: () => import('./hrm/holidays/holidays.component').then(m => m.HolidaysComponent),
      },
      {
        path: 'attendance' , loadComponent: () => import('./hrm/attendance/attendance.component').then(m => m.AttendanceComponent),
        children: [
          {path: 'attendance-admin', loadComponent: () => import('./hrm/attendance/attendance-admin/attendance-admin.component').then(m => m.AttendanceAdminComponent),},
          {path: 'attendance-employee', loadComponent: () => import('./hrm/attendance/attendance-employee/attendance-employee.component').then(m => m.AttendanceEmployeeComponent),},
          {path: 'overtime', loadComponent: () => import('./hrm/attendance/overtime/overtime.component').then(m => m.OvertimeComponent),},
          {path: 'shift-schedule', loadComponent: () => import('./hrm/attendance/shift-schedule/shift-schedule.component').then(m => m.ShiftScheduleComponent),},
          {path: 'timesheet', loadComponent: () => import('./hrm/attendance/timesheet/timesheet.component').then(m => m.TimesheetComponent),},
          {path: 'shift-swap-requests', loadComponent: () => import('./hrm/attendance/shift-swap-requests/shift-swap-requests.component').then(m => m.ShiftSwapRequestsComponent),},
          {path: 'holiday-calendar', loadComponent: () => import('./hrm/attendance/holiday-calendar/holiday-calendar.component').then(m => m.HolidayCalendarComponent),},
          {path: 'work-from-home', loadComponent: () => import('./hrm/attendance/work-from-home/work-from-home.component').then(m => m.WorkFromHomeComponent),},
          {path: 'leaves', loadComponent: () => import('./hrm/attendance/leaves/leaves.component').then(m => m.LeavesComponent),
            children: [
              {path: 'leave-admin', loadComponent: () => import('./hrm/attendance/leaves/leave-admin/leave-admin.component').then(m => m.LeaveAdminComponent),},
              {path: 'leave-employee', loadComponent: () => import('./hrm/attendance/leaves/leave-employee/leave-employee.component').then(m => m.LeaveEmployeeComponent),},
              {path: 'leave-settings', loadComponent: () => import('./hrm/attendance/leaves/leave-settings/leave-settings.component').then(m => m.LeaveSettingsComponent),},
            ]
          },
        ]
      },
      {
        path: 'performance' , loadComponent: () => import('./hrm/performance/performance.component').then(m => m.PerformanceComponent),
        children: [
          {path: 'performance-appraisal', loadComponent: () => import('./hrm/performance/performance-appraisal/performance-appraisal.component').then(m => m.PerformanceAppraisalComponent),},
          {path: 'performance-indicator', loadComponent: () => import('./hrm/performance/performance-indicator/performance-indicator.component').then(m => m.PerformanceIndicatorComponent),},
          {path: 'performance-review', loadComponent: () => import('./hrm/performance/performance-review/performance-review.component').then(m => m.PerformanceReviewComponent),},
          {path: 'goal-tracking', loadComponent: () => import('./hrm/performance/goal-tracking/goal-tracking.component').then(m => m.GoalTrackingComponent),},
          {path: 'goal-type', loadComponent: () => import('./hrm/performance/goal-type/goal-type.component').then(m => m.GoalTypeComponent),},
        ]
      },
      {
        path: 'trainings' , loadComponent: () => import('./hrm/trainings/trainings.component').then(m => m.TrainingsComponent),
        children: [
          {path: 'training-list', loadComponent: () => import('./hrm/trainings/training-list/training-list.component').then(m => m.TrainingListComponent),},
          {path: 'trainers', loadComponent: () => import('./hrm/trainings/trainers/trainers.component').then(m => m.TrainersComponent),},
          {path: 'training-type', loadComponent: () => import('./hrm/trainings/training-type/training-type.component').then(m => m.TrainingTypeComponent),},
          {path: 'certification-tracking', loadComponent: () => import('./hrm/trainings/certification-tracking/certification-tracking.component').then(m => m.CertificationTrackingComponent),},
          {path: 'learning-analytics', loadComponent: () => import('./hrm/trainings/learning-analytics/learning-analytics.component').then(m => m.LearningAnalyticsComponent),},
        ]
      },
      { path: 'promotion' , loadComponent: () => import('./hrm/promotion/promotion.component').then(m => m.PromotionComponent),},
      { path: 'resignation' , loadComponent: () => import('./hrm/resignation/resignation.component').then(m => m.ResignationComponent),},
      { path: 'termination' , loadComponent: () => import('./hrm/termination/termination.component').then(m => m.TerminationComponent),},
      { path: 'probation-management' , loadComponent: () => import('./hrm/probation-management/probation-management.component').then(m => m.ProbationManagementComponent),},
      { path: 'notice-period-tracker' , loadComponent: () => import('./hrm/notice-period-tracker/notice-period-tracker.component').then(m => m.NoticePeriodTrackerComponent),},
      { path: 'candidates' , loadComponent: () => import('./recruitment/candidates/candidates.component').then(m => m.CandidatesComponent),
        children: [
          {path: 'candidates-list', loadComponent: () => import('./recruitment/candidates/candidates-list/candidates-list.component').then(m => m.CandidatesListComponent),},
          {path: 'candidates-grid', loadComponent: () => import('./recruitment/candidates/candidates-grid/candidates-grid.component').then(m => m.CandidatesGridComponent),},
          {path: 'candidates-kanban', loadComponent: () => import('./recruitment/candidates/candidates-kanban/candidates-kanban.component').then(m => m.CandidatesKanbanComponent),},
        ]
      },
      { path: 'jobs' , loadComponent: () => import('./recruitment/jobs/jobs.component').then(m => m.JobsComponent),
        children: [
          {path: 'jobs-list', loadComponent: () => import('./recruitment/jobs/jobs-list/jobs-list.component').then(m => m.JobsListComponent),},
          {path: 'jobs-grid', loadComponent: () => import('./recruitment/jobs/jobs-grid/jobs-grid.component').then(m => m.JobsGridComponent),},
        ]
      },
      { path: 'candidates' , loadComponent: () => import('./recruitment/candidates/candidates.component').then(m => m.CandidatesComponent),
        children: [
          {path: 'candidates-list', loadComponent: () => import('./recruitment/candidates/candidates-list/candidates-list.component').then(m => m.CandidatesListComponent),},
          {path: 'candidates-grid', loadComponent: () => import('./recruitment/candidates/candidates-grid/candidates-grid.component').then(m => m.CandidatesGridComponent),},
          {path: 'candidates-kanban', loadComponent: () => import('./recruitment/candidates/candidates-kanban/candidates-kanban.component').then(m => m.CandidatesKanbanComponent),},
        ]
      },
      {path: 'resume-parsing',loadComponent: () => import('./recruitment/resume-parsing/resume-parsing.component').then(m => m.ResumeParsingComponent),},
      {path: 'campus-hiring',loadComponent: () => import('./recruitment/campus-hiring/campus-hiring.component').then(m => m.CampusHiringComponent),},
      {path: 'refferals',loadComponent: () => import('./recruitment/refferals/refferals.component').then(m => m.RefferalsComponent),},
      { path: 'accounting' , loadComponent: () => import('./finance/accounting/accounting.component').then(m => m.AccountingComponent),
        children: [
          {path: 'budgets', loadComponent: () => import('./finance/accounting/budgets/budgets.component').then(m => m.BudgetsComponent),},
          {path: 'categories', loadComponent: () => import('./finance/accounting/categories/categories.component').then(m => m.CategoriesComponent),},
          {path: 'budget-expenses', loadComponent: () => import('./finance/accounting/budget-expenses/budget-expenses.component').then(m => m.BudgetExpensesComponent),},
          {path: 'budget-revenues', loadComponent: () => import('./finance/accounting/budget-revenues/budget-revenues.component').then(m => m.BudgetRevenuesComponent),},
        ]
      },
      { path: 'sales' , loadComponent: () => import('./finance/sales/sales.component').then(m => m.SalesComponent),
        children: [
          {path: 'invoices', loadComponent: () => import('./finance/sales/invoices/invoices.component').then(m => m.InvoicesComponent),},
          {path: 'invoices-details', loadComponent: () => import('./finance/sales/invoices-details/invoices-details.component').then(m => m.InvoicesDetailsComponent),},
          {path: 'add-invoice', loadComponent: () => import('./finance/sales/add-invoice/add-invoice.component').then(m => m.AddInvoiceComponent),},
          {path: 'edit-invoice', loadComponent: () => import('./finance/sales/edit-invoice/edit-invoice.component').then(m => m.EditInvoiceComponent),},
          {path: 'estimates', loadComponent: () => import('./finance/sales/estimates/estimates.component').then(m => m.EstimatesComponent),},
          {path: 'expenses', loadComponent: () => import('./finance/sales/expenses/expenses.component').then(m => m.ExpensesComponent),},
          {path: 'payments', loadComponent: () => import('./finance/sales/payments/payments.component').then(m => m.PaymentsComponent),},
          {path: 'provident-fund', loadComponent: () => import('./finance/sales/provident-fund/provident-fund.component').then(m => m.ProvidentFundComponent),},
          {path: 'taxes', loadComponent: () => import('./finance/sales/taxes/taxes.component').then(m => m.TaxesComponent),},
        ]
      },
      { path: 'payroll' , loadComponent: () => import('./finance/payroll/payroll.component').then(m => m.PayrollComponent),
        children: [
          {path: 'payroll-items', loadComponent: () => import('./finance/payroll/payroll-items/payroll-items.component').then(m => m.PayrollItemsComponent),},
          {path: 'payroll-deduction', loadComponent: () => import('./finance/payroll/payroll-deduction/payroll-deduction.component').then(m => m.PayrollDeductionComponent),},
          {path: 'payroll-overtime', loadComponent: () => import('./finance/payroll/payroll-overtime/payroll-overtime.component').then(m => m.PayrollOvertimeComponent),},
          {path: 'employee-salary', loadComponent: () => import('./finance/payroll/employee-salary/employee-salary.component').then(m => m.EmployeeSalaryComponent),},
          {path: 'payslip', loadComponent: () => import('./finance/payroll/payslip/payslip.component').then(m => m.PayslipComponent),},
        ]
      },
      { path: 'assets' , loadComponent: () => import('./administration/assets/assets.component').then(m => m.AssetsComponent),
        children: [
          {path: 'asset-list', loadComponent: () => import('./administration/assets/asset-list/asset-list.component').then(m => m.AssetListComponent),},
          {path: 'asset-categories', loadComponent: () => import('./administration/assets/asset-categories/asset-categories.component').then(m => m.AssetCategoriesComponent),},
        ]
      },
      { path: 'reports' , loadComponent: () => import('./administration/reports/reports.component').then(m => m.ReportsComponent),
        children: [
          {path: 'task-report', loadComponent: () => import('./administration/reports/task-report/task-report.component').then(m => m.TaskReportComponent),},
          {path: 'user-report', loadComponent: () => import('./administration/reports/user-report/user-report.component').then(m => m.UserReportComponent),},
          {path: 'project-report', loadComponent: () => import('./administration/reports/project-report/project-report.component').then(m => m.ProjectReportComponent),},
          {path: 'attendance-report', loadComponent: () => import('./administration/reports/attendance-report/attendance-report.component').then(m => m.AttendanceReportComponent),},
          {path: 'daily-report', loadComponent: () => import('./administration/reports/daily-report/daily-report.component').then(m => m.DailyReportComponent),},
          {path: 'employee-report', loadComponent: () => import('./administration/reports/employee-report/employee-report.component').then(m => m.EmployeeReportComponent),},
          {path: 'expenses-report', loadComponent: () => import('./administration/reports/expenses-report/expenses-report.component').then(m => m.ExpensesReportComponent),},
          {path: 'invoice-report', loadComponent: () => import('./administration/reports/invoice-report/invoice-report.component').then(m => m.InvoiceReportComponent),},
          {path: 'leave-report', loadComponent: () => import('./administration/reports/leave-report/leave-report.component').then(m => m.LeaveReportComponent),},
          {path: 'payment-report', loadComponent: () => import('./administration/reports/payment-report/payment-report.component').then(m => m.PaymentReportComponent),},
          {path: 'payslip-report', loadComponent: () => import('./administration/reports/payslip-report/payslip-report.component').then(m => m.PayslipReportComponent),},
        ]
      },
      { path: 'support' , loadComponent: () => import('./administration/support/support.component').then(m => m.SupportComponent),
        children: [
          {path: 'knowledgebase', loadComponent: () => import('./administration/support/knowledgebase/knowledgebase.component').then(m => m.KnowledgebaseComponent),},
          {path: 'knowledgebase-details', loadComponent: () => import('./administration/support/knowledgebase-details/knowledgebase-details.component').then(m => m.KnowledgebaseDetailsComponent),},
          {path: 'knowledgebase-view', loadComponent: () => import('./administration/support/knowledgebase-view/knowledgebase-view.component').then(m => m.KnowledgebaseViewComponent),},
        ]
      },
      { path: 'user-management' , loadComponent: () => import('./administration/user-management/user-management.component').then(m => m.UserManagementComponent),
        children: [
          {path: 'users', loadComponent: () => import('./administration/user-management/users/users.component').then(m => m.UsersComponent),},
          {path: 'roles-permissions', loadComponent: () => import('./administration/user-management/roles-permissions/roles-permissions.component').then(m => m.RolesPermissionsComponent),},
          {path: 'permissions', loadComponent: () => import('./administration/user-management/permissions/permissions.component').then(m => m.PermissionsComponent),},
        ]
      },

      // ─── Audit CAR Portal ────────────────────────────────────────────────
      {
        path: 'audit-car',
        loadChildren: () =>
          import('./audit-car/audit-car.routes').then((m) => m.AUDIT_CAR_ROUTES),
      },

      // ─── Packaging Creative Approval Portal ──────────────────────────────
      {
        path: 'packaging',
        loadChildren: () =>
          import('./packaging/packaging.routes').then((m) => m.PACKAGING_ROUTES),
      },

    ]
  }
]