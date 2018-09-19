import { Component, Input, OnInit } from '@angular/core';
import { ConceptUtils } from '../utils/concept.utils';

@Component({
  selector: 'app-tabular-view',
  templateUrl: './tabular-view.component.html',
  styleUrls: ['./tabular-view.component.scss']
})
export class TabularViewComponent {


  @Input() member: any;
  constructor() {}

  isTabular(member) {
    return  ConceptUtils.isTabular(member);
  }
}
