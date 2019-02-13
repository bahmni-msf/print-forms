import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { Constants } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'print-forms';
  hasPrivilege: boolean;
  noPrivilegeError = Constants.NO_PRIVILEGE_ERROR;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUserPrivileges().subscribe((response: Array<{ name: String }>) => {
      this.setPrivilegeStatus(response);
    }, (error) => {
      if ( error.status === 401 && error.ok === false ) {
        window.location.pathname = Constants.BAHMNI_HOME_PAGE_PATH_NAME;
      }
    });
  }

  private setPrivilegeStatus(privileges: Array<{ name: String }>) {
    if (privileges) {
      for (const privilege of privileges) {
        if (privilege.name === Constants.PRINT_FORMS_PRIVILEGE) {
          this.hasPrivilege = true;
        }
      }
      if (!this.hasPrivilege) {
        this.hasPrivilege = false;
      }
    }
  }
}
