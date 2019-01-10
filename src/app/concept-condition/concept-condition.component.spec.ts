import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptConditionComponent } from './concept-condition.component';

describe('ConceptConditionComponent', () => {
  let component: ConceptConditionComponent;
  let fixture: ComponentFixture<ConceptConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
