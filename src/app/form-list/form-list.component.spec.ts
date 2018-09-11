import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormListComponent} from './form-list.component';
import {FilterPipe} from '../filter.pipe';
import {FormsModule} from '@angular/forms';
import {ConceptsService} from '../concepts.service';
import {instance, mock, verify, when} from 'ts-mockito';
import {from, Observable} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('FormListComponent', () => {
  let component: FormListComponent;
  let fixture: ComponentFixture<FormListComponent>;
  const ConceptServiceMock: ConceptsService = mock(ConceptsService);
  const conceptServiceMock: ConceptsService = instance(ConceptServiceMock);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [FormListComponent, FilterPipe],
      providers: [{provide: ConceptsService, useValue: conceptServiceMock}]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormListComponent);
    component = fixture.componentInstance;
    when(ConceptServiceMock.getAllObservationTemplates()).thenReturn(mock(Observable));
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

  it('should call getAllObservationTemplates on app initialization', () => {
    component.ngOnInit();

    verify(ConceptServiceMock.getAllObservationTemplates()).called();
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

  it('formNames should be undefined, when httpResponse doesn\'t have data', () => {
    component.ngOnInit();

    expect(component.formNames).toBeUndefined();
  });

});
