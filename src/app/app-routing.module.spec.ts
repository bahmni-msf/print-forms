import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app-routing.module';
import { FormComponent } from './form/form.component';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '../../node_modules/@angular/common/http/testing';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { FormListComponent } from './form-list/form-list.component';
import { ConceptComponent } from './concept/concept.component';
import { ConceptSetComponent } from './concept-set/concept-set.component';
import { TextBoxComponent } from './elements/text-box/text-box.component';
import { TabularViewComponent } from './tabular-view/tabular-view.component';
import { CheckBoxComponent } from './elements/check-box/check-box.component';
import { CodeSheetComponent } from './code-sheet/code-sheet.component';
import { CodeConceptComponent } from './code-sheet/code-concept/code-concept.component';
import { CodeConceptSetComponent } from './code-sheet/code-concept-set/code-concept-set.component';
import { ConditionalConceptComponent } from './conditional-concept/conditional-concept.component';
import { ConceptConditionComponent } from './concept-condition/concept-condition.component';
import { FormElementsComponent } from './form-elements/form-elements.component';

describe('AppRoutingModule', () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent, FormComponent, HeaderComponent, FormListComponent, ErrorMessageComponent, FilterPipe,
        ConditionalConceptComponent, ConceptComponent, ConceptConditionComponent, ConceptSetComponent, TextBoxComponent,
        TabularViewComponent, CheckBoxComponent, CodeSheetComponent, CodeConceptComponent, CodeConceptSetComponent, FormElementsComponent
      ]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  it('should return relative path as "/", when no form is clicked', () => {
    router.navigate(['']).then(() => {
      expect(location.path()).toBe('/');
    });
  });

  it('should return relative path as "/PNC", when "PNC" form is clicked', () => {
    router.navigate(['PNC']).then(() => {
      expect(location.path()).toBe('/PNC');
    });
  });

  it('should return relative path as "/COPD,%20Intake", when "COPD, Intake" form is clicked', () => {
    router.navigate(['COPD, Intake']).then(() => {
      expect(location.path()).toBe('/COPD,%20Intake');
    });
  });

});
