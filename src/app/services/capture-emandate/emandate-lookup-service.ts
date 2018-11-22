import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class EmandateLookUpService {
  // utilityCode = [
  //   { value: "Code1", viewValue: "Code1" },
  //   { value: "Code2", viewValue: "Code1" }
  // ];

  // productType = [
  //   { value: "Type1", viewValue: "Type1" },
  //   { value: "Type2", viewValue: "Type2" }
  // ];

  debitType = [
    { value: "F", viewValue: "Fixed" },
    { value: "V", viewValue: "Variable" }
  ];

  frequency = [
    { value: 'MNTH', viewValue: 'Monthly' },
   { value: 'QURT', viewValue: 'Quarterly' },
   { value: 'MIAN', viewValue: 'Half Yearly' },
   { value: 'YEAR', viewValue: 'Yearly' },
  //  { value: 'ADHO', viewValue: 'As and When Presented' },
  ];

  accountType = [
    { value: "SAVINGS", viewValue: "Savings" },
    { value: "CURRENT", viewValue: "Current" }
  ];
}
