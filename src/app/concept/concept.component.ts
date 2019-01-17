import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-concept',
  templateUrl: './concept.component.html',
  styleUrls: ['./concept.component.scss']
})
export class ConceptComponent implements OnInit {

  @Input() member: any;

  constructor() {
  }

  ngOnInit() {
    this.setRenderedToTrue();
  }

  private setRenderedToTrue() {
    if (this.member) {
      this.member.rendered = true;
    }
  }
}
