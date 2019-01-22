import { ConceptUtils } from './concept.utils';
import { FormComponent } from '../form/form.component';

describe('Concept Utils', () => {

  it('should give true if config has isTabular property is true', function () {
    const testConfig = {
      config: { isTabular : true },
    };

    expect(ConceptUtils.isTabular(testConfig)).toBeTruthy();
  });

  it('should give false if config has isTabular property is set as false', function () {
    const testConfig = {
      config: { isTabular : false },
    };

    expect(ConceptUtils.isTabular(testConfig)).toBeFalsy();
  });

  it('should give false if config has no property of isTabular', function () {
    const testConfig = {
      config: { isAddMore : false },
    };

    expect(ConceptUtils.isTabular(testConfig)).toBeFalsy();
  });

  it('should return undefined merged concept', function () {
    const member = {name: 'test member', set: true, setMembers: [{class: 'Abnormal'}]};

    expect(ConceptUtils.getMergedAbnormalConcept(member)).toBeUndefined();
  });

  it('should return merged concept with isAbnormal set to true', function () {
    const member = {name: 'test member', set: true, setMembers: [{class: 'Misc'}]};

    expect(ConceptUtils.getMergedAbnormalConcept(member).isAbnormal).toBeTruthy();
  });

  it('should set abnormal to true when member contains abnormal concepts', function () {
    const member = {name: 'test member', set: true, setMembers: [{class: 'Abnormal'}]};

    expect(ConceptUtils.isAbnormal(member)).toBeTruthy();
  });

  it('should set abnormal remains false when member contains no abnormal concepts', function () {
    const member = {name: 'test member', set: true, setMembers: []};

    expect(ConceptUtils.isAbnormal(member)).toBeFalsy();
  });

  it('should return true if concept name is in form conditions map', function () {
    FormComponent.formConditionsConcepts = new Set<String>();
    FormComponent.formConditionsConcepts.add('concept Name');

    expect(ConceptUtils.isInFormConditions('concept Name')).toBeTruthy();
  });

  it('should return false if concept name is not in form conditions map', function () {
    FormComponent.formConditionsConcepts = new Set<String>();

    expect(ConceptUtils.isInFormConditions('concept Name')).toBeFalsy();
  });
});
