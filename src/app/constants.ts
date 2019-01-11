export class Constants {
  public static OPENMRS_ROOT_URL = 'https://' + window.location.hostname + '/openmrs/ws/rest/v1/';
  public static PRINT_FORMS_PRIVILEGE = 'app:print-forms';
  public static NO_PRIVILEGE_ERROR = 'User is logged in but doesn\'t have the relevant privilege';
  public static WHOAMI_URL = 'bahmnicore/whoami';
  public static ALL_OBSERVATION_TEMPLATES_URL = 'concept?s=byFullySpecifiedName&name=All+Observation+Templates&v' +
    '=custom:(setMembers:(display))';
  public static FORM_DETAILS_URL = 'concept?s=byFullySpecifiedName&locale=en&name=';
  public static BAHMNI_RESOURCE_URL = '&v=bahmni';
  public static CLINICAL_APP_CONFIG_FILE_PATH = '../bahmni_config/openmrs/apps/clinical/app.json';
  public static FORM_CONDITIONS_CONFIG_FILE_PATH = '../bahmni_config/openmrs/apps/clinical/formConditions.json';
}

