import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { FormListComponent } from './form-list/form-list.component';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';
import { FormComponent } from './form/form.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorMessageComponent,
    FormListComponent,
    ConceptComponent,
    ConceptSetComponent,
    FilterPipe,
    FormComponent,
    TextBoxComponent,
    TabularViewComponent,
    CheckBoxComponent,
    CodeSheetComponent,
    CodeConceptComponent,
    CodeConceptSetComponent,
    ConditionalConceptComponent,
    ConceptConditionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
