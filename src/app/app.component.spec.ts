import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { UserService } from './user.service';
import { instance, mock, verify, when } from 'ts-mockito';
import { Observable, of } from 'rxjs';
import { FormListComponent } from './form-list/form-list.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '../../node_modules/@angular/common/http/testing';
import { ConceptSetComponent } from './concept-set/concept-set.component';
import { ConceptComponent } from './concept/concept.component';
import { TextBoxComponent } from './elements/text-box/text-box.component';
import { TabularViewComponent } from './tabular-view/tabular-view.component';
import { CheckBoxComponent } from './elements/check-box/check-box.component';
import { CodeSheetComponent } from './code-sheet/code-sheet.component';
import { CodeConceptComponent } from './code-sheet/code-concept/code-concept.component';
import { CodeConceptSetComponent } from './code-sheet/code-concept-set/code-concept-set.component';
import { ConditionalConceptComponent } from './conditional-concept/conditional-concept.component';
import { ConceptConditionComponent } from './concept-condition/concept-condition.component';

describe('AppComponent', () => {
  const UserServiceMock: UserService = mock(UserService);
  const userServiceMock: UserService = instance(UserServiceMock);
  let fixture: any;
  let app: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        ErrorMessageComponent,
        FormListComponent,
        ConceptSetComponent,
        ConceptComponent,
        ConditionalConceptComponent,
        ConceptConditionComponent,
        TextBoxComponent,
        TabularViewComponent,
        CheckBoxComponent,
        CodeSheetComponent,
        CodeConceptComponent,
        CodeConceptSetComponent,
        FilterPipe
      ],
      providers: [{provide: UserService, useValue: userServiceMock}]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  }));

  it('should call getUserPrivileges on app initialization', async(() => {
    when(UserServiceMock.getUserPrivileges()).thenReturn(mock(Observable));

    app.ngOnInit();

    verify(UserServiceMock.getUserPrivileges()).called();
  }));

  it('should set hasPrivilege to true when there is app:print-forms privilege', async(() => {
    const testResponse = of([{name: 'app:print-forms'}, {name: 'app:clinical'}]);
    when(UserServiceMock.getUserPrivileges()).thenReturn(testResponse);

    app.ngOnInit();

    expect(app.hasPrivilege).toBeTruthy();
  }));

  it('should set hasPrivilege to false when there is no app:print-forms privilege', async(() => {
    const testResponse = of([{name: 'app:clinical'}]);
    when(UserServiceMock.getUserPrivileges()).thenReturn(testResponse);

    app.ngOnInit();

    expect(app.hasPrivilege).toBeFalsy();
  }));

  it('should not set hasPrivilege when privileges list is empty', async(() => {
    when(UserServiceMock.getUserPrivileges()).thenReturn(mock(Observable));

    app.ngOnInit();

    expect(app.hasPrivilege).toBeUndefined();
  }));

  it('should render app-header component', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-header')).not.toBe(null);
  }));

  it('should render router-outlet when hasPrivilege is true', async(() => {
    app.hasPrivilege = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('router-outlet')).not.toBe(null);
  }));

  it('should render error-component when hasPrivilege is false', async(() => {
    app.hasPrivilege = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('router-outlet')).toBe(null);
    expect(compiled.querySelector('app-error-message')).not.toBe(null);
  }));

  it('should render form-list component', async(() => {
    app.hasPrivilege = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-form-list')).not.toBe(null);
  }));
});
