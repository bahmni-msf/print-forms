import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConceptsService } from '../concepts.service';
import { FormConfigBuilder } from '../utils/form.config.builder';
import { ConceptUtils } from '../utils/concept.utils';
import { parseFormConditions } from 'parse-form-conditions';

let formConditions: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {
  static formConditionsConcepts: Set<String>;
  name: String;
  form: any;
  isFormSelected: Boolean;
  formConditionsLoaded: Boolean = false;

  constructor(private route: ActivatedRoute, private conceptService: ConceptsService) {
    this.isFormSelected = true;
    this.route.params.subscribe(params => {
      this.name = params.formName;
      this.initializeForm();
      this.scrollToTop();
    });
  }

  private initializeForm() {
    FormComponent.formConditionsConcepts = new Set<String>();
    this.conceptService.getAppConfig().subscribe((config: { config: any }) => {
      this.conceptService.getFormDetails(this.name).subscribe((formDetails: { results: any }) => {
        this.form = FormConfigBuilder.build(formDetails.results[0], config.config.conceptSetUI);
      });
    });
  }

  ngOnInit() {
    this.getFormConditions();
  }

  private getFormConditions() {
    formConditions = undefined;
    this.conceptService.getFormConditionsConfig().subscribe((bahmniConfigResponse: any) => {
      if (bahmniConfigResponse) {
        formConditions = this.parseFormConditions(bahmniConfigResponse, 'bahmni_config');
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
        implementationFormConditions = this.parseFormConditions(implementationConfigResponse, 'implementation_config');
      }
      formConditions = Object.assign({}, formConditions, implementationFormConditions);
      this.formConditionsLoaded = true;
    }, () => {
      this.formConditionsLoaded = true;
    });
  }

  private parseFormConditions(formConditionsResponse, configType) {
    try {
      return parseFormConditions(formConditionsResponse);
    } catch (e) {
        console.warn('Couldn\'t parse form conditions in ' + configType);
    }
  }

  isTabular(member) {
    return ConceptUtils.isTabular(member);
  }

  setIsFormSelected(value) {
    this.isFormSelected = value;
  }

  printForm() {
    window.print();
  }

  private scrollToTop() {
    const formElement = document.getElementsByClassName('form')[0];
    if (formElement) {
      formElement.scrollTop = 0;
    }
  }
}

export { formConditions };
