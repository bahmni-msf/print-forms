import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConceptUtils } from '../utils/concept.utils';

@Component({
  selector: 'app-tabular-view',
  templateUrl: './tabular-view.component.html',
  styleUrls: ['./tabular-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabularViewComponent {

  @Input() member: any;
  @Input() formConcepts: any;
  constructor() {}

  isTabular(member) {
    return  ConceptUtils.isTabular(member);
  }

  isElementRendered() {
    return ConceptUtils.isElementRendered(this.member);
  }
}
