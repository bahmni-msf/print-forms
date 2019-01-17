import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularViewComponent } from './tabular-view.component';
import { ConceptSetComponent } from '../concept-set/concept-set.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { ConceptUtils } from '../utils/concept.utils';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';
import { ConditionalConceptComponent } from '../conditional-concept/conditional-concept.component';
import { ConceptComponent } from '../concept/concept.component';
import { ConceptConditionComponent } from '../concept-condition/concept-condition.component';
import { FormElementsComponent } from '../form-elements/form-elements.component';

describe('TabularViewComponent', () => {
  let component: TabularViewComponent;
  let fixture: ComponentFixture<TabularViewComponent>;
  let conceptUtils: ConceptUtils;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptSetComponent, ConditionalConceptComponent, ConceptComponent, ConceptConditionComponent,
        TextBoxComponent, TabularViewComponent, CheckBoxComponent, FormElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabularViewComponent);
    component = fixture.componentInstance;
    component.member = {setMembers: []};
    fixture.detectChanges();
  });

  it('should create Tabular view component', () => {

    expect(component).toBeTruthy();
  });

  it('should call isTabular method of conceptUtils', () => {
    const member = {};
    conceptUtils = spyOn(ConceptUtils, 'isTabular');
    component.isTabular(member);

    expect(conceptUtils).toHaveBeenCalledWith(member);
  });

  it('should display concept-name in strong tag', function () {
    component.member = {name: 'test member', setMembers: []};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('strong').length).toBe(1);
    expect(compiled.querySelector('strong').innerText).toEqual('test member');
  });

  it('should display concept-heading for all setMembers', function () {
    component.member = {
      name: 'test member', setMembers: [
        {name: 'member1', set: false},
        {name: 'member2', set: false},
      ]
    };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('div')[3].getAttribute('class')).toEqual('concept-name');
    expect(compiled.getElementsByClassName('concept-name').length).toBe(2);
  });

  it('should not display concept-heading when set-members is empty', function () {
    component.member = {
      name: 'test member', setMembers: []
    };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.getElementsByClassName('concept-name').length).toBe(0);
  });

  it('should display app-conditional-concept for setMembers when set property is false ', function () {
    component.member = {
      name: 'test member', setMembers: [
        {name: 'member1', set: false},
        {name: 'member2', set: false}
      ]
    };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(2);
    expect(compiled.querySelector('app-conditional-concept')).not.toBeNull();
  });

  it('should display app-conditional-concept for 2nd level of setMembers when set property is false ', function () {
    component.member = {
      name: 'test member', setMembers: [
        {
          name: 'member1', set: true, setMembers: [
            {name: 'member1', set: false},
            {name: 'member2', set: false}]
        }
      ]
    };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(2);
    expect(compiled.querySelector('app-conditional-concept')).not.toBeNull();
  });

  it('should display app-concept-set for 2nd level of setMembers when set property is true' +
    ' but isTabular is false ', function () {
    component.member = {
      name: 'test member', setMembers: [
        {
          name: 'member1', set: true, setMembers: [
            {name: 'member1', set: true, setMembers: []},
            {name: 'member2', set: true, setMembers: []}]
        }
      ]
    };
    spyOn(ConceptUtils, 'isTabular').and.returnValue(false);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-concept-set').length).toBe(2);
    expect(compiled.querySelector('app-concept-set')).not.toBeNull();
    expect(compiled.querySelector('app-conditional-concept')).toBeNull();
  });

  it('should display app-tabular-view for 2nd level of setMembers when set property and isTabular is true ', function () {
    component.member = {
      name: 'test member', setMembers: [
        {
          name: 'member1', set: true, setMembers: [
            {name: 'member1', set: true},
            {name: 'member2', set: true}]
        }
      ]
    };
    spyOn(ConceptUtils, 'isTabular').and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-tabular-view').length).toBe(2);
    expect(compiled.querySelector('app-tabular-view')).not.toBeNull();
  });
});
