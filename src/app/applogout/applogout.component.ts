import { Component, OnInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { AppToastrService } from '../shared/services/app-toastr.service';

@Component({
  selector: 'app-applogout',
  templateUrl: './applogout.component.html',
  styleUrls: ['./applogout.component.scss']
})
export class ApplogoutComponent implements OnInit {

  constructor(private appService: AppService, private appToastrService: AppToastrService) { }

  ngOnInit() {
    this.onLogout();
  }

  onLogout() {
    const token = sessionStorage.getItem('auth');
    const userdata = JSON.parse(sessionStorage.getItem(token));
    this.appService.serverLogout(userdata['userId'])
    .subscribe(
    (response: any) => {
      if (response.status === 'success') {
        this.appToastrService.showSuccess(response.msg);
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.appService.webappLogout();
    },
    error => {
      console.log(error);
      this.appService.webappLogout();
      this.appToastrService.showError( error.msg || 'Logout failed.');
    });
}
}
