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
  protected concept;

  constructor() { }

  ngOnInit() {
    this.getConcept(this.conceptName);
  }

  getConcept(conceptName) {
    if (this.formConcepts) {
      this.concept =  this.formConcepts.find(function (formConcept) {
        return formConcept.fullySpecifiedName === conceptName;
      });
      this.setRenderedToFalse(this.concept);
    }
  }

  private setRenderedToFalse(concept: any) {
    if (concept) {
      concept.rendered = false;
      if (!concept.setMembers) {
        concept.rendered = false;
      } else {
        concept.setMembers.forEach(member => this.setRenderedToFalse(member));
      }
    }
  }

  isTabular(member) {
    return ConceptUtils.isTabular(member);
  }
}
