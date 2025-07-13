import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { ForgotpasswordService } from '../forgotpassword.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { NgForm } from '@angular/forms';
import * as appConst from 'src/app/shared/structures/app-constant';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  typeofuser = '';
  userId = '';
  tokenParam = '';
  invalidUser = false;
  cpwModel: any;
  pageLoading = false;
  cpwSuccess = false;
  constructor(private route: ActivatedRoute, private appService: AppService,
    private forgotpasswordService: ForgotpasswordService, private appToastrService: AppToastrService) { }

  ngOnInit() {
    if (this.route.snapshot.params['typeofuser']) {
      this.typeofuser = this.route.snapshot.params['typeofuser'];
    }

    if (this.route.snapshot.params['id']) {
      this.userId = this.route.snapshot.params['id'];
    }

    this.route.queryParams.subscribe(params => {
      this.tokenParam = params['token'];
    });

    if (this.typeofuser === '' || this.userId === '' || this.tokenParam === '') {
      this.invalidUser = true;
    }

    this.cpwModel = {
      password: '',
      confimrpassword: ''
    };
  }

  onSubmit(f: NgForm) {
    if (!!this.cpwModel.password && !!this.cpwModel.confirmpassword && this.cpwModel.password === this.cpwModel.confirmpassword) {
      this.pageLoading = true;
      this.forgotpasswordService.callChangePassword({
        token: this.tokenParam,
        password: this.cpwModel.password,
        type: this.typeofuser,
        id: this.userId,
        channel: 'WEB'
      },
        this.typeofuser , this.userId)
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.cpwSuccess = true;
        } else {
          this.cpwSuccess = false;
        }
        this.pageLoading = false;
      },
      error => {
        this.pageLoading = false;
        this.cpwSuccess = false;
        this.appToastrService.showError(error.msg || 'Server down, Please try again later.');
      });
    }
  }

  onClearValue() {
    this.cpwModel = {
      password: '',
      confimrpassword: ''
    };
  }

  onLogin() {
    this.appService.gotoURL('/login');
  }

}
