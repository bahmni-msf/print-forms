import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxComponent } from './text-box.component';

describe('TextBoxComponent', () => {
  let component: TextBoxComponent;
  let fixture: ComponentFixture<TextBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBoxComponent);
    component = fixture.componentInstance;
    component.member = {};
    fixture.detectChanges();
  });

  it('should create Text-box component', () => {
    expect(component).toBeTruthy();
  });

  it('should have div & input elements when datatype is not Text', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div').getAttribute('class')).toEqual('text-answer');
    expect(compiled.querySelector('input')).not.toBeNull();
  });

  it('should have div & input elements when there is conciseText true config', () => {
    component.member = { datatype: 'Text', config: { conciseText: true}};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div').getAttribute('class')).toEqual('text-answer');
    expect(compiled.querySelector('input')).not.toBeNull();
    expect(compiled.querySelector('input').getAttribute('class')).toEqual('Text');
  });

  it('should have textarea element when there is no config for member', () => {
    component.member = { datatype: 'Text'};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div').getAttribute('class')).toEqual('text-answer');
    expect(compiled.querySelector('textarea')).not.toBeNull();
  });

  it('should have textarea element when there is config for member and conciseText is not true', () => {
    component.member = { datatype: 'Text', config: {}};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div').getAttribute('class')).toEqual('text-answer');
    expect(compiled.querySelector('textarea')).not.toBeNull();
  });


  it('should have button element when member is abnormal', () => {
    component.member = {isAbnormal: true, range: []};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('button')).not.toBeNull();
    expect(compiled.querySelectorAll('div')[1].getAttribute('class')).toEqual('abnormal');
  });

  it('should not have button when member is not abnormal', function () {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('button')).toBeNull();
  });

  it('should have both high and low range values', function () {
    component.member = {isAbnormal: true, range: [ 1, 2 ]};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('p').textContent).toEqual('(1-2)');
  });

  it('should have only low range value', function () {
    component.member = {isAbnormal: true, range: [ 2, undefined ]};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('p').textContent).toEqual('(> 2)');
  });

  it('should have only high range value', function () {
    component.member = {isAbnormal: true, range: [ undefined, 2 ]};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('p').textContent).toEqual('(< 2)');
  });

  it('should add use code hint to label when datatype is coded', function () {
    component.member = { name : 'test member', datatype: 'Coded'};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.getElementsByClassName('hint')[0].textContent).toContain('(Refer to Code Sheet)');
  });

  it('should not add use code hint to label when datatype is not coded', function () {
    component.member = { name : 'test member', datatype: 'Text'};
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.getElementsByClassName('hint').length).toBe(0);
  });
});
