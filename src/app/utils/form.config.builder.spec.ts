import { FormConfigBuilder } from './form.config.builder';

describe('Form Config Builder', () => {

  it('should build configuration, given form with 2 levels of set members', function () {
    const formDetails = {
      name: {display: 'Vitals', name: 'Vitals'},
      set: true,
      datatype: {display: 'N/A'},
      setMembers: [{
        name: {display: 'Heart Rate', name: 'Heart Rate'},
        set: true,
        datatype: {display: 'N/A'},
        setMembers: [{
          name: {display: 'Weight'},
          uuid: 'fhjfhgff67687',
          set: false,
          datatype: {display: 'date'},
          setMembers: [],
          answers: [],
          conceptClass: { name: 'Misc'},
          hiNormal: 72,
          lowNormal: 72
        }],
        answers: [],
        conceptClass: { name: 'Misc'}
      }],
      answers: [],
      conceptClass: { name: 'Misc'}
    };
    const appConfig = {
      'Vitals': {
        'showPanelView': false
      },
      'Heart Rate': {
        'allowAddMore': true
      }
    };
    const expectedConfig = {
      name: 'Vitals',
      set: true,
      datatype: 'N/A',
      setMembers: [{
        name: 'Heart Rate',
        set: true,
        datatype: 'N/A',
        setMembers: [{name: 'Weight', set: false, datatype: 'date', config: undefined,
          answers: [], class: 'Misc',  range: [72, 72]}],
        answers: [],
        class: 'Misc',
        config: {allowAddMore: true},
        range: [undefined, undefined]
      }], config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined]
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });

  it('should build configuration, given form with no set members', function () {
    const formDetails = {
      name: {display: 'Vitals', name: 'Vitals'},
      set: true,
      datatype: {display: 'N/A'},
      setMembers: [],
      answers: [],
      conceptClass: { name: 'Misc'}
    };

    const appConfig = {
      'Vitals': {
        'showPanelView': false
      }
    };

    const expectedConfig = {
      name: 'Vitals',
      set: true,
      datatype: 'N/A',
      config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined]
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });

  it('should build configuration, given form with no answers', function () {
    const formDetails = {
      name: {display: 'Vitals', name: 'Vitals'},
      set: true,
      datatype: {display: 'N/A'},
      setMembers: [],
      answers: [],
      conceptClass: { name: 'Misc'}
    };

    const appConfig = {
      'Vitals': {
        'showPanelView': false
      }
    };

    const expectedConfig = {
      name: 'Vitals',
      set: true,
      datatype: 'N/A',
      config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined]
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });

  it('should build configuration, given form with answers', function () {
    const formDetails = {
      name: {display: 'Vitals', name: 'Vitals'},
      set: true,
      datatype: {display: 'Coded'},
      setMembers: [],
      answers: [{name : {display: 'Abdominal pain'}}, {name : {display: 'Abdominal Lump'}}, {name : {display: 'Anorexia'}}],
      conceptClass: { name: 'Misc'}
    };

    const appConfig = {
      'Vitals': {
        'showPanelView': false
      }
    };

    const expectedConfig = {
      name: 'Vitals',
      set: true,
      datatype: 'Coded',
      config: {showPanelView: false},
      answers: ['Abdominal pain', 'Abdominal Lump', 'Anorexia'],
      class: 'Misc',
      range: [undefined, undefined]
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });
});
