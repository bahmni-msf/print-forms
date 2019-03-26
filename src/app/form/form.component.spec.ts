import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, of, throwError } from 'rxjs';
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
import { formConditions } from '../form/form.component';
import * as Parser from 'parse-form-conditions';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let ConceptServiceMock: ConceptsService;
  let conceptServiceMock: ConceptsService;
  let formConfigBuilder: FormConfigBuilder;
  let conceptUtils: ConceptUtils;

  beforeEach(async(() => {
    ConceptServiceMock = mock(ConceptsService);
    conceptServiceMock = instance(ConceptServiceMock);
    TestBed.configureTestingModule({
      declarations: [FormComponent, ConceptSetComponent, ConditionalConceptComponent, ConceptComponent, ConceptConditionComponent,
        TextBoxComponent, TabularViewComponent, CheckBoxComponent, CodeSheetComponent, CodeConceptComponent, CodeConceptSetComponent,
        FormElementsComponent],
      providers: [{provide: ActivatedRoute, useValue: {params: from([{formName: 'test form'}])}},
        {provide: ConceptsService, useValue: conceptServiceMock}]
    })
      .compileComponents();
    when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(mock(Observable));
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
  });

  it('should create Form component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get formName from route params in constructor', () => {
    fixture.detectChanges();
    expect(component.name).toBe('test form');
  });

  it('should display div element with class form, formName, btn-group and form/code-sheet/print buttons', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('div')[0].getAttribute('class')).toEqual('form');
    expect(compiled.querySelectorAll('div')[1].getAttribute('class')).toEqual('formName');
    expect(compiled.querySelectorAll('div')[2].getAttribute('class')).toEqual('tab-group');
  });

  it('should have all three buttons inside tab-group', function () {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.getElementsByClassName('btn').length).toBe(2);
    expect(compiled.getElementsByClassName('print-button').length).toBe(1);

  });

  it('should call printForm method on click of print button', async ( () => {
    fixture.detectChanges();
    spyOn(component, 'printForm');

    const button = fixture.debugElement.nativeElement.getElementsByClassName('print-button')[0];
    button.click();

    fixture.whenStable().then(() => {
      expect(component.printForm).toHaveBeenCalled();
    });
  }));

  it('should call print method of window after calling print method', function () {
    fixture.detectChanges();
    spyOn(window, 'print');
    component.printForm();
    expect(window.print).toHaveBeenCalled();

  });

  it('should have active in form-button-class attribute by default', function () {
    fixture.detectChanges();
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
    when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('bahmni FormConditions'));
    spyOn(Parser, 'parseFormConditions').and.returnValue([]);
    when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of('implementation FormConditions'));
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
    when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('bahmni FormConditions'));
    spyOn(Parser, 'parseFormConditions').and.returnValue([]);
    when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of('implementation FormConditions'));
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
    when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('bahmni FormConditions'));
    spyOn(Parser, 'parseFormConditions').and.returnValue([]);
    when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of('implementation FormConditions'));
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

  it('should call getFormConditions on app initialization', () => {
    component.ngOnInit();

    verify(ConceptServiceMock.getFormConditionsConfig()).called();
  });

  it('formConditions should be undefined, when httpResponse doesn\'t have data', () => {
    when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('bahmni config form conditions'));
    when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of('implementation config form conditions'));

    component.ngOnInit();

    expect(formConditions).toEqual({});
    expect(component.formConditionsLoaded).toBeTruthy();
  });

  it('should return only bahmni config form conditions when there is no implementation config form conditions',
    function () {
      when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('Bahmni.ConceptSet.FormConditions.rules = {\r\n    ' +
        '"FSTG, Outcomes for 1st stage ' +
        'surgical validation": function(formName, formFieldValues) {\r\n        let conditions = {\r\n      ' +
        '      show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = ' +
        'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\r\n        let count= 0;' +
        '\r\n        if (count-- == 0) {\r\n            \r\n        }\r\n        return conditions;\r\n    ' +
        '}\r\n};\r\n'));
      when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of(''));
      const bahmniFormConditionsJSON = {
        'conceptA': {
          condition: 'condition',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      spyOn(Parser, 'parseFormConditions').and.returnValue(bahmniFormConditionsJSON);

      component.ngOnInit();

      verify(ConceptServiceMock.getFormConditionsConfig()).once();
      verify(ConceptServiceMock.getImplementationFormConditionsConfig()).once();
      expect(Parser.parseFormConditions).toHaveBeenCalled();
      expect(formConditions).toEqual(bahmniFormConditionsJSON);
      expect(component.formConditionsLoaded).toBeTruthy();
    });

  it('should return only implementation config form conditions when there is no bahmni config form conditions',
    function () {
      when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of(''));
      when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of('Bahmni.ConceptSet.FormConditions.rules = {\r\n    ' +
        '"FSTG, Outcomes for 1st stage ' +
        'surgical validation": function(formName, formFieldValues) {\r\n        let conditions = {\r\n      ' +
        '      show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = ' +
        'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\r\n        let count= 0;' +
        '\r\n        if (count-- == 0) {\r\n            \r\n        }\r\n        return conditions;\r\n    ' +
        '}\r\n};\r\n'));
      const implementationFormConditionsJSON = {
        'conceptA': {
          condition: 'condition',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      spyOn(Parser, 'parseFormConditions').and.returnValue(implementationFormConditionsJSON);

      component.ngOnInit();

      verify(ConceptServiceMock.getFormConditionsConfig()).once();
      verify(ConceptServiceMock.getImplementationFormConditionsConfig()).once();
      expect(Parser.parseFormConditions).toHaveBeenCalled();
      expect(formConditions).toEqual(implementationFormConditionsJSON);
      expect(component.formConditionsLoaded).toBeTruthy();
    });

  it('should merge bahmni and implementation form conditions',
    function () {
      when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('Bahmni.ConceptSet.FormConditions.rules = {\\r\\n    \' +\n' +
        '        \'"FSTG, Outcomes for 1st stage \' +\n' +
        '        \'surgical validation": function(formName, formFieldValues) {\\r\\n        let conditions = {\\r\\n      \' +\n' +
        '        \'      show: [],\\r\\n            hide: []\\r\\n        };\\r\\n        let conditionConcept = \' +\n' +
        '        \'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\\r\\n        let count= 0;\' +\n' +
        '        \'\\r\\n        if (count-- == 0) {\\r\\n            \\r\\n        }\\r\\n        return conditions;\\r\\n    \' +\n' +
        '        \'}\\r\\n};\\r\\n'));
      when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of('Bahmni.ConceptSet.FormConditions.rules = {\r\n    ' +
        '"FSTG, Outcomes for 1st stage ' +
        'surgical validation": function(formName, formFieldValues) {\r\n        let conditions = {\r\n      ' +
        '      show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = ' +
        'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\r\n        let count= 0;' +
        '\r\n        if (count-- == 0) {\r\n            \r\n        }\r\n        return conditions;\r\n    ' +
        '}\r\n};\r\n'));

      const bahmniFormConditionsJSON = {
        'conceptA': {
          condition: 'condition',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      const implementationFormConditionsJSON = {
        'conceptB': {
          condition: 'condition',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      const expectedFormConditions = {
        'conceptA': {
          condition: 'condition',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        },
        'conceptB': {
          condition: 'condition',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      spyOn(Parser, 'parseFormConditions').and.returnValues(bahmniFormConditionsJSON, implementationFormConditionsJSON);

      component.ngOnInit();

      verify(ConceptServiceMock.getFormConditionsConfig()).once();
      verify(ConceptServiceMock.getImplementationFormConditionsConfig()).once();
      expect(Parser.parseFormConditions).toHaveBeenCalledTimes(2);
      expect(formConditions).toEqual(expectedFormConditions);
      expect(component.formConditionsLoaded).toBeTruthy();
    });

  it('should replace bahmni form conditions when there is same concept in implementation form conditions',
    function () {
      when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('Bahmni.ConceptSet.FormConditions.rules = {\\r\\n    \' +\n' +
        '        \'"FSTG, Outcomes for 1st stage \' +\n' +
        '        \'surgical validation": function(formName, formFieldValues) {\\r\\n        let conditions = {\\r\\n      \' +\n' +
        '        \'      show: [],\\r\\n            hide: []\\r\\n        };\\r\\n        let conditionConcept = \' +\n' +
        '        \'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\\r\\n        let count= 0;\' +\n' +
        '        \'\\r\\n        if (count-- == 0) {\\r\\n            \\r\\n        }\\r\\n        return conditions;\\r\\n    \' +\n' +
        '        \'}\\r\\n};\\r\\n'));
      when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of('Bahmni.ConceptSet.FormConditions.rules = {\r\n    ' +
        '"FSTG, Outcomes for 1st stage ' +
        'surgical validation": function(formName, formFieldValues) {\r\n        let conditions = {\r\n      ' +
        '      show: [],\r\n            hide: []\r\n        };\r\n        let conditionConcept = ' +
        'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\r\n        let count= 0;' +
        '\r\n        if (count-- == 0) {\r\n            \r\n        }\r\n        return conditions;\r\n    ' +
        '}\r\n};\r\n'));

      const bahmniFormConditionsJSON = {
        'conceptA': {
          condition: 'conditionOne',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      const implementationFormConditionsJSON = {
        'conceptA': {
          condition: 'conditionTwo',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      spyOn(Parser, 'parseFormConditions').and.returnValues(bahmniFormConditionsJSON, implementationFormConditionsJSON);

      component.ngOnInit();

      verify(ConceptServiceMock.getFormConditionsConfig()).once();
      verify(ConceptServiceMock.getImplementationFormConditionsConfig()).once();
      expect(Parser.parseFormConditions).toHaveBeenCalledTimes(2);
      expect(formConditions).toEqual(implementationFormConditionsJSON);
      expect(component.formConditionsLoaded).toBeTruthy();
    });

  it('should return only bahmni form conditions when implementation config response failed',
    function () {
      when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(of('Bahmni.ConceptSet.FormConditions.rules = {\\r\\n    \' +\n' +
        '        \'"FSTG, Outcomes for 1st stage \' +\n' +
        '        \'surgical validation": function(formName, formFieldValues) {\\r\\n        let conditions = {\\r\\n      \' +\n' +
        '        \'      show: [],\\r\\n            hide: []\\r\\n        };\\r\\n        let conditionConcept = \' +\n' +
        '        \'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\\r\\n        let count= 0;\' +\n' +
        '        \'\\r\\n        if (count-- == 0) {\\r\\n            \\r\\n        }\\r\\n        return conditions;\\r\\n    \' +\n' +
        '        \'}\\r\\n};\\r\\n'));
      when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(throwError('implementation config failed'));

      const bahmniFormConditionsJSON = {
        'conceptA': {
          condition: 'conditionOne',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      spyOn(Parser, 'parseFormConditions').and.returnValue(bahmniFormConditionsJSON);

      component.ngOnInit();

      verify(ConceptServiceMock.getFormConditionsConfig()).once();
      verify(ConceptServiceMock.getImplementationFormConditionsConfig()).once();
      expect(Parser.parseFormConditions).toHaveBeenCalledTimes(1);
      expect(formConditions).toEqual(bahmniFormConditionsJSON);
      expect(component.formConditionsLoaded).toBeTruthy();
    });

  it('should return only implementation form conditions when bahmni config response failed',
    function () {
      when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(throwError('bahmni config failed'));
      when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(of(
        'Bahmni.ConceptSet.FormConditions.rules = {\\r\\n    \' +\n        \'"FSTG, Outcomes for 1st stage \' +\n' +
        '        \'surgical validation": function(formName, formFieldValues) {\\r\\n        let conditions = {\\r\\n      \' +\n' +
        '        \'      show: [],\\r\\n            hide: []\\r\\n        };\\r\\n        let conditionConcept = \' +\n' +
        '        \'formFieldValues[ "FSTG, Outcomes for 1st stage surgical validation" ];\\r\\n        let count= 0;\' +\n' +
        '        \'\\r\\n        if (count-- == 0) {\\r\\n            \\r\\n        }\\r\\n        return conditions;\\r\\n    \' +\n' +
        '        \'}\\r\\n};\\r\\n'));

      const implementationFormConditionsJSON = {
        'conceptA': {
          condition: 'conditionOne',
          conceptsToShow: [],
          nestedConditions: [],
          conceptsToHide: []
        }
      };
      spyOn(Parser, 'parseFormConditions').and.returnValue(implementationFormConditionsJSON);

      component.ngOnInit();

      verify(ConceptServiceMock.getFormConditionsConfig()).once();
      verify(ConceptServiceMock.getImplementationFormConditionsConfig()).once();
      expect(Parser.parseFormConditions).toHaveBeenCalledTimes(1);
      expect(formConditions).toEqual(implementationFormConditionsJSON);
      expect(component.formConditionsLoaded).toBeTruthy();
    });

  it('should return form conditions as undefined when bahmni config & implementation config responses failed',
    function () {
      when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(throwError('bahmni config failed'));
      when(ConceptServiceMock.getImplementationFormConditionsConfig()).thenReturn(throwError('implementation config failed'));
      spyOn(Parser, 'parseFormConditions');

      component.ngOnInit();

      verify(ConceptServiceMock.getFormConditionsConfig()).once();
      verify(ConceptServiceMock.getImplementationFormConditionsConfig()).once();
      expect(Parser.parseFormConditions).not.toHaveBeenCalled();
      expect(formConditions).toBeUndefined();
      expect(component.formConditionsLoaded).toBeTruthy();
    });
});
