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

  it('should create conditional concept element when concept name is passed', function () {
    component.formConcepts = [
      {
        name: 'conceptA',
        fullySpecifiedName: 'conceptA',
        set: false
      },
      {
        name: 'conceptB',
        fullySpecifiedName: 'conceptB',
        set: false
      }
    ];
    component.conceptName = 'conceptA';
    const compiled = fixture.debugElement.nativeElement;
    component.ngOnInit();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(1);
  });

  it('should create concept set element when concept set name is passed', function () {
    component.formConcepts = [
      {
        name: 'conceptA',
        fullySpecifiedName: 'conceptA',
        set: true,
        setMembers: []
      },
      {
        name: 'conceptB',
        fullySpecifiedName: 'conceptB',
        set: false
      }
    ];
    component.conceptName = 'conceptA';
    const compiled = fixture.debugElement.nativeElement;
    component.ngOnInit();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('app-concept-set').length).toBe(1);
  });

  it('should create table element when table concept name is passed', function () {
    component.formConcepts = [
      {
        name: 'conceptA',
        fullySpecifiedName: 'conceptA',
        set: true,
        setMembers: [],
        config: {isTabular: true}
      },
      {
        name: 'conceptB',
        fullySpecifiedName: 'conceptB',
        set: false
      }
    ];
    component.conceptName = 'conceptA';
    const compiled = fixture.debugElement.nativeElement;
    component.ngOnInit();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('app-tabular-view').length).toBe(1);
  });

  it('should not create conditional-concept/concept set/tabular view when ' +
    'the concept is not in formConcepts', function () {
    component.formConcepts = [];
    component.conceptName = 'conceptA';
    const compiled = fixture.debugElement.nativeElement;
    component.ngOnInit();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(0);
    expect(compiled.querySelectorAll('app-concept-set').length).toBe(0);
    expect(compiled.querySelectorAll('app-tabular-view').length).toBe(0);
  });

  it('should fetch concept from formConcepts if conceptName is present', function () {
    component.formConcepts = [{
      name: 'conceptA',
      set: false,
      fullySpecifiedName: 'conceptA'
    }];
    component.conceptName = 'conceptA';
    const compiled = fixture.debugElement.nativeElement;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.concept.name).toBe('conceptA');
    expect(component.concept.fullySpecifiedName).toBe('conceptA');
    expect(component.concept.set).toBe(false);
  });
});
