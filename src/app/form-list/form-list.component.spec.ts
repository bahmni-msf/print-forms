import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { formConditions, FormListComponent } from './form-list.component';
import { FilterPipe } from '../filter.pipe';
import { FormsModule } from '@angular/forms';
import { ConceptsService } from '../concepts.service';
import { instance, mock, verify, when } from 'ts-mockito';
import { from, Observable, of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import * as Parser from 'parse-form-conditions';

describe('FormListComponent', () => {
  let component: FormListComponent;
  let fixture: ComponentFixture<FormListComponent>;
  let ConceptServiceMock: ConceptsService;
  let conceptServiceMock: ConceptsService;

  beforeEach(async(() => {
    ConceptServiceMock = mock(ConceptsService);
    conceptServiceMock = instance(ConceptServiceMock);
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [FormListComponent, FilterPipe],
      providers: [{provide: ConceptsService, useValue: conceptServiceMock}]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormListComponent);
    component = fixture.componentInstance;
    when(ConceptServiceMock.getAllObservationTemplates()).thenReturn(mock(Observable));
    when(ConceptServiceMock.getFormConditionsConfig()).thenReturn(mock(Observable));
  }));

  it('should create Form list component', () => {
    expect(component).toBeTruthy();
  });

  it('should verify common html elements', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div').getAttribute('class')).toContain('searchbox');
    expect(compiled.querySelector('div > div').getAttribute('class')).toEqual('search');
    expect(compiled.querySelector('div > div > div').getAttribute('class')).toContain('icon fa fa-search');

    expect(compiled.querySelector('div > div > input').getAttribute('class')).toContain('search_input');
    expect(compiled.querySelector('div > ul')).not.toBeNull();
  });

  it('should not have li element when formNames list is empty', () => {
    component.formNames = [];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('li')).toBeNull();
  });

  it('should have li elements with routerLink attribute and text content when formNames list has two forms', () => {
    component.formNames = ['form 1', 'form 2'];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('div > ul > li').length).toEqual(2);

    expect(compiled.querySelector('div > ul > li > a').getAttribute('ng-reflect-router-link')).toEqual('form 1');
    expect(compiled.querySelector('div > ul > li ~ li > a').getAttribute('ng-reflect-router-link')).toEqual('form 2');

    expect(compiled.querySelector('div > ul > li').textContent).toEqual('form 1');
    expect(compiled.querySelector('div > ul > li ~ li').textContent).toEqual('form 2');

  });

  it('should call getAllObservationTemplates and getFormConditions on app initialization', () => {
    component.ngOnInit();

    verify(ConceptServiceMock.getAllObservationTemplates()).called();
    verify(ConceptServiceMock.getFormConditionsConfig()).called();
  });

  it('should have list of form names, when httpResponse have data on app initialization', () => {
    const testResponse = from([{
      results: [{
        setMembers: [{display: 'History and Examination'}, {display: 'Vitals'}, {display: 'Second Vitals'}]
      }]
    }]);
    when(ConceptServiceMock.getAllObservationTemplates()).thenReturn(testResponse);

    component.ngOnInit();

    expect(component.formNames).toEqual(['History and Examination', 'Vitals', 'Second Vitals']);
  });

  it('formNames and formConditions should be undefined, when httpResponse doesn\'t have data', () => {
    component.ngOnInit();

    expect(component.formNames).toBeUndefined();
    expect(formConditions).toBeUndefined();
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
    });
});
