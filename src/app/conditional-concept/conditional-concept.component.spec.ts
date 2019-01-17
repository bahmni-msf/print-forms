import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalConceptComponent } from './conditional-concept.component';
import { ConceptComponent } from '../concept/concept.component';
import { ConceptConditionComponent } from '../concept-condition/concept-condition.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';
import { formConditions } from '../form-list/form-list.component';
import { FormElementsComponent } from '../form-elements/form-elements.component';
import { TabularViewComponent } from '../tabular-view/tabular-view.component';
import { ConceptSetComponent } from '../concept-set/concept-set.component';

describe('ConditionalConceptComponent', () => {
  let component: ConditionalConceptComponent;
  let fixture: ComponentFixture<ConditionalConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionalConceptComponent, ConceptComponent, ConceptConditionComponent, TextBoxComponent,
        CheckBoxComponent, FormElementsComponent, TabularViewComponent, ConceptSetComponent],
      providers: [{provide: formConditions}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalConceptComponent);
    component = fixture.componentInstance;
    component.member = {name: 'member'};
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create concept component and concept condition when concept conditions exist', function () {
    component.member = {name: 'member', set: false};
    component.conceptConditions = [];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-concept').length).toBe(1);
    expect(compiled.querySelectorAll('app-concept-condition').length).toBe(1);
  });

  it('should not create concept condition when concept conditions does not exist', function () {
    component.member = {name: 'member', set: false};
    component.conceptConditions = undefined;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-concept-condition').length).toBe(0);
  });
});
