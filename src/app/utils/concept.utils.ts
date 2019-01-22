import { FormComponent } from '../form/form.component';

export class ConceptUtils {

  public static isTabular(concept) {
    const config = concept.config;
    if (config) {
      if (config.isTabular) {
        return config.isTabular;
      }
    }
    return false;
  }

  public static getMergedAbnormalConcept(conceptSet: any) {
    for (const member of conceptSet.setMembers) {
      if (member.class !== 'Abnormal') {
        member.isAbnormal = true;
        return member;
      }
    }
  }

  public static isAbnormal(conceptSet: any) {
    for (const member of conceptSet.setMembers) {
      if (member.class === 'Abnormal') {
        return true;
      }
    }
    return false;
  }

  public static isInFormConditions(fullySpecifiedName) {
    return FormComponent.formConditionsConcepts.has(fullySpecifiedName);
  }
}
