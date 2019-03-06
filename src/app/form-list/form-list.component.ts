import { Component, OnInit } from '@angular/core';
import { ConceptsService } from '../concepts.service';
import { parseFormConditions } from 'parse-form-conditions';

let formConditions: any;

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})

export class FormListComponent implements OnInit {
  formNames: Array<String>;
  searchKeyWord: String;

  constructor(private conceptService: ConceptsService) {
  }

  ngOnInit() {
    this.getAllObservationTemplates();
    this.getFormConditions();
  }

  private getAllObservationTemplates() {
    this.conceptService.getAllObservationTemplates().subscribe((response: { results: any }) => {
      if (response.results[0]) {
        this.formNames = response.results[0].setMembers.map((form) => form.display);
      }
    });
  }

  private getFormConditions() {
    formConditions = undefined;
    this.conceptService.getFormConditionsConfig().subscribe((bahmniConfigResponse: any) => {
      if (bahmniConfigResponse) {
        formConditions = parseFormConditions(bahmniConfigResponse);
      }
      this.updateFormConditionsWithImplementationFormConditions();
    }, () => {
      this.updateFormConditionsWithImplementationFormConditions();
    });
  }

  private updateFormConditionsWithImplementationFormConditions() {
    this.conceptService.getImplementationFormConditionsConfig().subscribe((implementationConfigResponse: any) => {
      let implementationFormConditions = {};
      if (implementationConfigResponse) {
        implementationFormConditions = parseFormConditions(implementationConfigResponse);
      }
      formConditions = Object.assign({}, formConditions, implementationFormConditions);
    }, () => {
    });
  }
}

export { formConditions };
