import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-concept',
  templateUrl: './concept.component.html',
  styleUrls: ['./concept.component.scss'],
})
export class ConceptComponent {

  @Input() member: any;

  constructor() {
  }
}
