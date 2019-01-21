import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConceptsService } from '../concepts.service';
import { FormConfigBuilder } from '../utils/form.config.builder';
import { ConceptUtils } from '../utils/concept.utils';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  static formConditionsConcepts: Set<String>;
  name: String;
  form: any;
  isFormSelected: Boolean;

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

  isInFormConditions(member) {
    return FormComponent.formConditionsConcepts.has(member.fullySpecifiedName);
  }
}
