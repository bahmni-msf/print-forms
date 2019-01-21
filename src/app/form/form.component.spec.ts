import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ActivatedRoute } from '@angular/router';
import { from, of } from 'rxjs';
import { FormConfigBuilder } from '../utils/form.config.builder';
import { instance, mock, verify, when } from 'ts-mockito';
import { ConceptsService } from '../concepts.service';
import { ConceptSetComponent } from '../concept-set/concept-set.component';
import { ConceptComponent } from '../concept/concept.component';
import { TextBoxComponent } from '../elements/text-box/text-box.component';
import { TabularViewComponent } from '../tabular-view/tabular-view.component';
import { ConceptUtils } from '../utils/concept.utils';
import { CheckBoxComponent } from '../elements/check-box/check-box.component';
import { CodeSheetComponent } from '../code-sheet/code-sheet.component';
import { CodeConceptComponent } from '../code-sheet/code-concept/code-concept.component';
import { CodeConceptSetComponent } from '../code-sheet/code-concept-set/code-concept-set.component';
import { ConditionalConceptComponent } from '../conditional-concept/conditional-concept.component';
import { ConceptConditionComponent } from '../concept-condition/concept-condition.component';
import { FormElementsComponent } from '../form-elements/form-elements.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  const ConceptServiceMock: ConceptsService = mock(ConceptsService);
  const conceptServiceMock: ConceptsService = instance(ConceptServiceMock);
  let formConfigBuilder: FormConfigBuilder;
  let conceptUtils: ConceptUtils;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent, ConceptSetComponent, ConditionalConceptComponent, ConceptComponent, ConceptConditionComponent,
        TextBoxComponent, TabularViewComponent, CheckBoxComponent, CodeSheetComponent, CodeConceptComponent, CodeConceptSetComponent,
        FormElementsComponent],
      providers: [{provide: ActivatedRoute, useValue: {params: from([{formName: 'test form'}])}},
        {provide: ConceptsService, useValue: conceptServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const appConfig = of({config : {
        conceptSetUI: 'appConfig'
      }});
    const formDetails = of({results : ['formDetails']});
    when(ConceptServiceMock.getAppConfig()).thenReturn(appConfig);
    when(ConceptServiceMock.getFormDetails('test form')).thenReturn(formDetails);
    formConfigBuilder = spyOn(FormConfigBuilder, 'build');
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    component.form = {};
    fixture.detectChanges();
  });

  it('should create Form component', () => {
    expect(component).toBeTruthy();
  });

  it('should get formName from route params in constructor', () => {
    expect(component.name).toBe('test form');
  });

  it('should display div element with class form, formName, btn-group and form/code-sheet/print buttons', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('div')[0].getAttribute('class')).toEqual('form');
    expect(compiled.querySelectorAll('div')[1].getAttribute('class')).toEqual('formName');
    expect(compiled.querySelectorAll('div')[2].getAttribute('class')).toEqual('tab-group');
  });

  it('should have all three buttons inside tab-group', function () {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.getElementsByClassName('btn').length).toBe(2);
    expect(compiled.getElementsByClassName('print-button').length).toBe(1);

  });

  it('should call printForm method on click of print button', async ( () => {
    spyOn(component, 'printForm');

    const button = fixture.debugElement.nativeElement.getElementsByClassName('print-button')[0];
    button.click();

    fixture.whenStable().then(() => {
      expect(component.printForm).toHaveBeenCalled();
    });
  }));

  it('should call print method of window after calling print method', function () {
    spyOn(window, 'print');
    component.printForm();
    expect(window.print).toHaveBeenCalled();

  });

  it('should have active in form-button-class attribute by default', function () {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('button')[0].getAttribute('class')).toContain('active');
  });

  it('should have active in code-sheet-button class attribute when isFormSelected is false', function () {
    component.isFormSelected = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('button')[1].getAttribute('class')).toContain('active');
  });

  it('should call form config builder with given app config and form details', function () {
    verify(ConceptServiceMock.getAppConfig()).called();
    verify(ConceptServiceMock.getFormDetails('test form')).called();
    expect(formConfigBuilder).toHaveBeenCalledWith('formDetails', 'appConfig' );
  });

  it('should display concept and concept-set component when set members list is not empty', function () {
    component.form = {name: 'test form', setMembers : [{name: 'member1', set: true, setMembers: []}, {name: 'member2', set: false}]};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('app-concept-set').length).toBe(1);
    expect(compiled.querySelectorAll('app-conditional-concept').length).toBe(1);
    expect(compiled.querySelector('app-concept-set')).not.toBeNull();
    expect(compiled.querySelector('app-conditional-concept')).not.toBeNull();
  });

  it('should call isTabular method of conceptUtils', () => {
    const member = {};
    conceptUtils = spyOn(ConceptUtils, 'isTabular');
    component.isTabular(member);

    expect(conceptUtils).toHaveBeenCalledWith(member);
  });

  it('should display app-tabular-view for setMembers when isTabular and set property is true', function () {
    component.form = {
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

  it('should not display app-tabular-view when isTabular property is false', function () {
    component.form = {
      name: 'test member', setMembers: [ { name: 'member1', set: true, config: {isTabular: false}, setMembers: []},
        { name: 'member2', set: true, config: {isTabular: false}, setMembers: []}
        ]
    };
    fixture.detectChanges();
    spyOn(ConceptUtils, 'isTabular').and.returnValue(false);
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-tabular-view')).toBeNull();
    expect(compiled.querySelector('app-concept-set')).not.toBeNull();
  });

  it('should not display app-code-sheet by default', function () {
    component.form = {
      name: 'test member', setMembers: [{name: 'member1', set: true, config: {isTabular: false}, setMembers: []},
        {name: 'member2', set: true, config: {isTabular: false}, setMembers: []}
      ]
    };
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-code-sheet')).toBeNull();
  });

  it('should  display app-code-sheet when isFormSelected property is false', function () {
    component.form = {
      name: 'test member', setMembers: [{name: 'member1', set: true, config: {isTabular: false}, setMembers: []},
        {name: 'member2', set: true, config: {isTabular: false}, setMembers: []}
      ]
    };
    component.isFormSelected = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-code-sheet')).not.toBeNull();
  });

  it('should set given value to isFormSelected', function () {
    component.setIsFormSelected(true);
    expect(component.isFormSelected).toBeTruthy();
    component.setIsFormSelected(false);
    expect(component.isFormSelected).toBeFalsy();
  });

});
