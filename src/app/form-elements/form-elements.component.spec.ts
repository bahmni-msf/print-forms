import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormElementsComponent } from './form-elements.component';
import { TabularViewComponent } from '../tabular-view/tabular-view.component';
import { ConceptSetComponent } from '../concept-set/concept-set.component';
import { ConditionalConceptComponent } from '../conditional-concept/conditional-concept.component';
import { ConceptComponent } from '../concept/concept.component';
import { ConceptConditionComponent } from '../concept-condition/concept-condition.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';
import { FormComponent } from '../form/form.component';
import { CodeSheetComponent } from '../code-sheet/code-sheet.component';
import { CodeConceptComponent } from '../code-sheet/code-concept/code-concept.component';
import { CodeConceptSetComponent } from '../code-sheet/code-concept-set/code-concept-set.component';
import { ConceptUtils } from '../utils/concept.utils';

describe('FormElementsComponent', () => {
  let component: FormElementsComponent;
  let fixture: ComponentFixture<FormElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormElementsComponent, TabularViewComponent, ConceptSetComponent, ConditionalConceptComponent,
      ConceptComponent, ConceptConditionComponent, TextBoxComponent, CheckBoxComponent, FormComponent,
        CodeSheetComponent, CodeConceptComponent, CodeConceptSetComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormElementsComponent);
    component = fixture.componentInstance;
    FormComponent.formConditionsConcepts = new Set<String>();
  });

  it('should create', () => {
    fixture.detectChanges();
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
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.concept.name).toBe('conceptA');
    expect(component.concept.fullySpecifiedName).toBe('conceptA');
    expect(component.concept.set).toBe(false);
  });

  it('should add conceptName to formConditionConcepts when concept is found', function () {
    component.formConcepts = [{
      name: 'conceptA',
      set: false,
      fullySpecifiedName: 'conceptA'
    }];
    component.conceptName = 'conceptA';
    component.ngOnInit();
    fixture.detectChanges();

    expect(FormComponent.formConditionsConcepts.has('conceptA')).toBeTruthy();
  });

  it('should not add conceptName to formConditionConcepts when concept is not found', function () {
    component.formConcepts = [];
    component.conceptName = 'conceptA';
    component.ngOnInit();
    fixture.detectChanges();

    expect(FormComponent.formConditionsConcepts.has('conceptA')).toBeFalsy();
  });

  it('should add concept to form conditions map when concept is present', function () {
    component.concept = { fullySpecifiedName : 'name'};

    component.addToFormConditionConcepts();

    expect(ConceptUtils.isInFormConditions('name')).toBeTruthy();
  });

  it('should remove from form conditions map on init', function () {
    component.conceptName = 'conceptA';
    component.formConcepts = [
      {
        fullySpecifiedName: 'conceptA'
      }
    ];

    component.ngOnInit();

    expect(ConceptUtils.isInFormConditions('conceptA')).toBeFalsy();
  });

  it('should not remove from form conditions map on init when the concept is not in form conditions map', function () {
    FormComponent.formConditionsConcepts = new Set<String>();
    FormComponent.formConditionsConcepts.add('conceptA');
    component.conceptName = 'conceptB';
    component.formConcepts = [
      {
        fullySpecifiedName: 'conceptB'
      }
    ];

    component.ngOnInit();

    expect(FormComponent.formConditionsConcepts.size).toBe(1);
  });
});
