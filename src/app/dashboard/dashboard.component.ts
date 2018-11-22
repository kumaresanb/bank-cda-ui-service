import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DashboardService } from "../services/dashboard/dashboard-service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  _opened: boolean = false;
  _opened1: boolean = true;
  paymentDetails = {
    ACH_DR: {
      totalCount: 0,
      settledCount: 0,
      pendingCount: 0,
      returnedCount: 0,
      extendedCount: 0,
      totalAmount: 0,
      settledAmount: 0,
      pendingAmount: 0,
      returnedAmount: 0,
      extendedAmount: 0
    },
    ACH_CR: {
      totalCount: 0,
      settledCount: 0,
      pendingCount: 0,
      returnedCount: 0,
      extendedCount: 0,
      totalAmount: 0,
      settledAmount: 0,
      pendingAmount: 0,
      returnedAmount: 0,
      extendedAmount: 0
    },
    APB_CR: {
      totalCount: 0,
      settledCount: 0,
      pendingCount: 0,
      returnedCount: 0,
      extendedCount: 0,
      totalAmount: 0,
      settledAmount: 0,
      pendingAmount: 0,
      returnedAmount: 0,
      extendedAmount: 0
    },
    totalCount: 0,
    totalAmount: 0.0,
    extendedCount: 0,
    extendedAmount: 0,
    settledCount: 0,
    settledAmount: 0,
    pendingCount: 0,
    pendingAmount: 0,
    returnedCount: 0,
    returnedAmount: 0
  };

  allPayment: any;
  achDrDetails = this.paymentDetails.ACH_DR;
  achCrDetails = this.paymentDetails.ACH_CR;
  apbsDetails = this.paymentDetails.APB_CR;
  mandateDetails = {
    totalPresented: 0,
    totalEmandatePresented: 0,
    totalPapermandatePresented: 0,
    totalAccepted: 0,
    totalEmandateAccepted: 0,
    totalPapermandateAccepted: 0,
    totalRejected: 0,
    totalEmandateRejected: 0,
    totalPapermandateRejected: 0,
    totalPending: 0,
    totalEmandatePending: 0,
    totalPapermandatePending: 0,
    lastUpdateDateTime: new Date()
  };
  ageingMandateDetails = {
    ACH: {
      agedDay1: 0,
      agedDay2: 0,
      agedDay3: 0,
      agedDay4: 0,
      agedDay5: 0,
      agedDay6: 0,
      agedDay7: 0
    },
    ESIGN: {
      agedDay1: 0,
      agedDay2: 0,
      agedDay3: 0,
      agedDay4: 0,
      agedDay5: 0,
      agedDay6: 0,
      agedDay7: 0
    },
    totalAgedDay1: 0,
    totalAgedDay2: 0,
    totalAgedDay3: 0,
    totalAgedDay4: 0,
    totalAgedDay5: 0,
    totalAgedDay6: 0,
    totalAgedDay7: 0
  };
  achMandateAgeingDetails = this.ageingMandateDetails.ACH;
  esignMandateAgeingDetails = this.ageingMandateDetails.ESIGN;

  tabActMan() {
    this._opened = false;
    this._opened1 = !this._opened1;
  }

  tabActPay() {
    this._opened1 = false;
    this._opened = !this._opened;
  }

  constructor(
    private dashboardService: DashboardService,
    private date: DatePipe
  ) {}

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((response: any) => {
      if (
        response.data.paymentStatus !== null &&
        response.data.paymentStatus !== undefined
      ) {
        this.paymentDetails = response.data.paymentStatus;
      }
      if (
        this.paymentDetails.ACH_DR !== null &&
        this.paymentDetails.ACH_DR !== undefined
      ) {
        this.achDrDetails = this.paymentDetails.ACH_DR;
      }
      this.achDrDetails.totalCount =
        this.achDrDetails.settledCount +
        this.achDrDetails.pendingCount +
        this.achDrDetails.returnedCount +
        this.achDrDetails.extendedCount;
      this.achDrDetails.totalAmount =
        this.achDrDetails.settledAmount +
        this.achDrDetails.pendingAmount +
        this.achDrDetails.returnedAmount +
        this.achDrDetails.extendedAmount;

      if (
        this.paymentDetails.ACH_CR !== null &&
        this.paymentDetails.ACH_CR !== undefined
      ) {  
        this.achCrDetails = this.paymentDetails.ACH_CR;
      }
      this.achCrDetails.totalCount =
        this.achCrDetails.settledCount +
        this.achCrDetails.pendingCount +
        this.achCrDetails.extendedCount +
        this.achCrDetails.returnedCount;
      this.achCrDetails.totalAmount =
        this.achCrDetails.settledAmount +
        this.achCrDetails.pendingAmount +
        this.achCrDetails.extendedAmount +
        this.achCrDetails.returnedAmount;

      if (
        this.paymentDetails.APB_CR !== null && 
        this.paymentDetails.APB_CR !== undefined
      ) {
        this.apbsDetails = this.paymentDetails.APB_CR;
      }

      this.apbsDetails.totalCount =
        this.apbsDetails.settledCount +
        this.apbsDetails.pendingCount +
        this.apbsDetails.returnedCount;
      this.apbsDetails.totalAmount =
        this.apbsDetails.settledAmount +
        this.apbsDetails.pendingAmount +
        this.apbsDetails.returnedAmount;

      this.paymentDetails.totalCount =
        this.achDrDetails.totalCount +
        this.achCrDetails.totalCount +
        this.apbsDetails.totalCount;
      this.paymentDetails.totalAmount =
        this.achDrDetails.totalAmount +
        this.achCrDetails.totalAmount +
        this.apbsDetails.totalAmount;

      this.paymentDetails.extendedCount =
        this.achDrDetails.extendedCount +
        this.achCrDetails.extendedCount +
        this.apbsDetails.extendedCount;
      this.paymentDetails.extendedAmount =
        this.achDrDetails.extendedAmount +
        this.achCrDetails.extendedAmount +
        this.apbsDetails.extendedAmount;

      this.paymentDetails.settledCount =
        this.achDrDetails.settledCount +
        this.achCrDetails.settledCount +
        this.apbsDetails.settledCount;
      this.paymentDetails.settledAmount =
        this.achDrDetails.settledAmount +
        this.achCrDetails.settledAmount +
        this.apbsDetails.settledAmount;

      this.paymentDetails.pendingCount =
        this.achDrDetails.pendingCount +
        this.achCrDetails.pendingCount +
        this.apbsDetails.pendingCount;
      this.paymentDetails.pendingAmount =
        this.achDrDetails.pendingAmount +
        this.achCrDetails.pendingAmount +
        this.apbsDetails.pendingAmount;

      this.paymentDetails.returnedCount =
        this.achDrDetails.returnedCount +
        this.achCrDetails.returnedCount +
        this.apbsDetails.returnedCount;
      this.paymentDetails.returnedAmount =
        this.achDrDetails.returnedAmount +
        this.achCrDetails.returnedAmount +
        this.apbsDetails.returnedAmount;

      if (
        response.data.mandateStatus !== null &&
        response.data.mandateStatus !== undefined
      ) {
        this.mandateDetails = response.data.mandateStatus;

      }

      this.mandateDetails.totalPresented =
        this.mandateDetails.totalEmandatePresented +
        this.mandateDetails.totalPapermandatePresented;
      this.mandateDetails.totalAccepted =
        this.mandateDetails.totalEmandateAccepted +
        this.mandateDetails.totalPapermandateAccepted;
      this.mandateDetails.totalRejected =
        this.mandateDetails.totalEmandateRejected +
        this.mandateDetails.totalPapermandateRejected;
      this.mandateDetails.totalPending =
        this.mandateDetails.totalEmandatePending +
        this.mandateDetails.totalPapermandatePending;
      if (
        response.data.mandateAgeingStatus !== null &&
        response.data.mandateAgeingStatus !== undefined
      ) {
        this.ageingMandateDetails = response.data.mandateAgeingStatus;  
      }
      if (
        this.ageingMandateDetails.ACH !== null &&
        this.ageingMandateDetails.ACH !== undefined
      ) {
        this.achMandateAgeingDetails = this.ageingMandateDetails.ACH;
      }
      if (
        this.ageingMandateDetails.ESIGN !== null &&
        this.ageingMandateDetails.ESIGN !== undefined
      ) {
        this.esignMandateAgeingDetails = this.ageingMandateDetails.ESIGN;
      }
      this.ageingMandateDetails.totalAgedDay1 =
        this.achMandateAgeingDetails.agedDay1 +
        this.esignMandateAgeingDetails.agedDay1;
      this.ageingMandateDetails.totalAgedDay2 =
        this.achMandateAgeingDetails.agedDay2 +
        this.esignMandateAgeingDetails.agedDay2;
      this.ageingMandateDetails.totalAgedDay3 =
        this.achMandateAgeingDetails.agedDay3 +
        this.esignMandateAgeingDetails.agedDay3;
      this.ageingMandateDetails.totalAgedDay4 =
        this.achMandateAgeingDetails.agedDay4 +
        this.esignMandateAgeingDetails.agedDay4;
      this.ageingMandateDetails.totalAgedDay5 =
        this.achMandateAgeingDetails.agedDay5 +
        this.esignMandateAgeingDetails.agedDay5;
      this.ageingMandateDetails.totalAgedDay6 =
        this.achMandateAgeingDetails.agedDay6 +
        this.esignMandateAgeingDetails.agedDay6;
      this.ageingMandateDetails.totalAgedDay7 =
        this.achMandateAgeingDetails.agedDay7 +
        this.esignMandateAgeingDetails.agedDay7;
    });



  }

  

  refresh(){
this.ngOnInit();
  }
}
