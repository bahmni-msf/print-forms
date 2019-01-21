import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptConditionComponent } from './concept-condition.component';
import { ConditionalConceptComponent } from '../conditional-concept/conditional-concept.component';
import { ConceptComponent } from '../concept/concept.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';
import { FormElementsComponent } from '../form-elements/form-elements.component';
import { TabularViewComponent } from '../tabular-view/tabular-view.component';
import { ConceptSetComponent } from '../concept-set/concept-set.component';

describe('ConceptConditionComponent', () => {
  let component: ConceptConditionComponent;
  let fixture: ComponentFixture<ConceptConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptConditionComponent, ConditionalConceptComponent, ConceptComponent,
        TextBoxComponent, CheckBoxComponent, FormElementsComponent, TabularViewComponent, ConceptSetComponent, FormElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not create p and div elements if there are no conceptConditions', () => {
    component.conceptConditions = [];
    component.formConcepts = [];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p').length).toBe(0);
    expect(compiled.querySelectorAll('div').length).toBe(0);
  });

  it('should not create p and div element if there is a condition and no ' +
    'nestedConditions or conceptsToShow in conceptConditions', () => {
    component.conceptConditions = [{
      condition: 'some condition'
    }];
    component.formConcepts = [];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p').length).toBe(0);
  });

  it('should create p(condition) and form elements elements if there is a condition and ' +
    'there are conceptsToShow in conceptConditions', () => {
    component.conceptConditions = [{
      condition: 'some condition',
      conceptsToShow: ['conceptA', 'conceptB']
    }];
    component.formConcepts = [{
      name: 'conceptA',
      fullySpecifiedName: 'conceptA'
    }, {
      name: 'conceptB',
      fullySpecifiedName: 'conceptB'
    }];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p')[0].getAttribute('class')).toEqual('condition');
    expect(compiled.querySelectorAll('app-form-elements').length).toBe(2);
  });

  it('should not create form-elements element if there are no conceptsToShow ' +
    'in conceptConditions', () => {
    component.conceptConditions = [{
      condition: 'some condition',
      conceptsToShow: [],
      nestedConditions: {
        condition: 'condition'
      }
    }];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-form-elements').length).toBe(0);
  });

  it('should not create concept-condition element if there is no nestedCondition ' +
    'in conceptConditions', () => {
    component.conceptConditions = [{
      condition: 'some condition',
      conceptsToShow: ['conceptA']
    }];
    component.formConcepts = [{
      name: 'conceptA',
      fullySpecifiedName: 'conceptA'
    }, {
      name: 'conceptB',
      fullySpecifiedName: 'conceptB'
    }];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-concept-condition').length).toBe(0);
  });

  it('should create p and concept-condition element if there is a nestedCondition ' +
    'in conceptConditions', () => {
    component.conceptConditions = [{
      condition: 'some condition',
      nestedConditions: [{
        condition: 'some condition2',
        conceptsToShow: ['conceptA']
      }]
    }];
    component.formConcepts = [{
      name: 'conceptA',
      fullySpecifiedName: 'conceptA'
    }, {
      name: 'conceptB',
      fullySpecifiedName: 'conceptB'
    }];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p')[0].getAttribute('class')).toEqual('condition');
    expect(compiled.querySelectorAll('app-concept-condition').length).toBe(1);
  });
});
