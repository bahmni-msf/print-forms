import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSetComponent } from './concept-set.component';
import { ConceptComponent } from '../concept/concept.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { TabularViewComponent } from '../tabular-view/tabular-view.component';
import { ConceptUtils } from '../utils/concept.utils';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';
import { ConditionalConceptComponent } from '../conditional-concept/conditional-concept.component';
import { ConceptConditionComponent } from '../concept-condition/concept-condition.component';
import { FormElementsComponent } from '../form-elements/form-elements.component';

describe('ConceptSetComponent', () => {
  let component: ConceptSetComponent;
  let fixture: ComponentFixture<ConceptSetComponent>;
  let conceptUtils: ConceptUtils;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptSetComponent, ConditionalConceptComponent, ConceptComponent, ConceptConditionComponent,
        TextBoxComponent, TabularViewComponent, CheckBoxComponent, FormElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSetComponent);
    component = fixture.componentInstance;
    component.member = {name: 'test member', set: true, setMembers: []};
  });

  it('should create concept-set component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display div elements with classes concept-set and concept-set-section', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('div')[1].getAttribute('class')).toEqual('concept-set-section');
    expect(compiled.querySelectorAll('div')[2].getAttribute('class')).toEqual('concept-set');
    expect(compiled.querySelectorAll('div')[2].innerText).toEqual('test member');
  });

  it('should display concept and concept-set component when set members list is not empty', function () {
    component.member = {name: 'test member', rendered: false,
      setMembers : [{name: 'member1', set: true, setMembers: [], rendered: false}, {name: 'member2', set: false, rendered: false}]};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('div')[1].getAttribute('class')).toEqual('concept-set-section');
    expect(compiled.querySelectorAll('div')[2].getAttribute('class')).toEqual('concept-set');
    expect(compiled.querySelectorAll('app-concept-set').length).toBe(1);
    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(1);
    expect(compiled.querySelector('app-concept-set')).not.toBeNull();
    expect(compiled.querySelector('app-conditional-concept')).not.toBeNull();
  });

  it('should display only concept component when set members are not concept sets', function () {
    component.member = {name: 'test member', setMembers: [{name: 'member1', set: false}, {name: 'member2', set: false}]};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(2);
    expect(compiled.querySelector('app-conditional-concept')).not.toBeNull();
    expect(compiled.querySelector('app-concept-set')).toBeNull();
  });

  it('should display only concept-set component when all set members are concept sets', function () {
    component.member = {name: 'test member', setMembers : [{name: 'member1', set: true, setMembers:
          [{name: 'member11', set: true, setMembers: []}]}, {name: 'member2', set: true, setMembers: []}]};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-concept-set').length).toBe(3);
    expect(compiled.querySelector('app-concept-set')).not.toBeNull();
    expect(compiled.querySelector('app-conditional-concept')).toBeNull();
  });

  it('should not display concept and concept-set components when set-members list is empty', function () {
    component.member = {name: 'test member', setMembers: []};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-concept-set')).toBeNull();
    expect(compiled.querySelector('app-conditional-concept')).toBeNull();
  });

  it('should call isAbnormal in ConceptUtils on ngOnInt call', function () {
    conceptUtils = spyOn(ConceptUtils, 'isAbnormal');

    component.ngOnInit();

    expect(conceptUtils).toHaveBeenCalledWith(component.member);
  });

  it('should call getMergedAbnormalConcept in ConceptUtils when isAbnormal is undefined', function () {
    conceptUtils = spyOn(ConceptUtils, 'getMergedAbnormalConcept');

    const mergedConcept = component.getMergedAbnormalConcept();

    expect(conceptUtils).toHaveBeenCalledWith(component.member);
  });

  it('should have only one concept on abnormal concept set ', function () {
    component.abnormal = true;
    component.member = {setMembers: [{class: 'Misc'}]};
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();

    expect(compiled.querySelectorAll('app-concept').length).toEqual(1);
    expect(compiled.querySelectorAll('app-conditional-concept').length).toEqual(1);
  });

  it('should call isTabular method of conceptUtils', () => {
    conceptUtils = spyOn(ConceptUtils, 'isTabular');
    const member = {};
    component.isTabular(member);

    expect(conceptUtils).toHaveBeenCalledWith(member);
  });

  it('should display app-tabular-view when isTabular property is true ', function () {
    component.member = {
      name: 'test member', setMembers: [
        { name: 'member1', set: true, config: {isTabular: true}},
        { name: 'member2', set: true, config: {isTabular: true}}
      ]
    };
    fixture.detectChanges();
    spyOn(ConceptUtils, 'isTabular').and.returnValue(true);
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-tabular-view').length).toBe(2);
    expect(compiled.querySelector('app-tabular-view')).not.toBeNull();
  });

  it('should display app-conditional-concept for 2nd level setMembers of tabular-concept ' +
    ' when set property is false ', function () {
    component.member = {
      name: 'test member', setMembers: [
        { name: 'member1', set: true, config: {isTabular: true}, setMembers: [{name: 'member1', set: false, setMembers: []}]},
        { name: 'member2', set: true, config: {isTabular: true}}
      ]
    };
    fixture.detectChanges();
    spyOn(ConceptUtils, 'isTabular').and.returnValue(true);
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-tabular-view').length).toBe(2);
    expect(compiled.querySelector('app-tabular-view')).not.toBeNull();
    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(1);
    expect(compiled.querySelector('app-conditional-concept')).not.toBeNull();
  });

  it('should not display app-tabular-view when isTabular property is false', function () {
    component.member = {
      name: 'test member', setMembers: [{ name: 'member1', set: true, config: {isTabular: false}, setMembers: []},
        { name: 'member2', set: true, config: {isTabular: false}, setMembers: []}]
    };
    fixture.detectChanges();
    spyOn(ConceptUtils, 'isTabular').and.returnValue(false);
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-tabular-view')).toBeNull();
    expect(compiled.querySelector('app-concept-set')).not.toBeNull();
  });

  it('should not display app-tabular-view when set property is false' +
    ' but isTabular property is true ', function () {
    component.member = {
      name: 'test member', setMembers: [{ name: 'member1', set: false, config: {isTabular: true}}]
    };
    fixture.detectChanges();
    spyOn(ConceptUtils, 'isTabular').and.returnValue(true);
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(1);
    expect(compiled.querySelector('app-tabular-view')).toBeNull();
  });

  it('should have + button when config allowAddMore  is true', function () {
    component.member = { name : 'test member', datatype: 'Text', config: {allowAddMore: true}, setMembers: []};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('add-more').length).toBe(1);
  });

  it('should not have + button when config allowAddMore  is not true', function () {
    component.member = { name : 'test member', datatype: 'Text', setMembers: []};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('add-more').length).toBe(0);
  });

  it('should not create any elements if the concepts are rendered', function () {
    component.member = {
      name: 'test',
      set: true,
      rendered: true,
      setMembers: [{
        name: 'conceptA',
        set: false,
        rendered: true
      },
      ]
    };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.getElementsByClassName('div').length).toBe(0);
  });

  it('should set rendered true before rendering the member', function () {
    component.member = {name: 'member', set: true, rendered: false, setMembers: []};
    fixture.detectChanges();
    expect(component.member.rendered).toBe(true);
  });
});
