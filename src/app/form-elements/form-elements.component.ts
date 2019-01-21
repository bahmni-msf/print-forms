import { Component, Input, OnInit } from '@angular/core';
import { ConceptUtils } from '../utils/concept.utils';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-form-elements',
  templateUrl: './form-elements.component.html',
  styleUrls: ['./form-elements.component.scss']
})
export class FormElementsComponent implements OnInit {

  @Input() conceptName: String;
  @Input() formConcepts: any;
  concept: any;

  constructor() { }

  ngOnInit() {
    this.getConcept(this.conceptName);
    if (this.concept) {
      this.addToFormConditionConcepts();
    }
  }

  getConcept(conceptName) {
    if (this.formConcepts) {
      this.concept = this.formConcepts.find(function (formConcept) {
        return formConcept.fullySpecifiedName === conceptName;
      });
    }
  }

  addToFormConditionConcepts() {
    FormComponent.formConditionsConcepts.add(this.conceptName);
  }

  isTabular(member) {
    return ConceptUtils.isTabular(member);
  }
}
