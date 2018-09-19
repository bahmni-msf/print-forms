import { Component, Input, OnInit } from '@angular/core';
import { ConceptComponent } from '../../concept/concept.component';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent {

  @Input() member: any;
  constructor() { }
}