import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ConceptsService {

  constructor(private http: HttpClient) {
  }

  getAllObservationTemplates() {
    return this.http.get(Constants.OPENMRS_ROOT_URL + Constants.ALL_OBSERVATION_TEMPLATES_URL);
  }

  getFormDetails(formName: String) {
    return this.http.get(Constants.OPENMRS_ROOT_URL + Constants.FORM_DETAILS_URL +
      formName + Constants.BAHMNI_RESOURCE_URL);
  }

  getAppConfig() {
    return this.http.get(Constants.CLINICAL_APP_CONFIG_FILE_PATH);
  }
}
