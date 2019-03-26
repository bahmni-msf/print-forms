import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { formConditions } from '../form/form.component';
import { ConceptUtils } from '../utils/concept.utils';

@Component({
  selector: 'app-conditional-concept',
  templateUrl: './conditional-concept.component.html',
  styleUrls: ['./conditional-concept.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConditionalConceptComponent implements OnInit {

  conceptConditions: any;
  @Input() member: any;
  @Input() formConcepts: any;

  constructor() {
  }

  ngOnInit() {
    if (this.member && (formConditions && formConditions[this.member.fullySpecifiedName])) {
      this.conceptConditions = formConditions[this.member.fullySpecifiedName];
    }
  }

  isInFormConditions() {
    return ConceptUtils.isInFormConditions(this.member.fullySpecifiedName);
  }
}
