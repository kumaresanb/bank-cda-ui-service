import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./module/material.module";
import { RouterModule, Routes } from "@angular/router";
import "hammerjs";
import { ScrollbarModule } from "ngx-scrollbar";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DragScrollModule } from "ngx-drag-scroll";
import { NgxMatDrpModule } from "ngx-mat-daterange-picker";
import { SidebarModule } from "ng-sidebar";
import { CounterUpModule } from "angular4-counter-up";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MandateWorkbenchComponent } from "./mandate-workbench/mandate-workbench.component";
import { CreateMandateComponent } from "./create-mandate/create-mandate.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ViewMandateComponent } from "./view-mandate/view-mandate.component";
import { MandateEnquiryComponent } from "./mandate-enquiry/mandate-enquiry.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { DataService } from "./data-service";
import { PopupService } from "./popup.service";
import { MandateSubmitPopupComponent } from "./mandate-submit-popup/mandate-submit-popup.component";
import { WorkBenchService } from "./services/mandate/workbench/workbench-service";
import { SessionexpiredComponent } from "./sessionexpired/sessionexpired.component";
import { LoginComponent } from "./login/login.component";
import { AuthenticationService } from "./services/authentication/login/login.service";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { CancelMandateComponent } from "./cancel-mandate/cancel-mandate.component";
import { AmmendMandateComponent } from "./ammend-mandate/ammend-mandate.component";
import { MandateEnquiryService } from "./services/mandate/mandateenquiry-service/mandateenquire-service";
import { RoutingWithObject } from "./services/mandate/routingService/routingwithobject";
import { LookupService } from "./services/lookupservice/plf-lookup-service";
import { CancelMandateService } from "./services/mandate/cancelmandateservice/cancelmandateservice";
import { ViewService } from "./services/mandate/view/view-service";
import { HomePageComponent } from "./home-page/home-page.component";
import { ConfigService } from "./services/config/config-service";
import { AmendMandateService } from "./services/mandate/amendservice/amendmandateservice";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { MandateViewPopupComponent } from "./mandate-view-popup/mandate-view-popup.component";
import { RepairMandateComponent } from "./repair-mandate/repair-mandate.component";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material";
import { FileEnquiryComponent } from "./file-enquiry/file-enquiry.component";
import { UploadSuccessPopupComponent } from "./upload-success-popup/upload-success-popup.component";
import { MandateWorkbenchQueueViewComponent } from "./mandate-workbench-queue-view/mandate-workbench-queue-view.component";
import { MandateUploadedGridComponent } from "./mandate-uploaded-grid/mandate-uploaded-grid.component";
import { UploadService } from "./services/fileupload/uploadservice";
import { AuthGuardService } from "./shared/auth-guard.service";
import { CustomHttpIntercepter } from "./shared/custom.http.intercepter";
import { EnquiryComponent } from "./enquiry/enquiry.component";
import { PaymentEnquiryComponent } from "./payment-enquiry/payment-enquiry.component";
import { SortingService } from "./services/sortingservice/sorting-service";
import { PaymentUploadedGridComponent } from "./payment-uploaded-grid/payment-uploaded-grid.component";
import { PaymentEnquiryService } from "./services/payment/payment-enquiry-service";
import { MandateFileSearchService } from "./services/gridsearchservices/mandate-file-summary-service";
import { DatePipe } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ReportsComponent } from "./reports/reports.component";
import { MandateReportComponent } from "./mandate-report/mandate-report.component";
import { PaymentReportComponent } from "./payment-report/payment-report.component";
import { ReportService } from "./services/report/report-service";
import { GetValuesPipe } from "./get-values.pipe";
import { DashboardService } from "./services/dashboard/dashboard-service";
import { PaymentTransactionListComponent } from "./payment-transaction-list/payment-transaction-list.component";
import { ViewTransactionComponent } from "./view-transaction/view-transaction.component";
import { FileSummaryComponent } from "./file-summary/file-summary.component";
import { CaptureEmandateComponent } from "./capture-emandate/capture-emandate.component";
import { EmandateLookUpService } from "./services/capture-emandate/emandate-lookup-service";
import { RedirectService } from "./services/redirectservice";
import { SuccessComponentComponent } from './success-component/success-component.component';
import { PaymentFileSummaryService } from "./services/payment/paymentfilesummaryserivce";

import { SummaryReportService } from "./services/summary-report-service/SummaryReportService";

import { QueueNameService } from "./shared/queue-name-service";
import { RedirectComponent } from './redirect/redirect.component';
import { RedirectAuthGuardService } from "./shared/redirect-auth-guard.service";
import { CookieService } from "ngx-cookie-service";
import { BulkUploadDialogComponent } from './bulk-upload-dialog/bulk-upload-dialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

const appRoutes: Routes = [
  {
    path: "",   
    pathMatch: 'full',
    component: LandingPageComponent,
    canActivate: [RedirectAuthGuardService]
  },
  {
    path: "landingpage",
    component: LandingPageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "sessionExpired",
    component: SessionexpiredComponent
  },
  {
    path: "mandate",
    component: MandateWorkbenchComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "createmandate",
    component: CreateMandateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "viewmandate",
    component: ViewMandateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "cancelmandate",
    component: CancelMandateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "ammendmandate",
    component: AmmendMandateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "reapairmandate",
    component: RepairMandateComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "homepage",
    component: HomePageComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "redirect",
    component: RedirectComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "bulkupload",
    component: BulkUploadComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "mandatequeuegrid",
    component: MandateWorkbenchQueueViewComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "mandateuploadgrid",
    component: MandateUploadedGridComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "paymentuploadgrid",
    component: PaymentUploadedGridComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "enquiry",
    component: EnquiryComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "reports",
    component: ReportsComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "paymentTransaction",
    component: PaymentTransactionListComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "viewTransaction",
    component: ViewTransactionComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "filesummary",
    component: FileSummaryComponent,
    canActivate: [AuthGuardService]
  },{
    path: "captureEmandate",
    component: CaptureEmandateComponent,
    canActivate: [AuthGuardService]
  },{
    path: "success",
    component: SuccessComponentComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MandateWorkbenchComponent,
    CreateMandateComponent,
    ViewMandateComponent,
    MandateEnquiryComponent,
    MandateSubmitPopupComponent,
    MandateViewPopupComponent,
    SessionexpiredComponent,
    LoginComponent,
    LandingPageComponent,
    CancelMandateComponent,
    AmmendMandateComponent,
    HomePageComponent,
    BulkUploadComponent,
    MandateViewPopupComponent,
    RepairMandateComponent,
    FileEnquiryComponent,
    UploadSuccessPopupComponent,
    MandateWorkbenchQueueViewComponent,
    MandateUploadedGridComponent,
    PaymentUploadedGridComponent,
    EnquiryComponent,
    PaymentEnquiryComponent,
    DashboardComponent,
    ReportsComponent,
    MandateReportComponent,
    PaymentReportComponent,
    GetValuesPipe,
    PaymentTransactionListComponent,
    ViewTransactionComponent,
    FileSummaryComponent,
    CaptureEmandateComponent,
    SuccessComponentComponent,
    RedirectComponent,
    BulkUploadDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ScrollbarModule,
    AngularSvgIconModule,
    DragScrollModule,
    NgxMatDrpModule,
    SidebarModule.forRoot(),
    CounterUpModule.forRoot({
      delay: 100,
      time: 100
    })
  ],

  entryComponents: [
    MandateSubmitPopupComponent,
    MandateViewPopupComponent,
    UploadSuccessPopupComponent,
    BulkUploadDialogComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
    DataService,
    PopupService,
    WorkBenchService,
    MandateEnquiryService,
    RoutingWithObject,
    LookupService,
    CancelMandateService,
    ViewService,
    ConfigService,
    AmendMandateService,
    RedirectAuthGuardService, 
    UploadService,
    AuthGuardService,
    SortingService,
    PaymentEnquiryService,
    MandateFileSearchService,
    ReportService,
    DashboardService,
    EmandateLookUpService,
    AuthenticationService,
    RedirectService,
    CookieService,
    PaymentFileSummaryService,
    SummaryReportService,
    QueueNameService,
    BulkUploadComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpIntercepter,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
