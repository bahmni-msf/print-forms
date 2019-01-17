import { Component, Input, OnInit } from '@angular/core';
import { formConditions } from '../form-list/form-list.component';

@Component({
  selector: 'app-conditional-concept',
  templateUrl: './conditional-concept.component.html',
  styleUrls: ['./conditional-concept.component.scss']
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
}
