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

  public static isElementRendered(member) {
    if (member) {
      if (member.rendered === true) {
        return true;
      } else {
        member.rendered = true;
        return false;
      }
    }
  }
}
