import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-conditional-concept',
  templateUrl: './conditional-concept.component.html',
  styleUrls: ['./conditional-concept.component.scss']
})
export class ConditionalConceptComponent implements OnInit {

  @Input() member: any;

  constructor() { }

  ngOnInit() {
  }

}
