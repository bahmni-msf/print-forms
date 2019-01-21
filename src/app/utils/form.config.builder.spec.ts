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
          units: 'KG',
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
      units: undefined,
      datatype: 'N/A',
      setMembers: [{
        name: 'Heart Rate',
        set: true,
        units: undefined,
        datatype: 'N/A',
        setMembers: [{name: 'Weight', set: false, datatype: 'date', config: undefined,
          units: 'KG',
          answers: [], class: 'Misc',  range: [72, 72],
          fullySpecifiedName: 'Weight'}],
        answers: [],
        class: 'Misc',
        config: {allowAddMore: true},
        range: [undefined, undefined],
        fullySpecifiedName: 'Heart Rate'
      }], config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined],
      fullySpecifiedName: 'Vitals'
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
      units: undefined,
      datatype: 'N/A',
      config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined],
      fullySpecifiedName: 'Vitals'
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });

  it('should build configuration, given form with no answers', function () {
    const formDetails = {
      name: {display: 'Vitals', name: 'Vitals'},
      units: null,
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
      units: null,
      set: true,
      datatype: 'N/A',
      config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined],
      fullySpecifiedName: 'Vitals'
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
      units: undefined,
      set: true,
      datatype: 'Coded',
      config: {showPanelView: false},
      answers: ['Abdominal pain', 'Abdominal Lump', 'Anorexia'],
      class: 'Misc',
      range: [undefined, undefined],
      fullySpecifiedName: 'Vitals'
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });


  it('should build configuration, given with short name', function () {
    const formDetails = {
      name: {display: 'Vitals', name: 'Vitals'},
      names: [{conceptNameType: 'FULLY SPECIFIED NAME', display: 'LL, vitals'} , {conceptNameType: 'SHORT', display: 'vitals'}],
      set: true,
      datatype: {display: 'Coded'},
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
      name: 'vitals',
      units: undefined,
      set: true,
      datatype: 'Coded',
      config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined],
      fullySpecifiedName: 'Vitals'
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });

  it('should build configuration, with given units', function () {
    const formDetails = {
      name: {display: 'Vitals', name: 'Vitals'},
      units: 'mm',
      set: true,
      datatype: {display: 'Coded'},
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
      units: 'mm',
      set: true,
      datatype: 'Coded',
      config: {showPanelView: false},
      answers: [],
      class: 'Misc',
      range: [undefined, undefined],
      fullySpecifiedName: 'Vitals'
    };

    const actualConfig = FormConfigBuilder.build(formDetails, appConfig);

    expect(actualConfig).toEqual(expectedConfig);
  });
});
