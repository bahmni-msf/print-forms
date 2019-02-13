import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBoxComponent } from './check-box.component';

describe('CheckBoxComponent', () => {
  let component: CheckBoxComponent;
  let fixture: ComponentFixture<CheckBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create CheckBox component', () => {
    expect(component).toBeTruthy();
  });

  it('should display basic check box elements', function () {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div').getAttribute('class')).toEqual('checkbox-container');
    expect(compiled.querySelectorAll('button').length).toEqual(2);
    expect(compiled.querySelectorAll('p').length).toEqual(2);
    expect(compiled.querySelectorAll('p')[0].textContent).toEqual('Yes');
    expect(compiled.querySelectorAll('p')[1].textContent).toEqual('No');
  });

});
