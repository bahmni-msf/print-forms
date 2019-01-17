import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormElementsComponent } from './form-elements.component';
import { TabularViewComponent } from '../tabular-view/tabular-view.component';
import { ConceptSetComponent } from '../concept-set/concept-set.component';
import { ConditionalConceptComponent } from '../conditional-concept/conditional-concept.component';
import { ConceptComponent } from '../concept/concept.component';
import { ConceptConditionComponent } from '../concept-condition/concept-condition.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';

describe('FormElementsComponent', () => {
  let component: FormElementsComponent;
  let fixture: ComponentFixture<FormElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormElementsComponent, TabularViewComponent, ConceptSetComponent, ConditionalConceptComponent,
      ConceptComponent, ConceptConditionComponent, TextBoxComponent, CheckBoxComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
