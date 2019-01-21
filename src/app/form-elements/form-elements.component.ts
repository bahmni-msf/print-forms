import { Component, Input, OnInit } from '@angular/core';
import { ConceptUtils } from '../utils/concept.utils';

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
  }

  getConcept(conceptName) {
    if (this.formConcepts) {
      this.concept =  this.formConcepts.find(function (formConcept) {
        return formConcept.fullySpecifiedName === conceptName;
      });
    }
  }

  isTabular(member) {
    return ConceptUtils.isTabular(member);
  }
}
