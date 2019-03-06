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

  private getFormConditions() {
    formConditions = undefined;
    this.conceptService.getFormConditionsConfig().subscribe((bahmniConfigResponse: any) => {
      let bahmniFormConditions = [];
      let implementationFormConditions = [];
      if (bahmniConfigResponse) {
        bahmniFormConditions = parseFormConditions(bahmniConfigResponse);
      }
      this.conceptService.getImplementationFormConditionsConfig().subscribe((implementationConfigResponse: any) => {
        if (implementationConfigResponse) {
          implementationFormConditions = parseFormConditions(implementationConfigResponse);
        }
        formConditions = Object.assign({}, bahmniFormConditions, implementationFormConditions);
      }, () => {
          formConditions = bahmniFormConditions;
      });
    });
  }

  private getAllObservationTemplates() {
    this.conceptService.getAllObservationTemplates().subscribe((response: { results: any }) => {
      if (response.results[0]) {
        this.formNames = response.results[0].setMembers.map((form) => form.display);
      }
    });
  }
}

export { formConditions };
