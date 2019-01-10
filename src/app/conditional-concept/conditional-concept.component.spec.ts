import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalConceptComponent } from './conditional-concept.component';
import { ConceptComponent } from '../concept/concept.component';
import { ConceptConditionComponent } from '../concept-condition/concept-condition.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';

describe('ConditionalConceptCogstmponent', () => {
  let component: ConditionalConceptComponent;
  let fixture: ComponentFixture<ConditionalConceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionalConceptComponent, ConceptComponent, ConceptConditionComponent, TextBoxComponent, CheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalConceptComponent);
    component = fixture.componentInstance;
    component.member = {name: 'member'};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create concept component if member have set true', function () {
    component.member = {name: 'member', set: true};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-concept').length).toBe(0);
  });

  it('should create concept component if member have set false', function () {
    component.member = {name: 'member', set: false};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-concept').length).toBe(1);
    expect(compiled.querySelectorAll('app-concept-condition').length).toBe(1);
  });
});
