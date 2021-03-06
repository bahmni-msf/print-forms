import { Component, OnInit } from '@angular/core';
import { ConceptsService } from '../concepts.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})

export class FormListComponent implements OnInit {
  formNames: Array<String>;
  searchKeyWord: String;

  constructor(private conceptService: ConceptsService) {
  }

  ngOnInit() {
    this.getAllObservationTemplates();
  }

  private getAllObservationTemplates() {
    this.conceptService.getAllObservationTemplates().subscribe((response: { results: any }) => {
      if (response.results[0]) {
        this.formNames = response.results[0].setMembers.map((form) => form.display);
      }
    });
  }
}
