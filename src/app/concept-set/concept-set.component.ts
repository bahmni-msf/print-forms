import { Component, Input, OnInit } from '@angular/core';
import { ConceptUtils } from '../utils/concept.utils';

@Component({
  selector: 'app-concept-set',
  templateUrl: './concept-set.component.html',
  styleUrls: ['./concept-set.component.scss']
})
export class ConceptSetComponent implements OnInit {

  @Input() member: any;
  @Input() formConcepts: any;
  abnormal: boolean;

  constructor() { }

  isTabular(member) {
    return ConceptUtils.isTabular(member);
  }
  ngOnInit(): void {
    this.abnormal = ConceptUtils.isAbnormal(this.member);
  }

  getMergedAbnormalConcept() {
    return ConceptUtils.getMergedAbnormalConcept(this.member);
  }

  isInFormConditions() {
    return ConceptUtils.isInFormConditions(this.member.fullySpecifiedName);
  }
}
