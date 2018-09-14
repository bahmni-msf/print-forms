import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ActivatedRoute } from '@angular/router';
import { from, of } from 'rxjs';
import { FormConfigBuilder } from '../utils/form.config.builder';
import { instance, mock, verify, when } from 'ts-mockito';
import { ConceptsService } from '../concepts.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  const ConceptServiceMock: ConceptsService = mock(ConceptsService);
  const conceptServiceMock: ConceptsService = instance(ConceptServiceMock);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      providers: [{provide: ActivatedRoute, useValue: {params: from([{formName: 'test form'}])}},
        {provide: ConceptsService, useValue: conceptServiceMock}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    const appConfig = of({config : {
        conceptSetUI: 'appConfig'
      }});
    const formDetails = of({results : ['formDetails']});
    when(ConceptServiceMock.getAppConfig()).thenReturn(appConfig);
    when(ConceptServiceMock.getFormDetails('formName')).thenReturn(formDetails);
  });

  it('should create Form component', () => {
    expect(component).toBeTruthy();
  });

  it('should get formName from route params in constructor', () => {
    expect(component.name).toBe('test form');
  });

  it('should display div element with class form and formName', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelectorAll('div')[0].getAttribute('class')).toEqual('form');
    expect(compiled.querySelectorAll('div')[1].getAttribute('class')).toEqual('formName');
  });

  it('should call form config builder with given app config and form details', function () {
    const formConfigBuilder = spyOn(FormConfigBuilder, 'build');
    component.name = 'formName';

    component.ngOnInit();

    verify(ConceptServiceMock.getAppConfig()).called();
    verify(ConceptServiceMock.getFormDetails('formName')).called();
    expect(formConfigBuilder).toHaveBeenCalledWith('formDetails', 'appConfig' );
  });
});
