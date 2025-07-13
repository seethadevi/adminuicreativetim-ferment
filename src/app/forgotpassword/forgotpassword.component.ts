import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AppService } from '../shared/services/app.service';
import { NgForm } from '@angular/forms';
import { ForgotpasswordService } from './forgotpassword.service';
import { Store } from '@ngrx/store';
import * as appConst from 'src/app/shared/structures/app-constant';
import { AppToastrService } from '../shared/services/app-toastr.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit, AfterViewInit {

  @ViewChild('f', {static: false}) loginForm: NgForm;
  pageLoading = false;
  forgotModel: any;
  emailSuccess = false;
  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  constructor(private appService: AppService, private forgotpasswordService: ForgotpasswordService,
    private store: Store<any>, private appToastrService: AppToastrService, private element: ElementRef) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.forgotModel = {
      email : ''
    };
  }

  ngAfterViewInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('forgot-page');
    const card = document.getElementsByClassName('card')[0];
    setTimeout(function() {
        card.classList.remove('card-hidden');
    }, 700);
  }

  onSubmit(f: NgForm) {
    if (!!this.forgotModel.email) {
      this.pageLoading = true;
      this.forgotpasswordService.callForgotPassword({ email : this.forgotModel.email })
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.emailSuccess = true;
        } else {
          this.emailSuccess = false;
        }
        this.pageLoading = false;
      },
      error => {
        this.pageLoading = false;
        this.emailSuccess = false;
        this.appToastrService.showError(error.msg || 'Server down, Please try again later.');
      });
    }

  }

  onLogin () {
    this.appService.gotoURL('/login');
  }

  onClearValue() {
    this.loginForm.reset();
  }

}
