import { getTestBed, inject, TestBed } from '@angular/core/testing';
import { Constants } from './constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConceptsService } from './concepts.service';
import { FormConfigBuilder } from './utils/form.config.builder';

describe('ConceptsService', () => {
  let service: ConceptsService;
  let httpMock: HttpTestingController;
  let injector: TestBed;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConceptsService]
    });
    injector = getTestBed();
    service = injector.get(ConceptsService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', inject([ConceptsService], () => {
    expect(service).toBeTruthy();
  }));

  it('should make a call on http with ALL_OBSERVATION_TEMPLATES_URL for getting All Observation Templates', function () {
    service.getAllObservationTemplates().subscribe();

    const testRequest = httpMock.expectOne(Constants.OPENMRS_ROOT_URL + Constants.ALL_OBSERVATION_TEMPLATES_URL);
    expect(testRequest.request.method).toBe('GET');
  });


  it('should make http get call to get app config', function () {
    service.getFormConfiguration('formName');

    const testRequest = httpMock.expectOne(Constants.CONFIG_FILE_PATH);
    expect(testRequest.request.method).toBe('GET');
  });

  it('should make http get call to get form details for given form name', function () {
    service.getFormConfiguration('formName');

    let testRequest = httpMock.expectOne(Constants.CONFIG_FILE_PATH);
    testRequest.flush({config: 'value'});
    expect(testRequest.request.method).toBe('GET');
    testRequest = httpMock.expectOne(Constants.OPENMRS_ROOT_URL + Constants.FORM_DETAILS_URL +
      'formName' + Constants.BAHMNI_RESOURCE_URL);
    expect(testRequest.request.method).toBe('GET');
  });

  it('should call form config builder with given app config and form details', function () {
    const formConfigBuilder = spyOn(FormConfigBuilder, 'build');
    service.getFormConfiguration('formName');

    const configRequest = httpMock.expectOne(Constants.CONFIG_FILE_PATH);
    configRequest.flush({config: { conceptSetUI: 'formConfig'}});
    const formDetailsRequest = httpMock.expectOne(Constants.OPENMRS_ROOT_URL + Constants.FORM_DETAILS_URL +
      'formName' + Constants.BAHMNI_RESOURCE_URL);
    formDetailsRequest.flush({results: ['formDetails']});

    expect(formConfigBuilder).toHaveBeenCalledWith('formDetails', 'formConfig');
  });
});