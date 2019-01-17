import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-concept-condition',
  templateUrl: './concept-condition.component.html',
  styleUrls: ['./concept-condition.component.scss']
})
export class ConceptConditionComponent {

  @Input() conceptConditions: any;
  @Input() formConcepts: any;
}
