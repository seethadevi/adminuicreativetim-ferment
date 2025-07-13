import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as appActions from '../action/app-actions';
import { Session } from './../shared/structures/session';
import { AppService } from '../shared/services/app.service';
import { AppToastrService } from '../shared/services/app-toastr.service';
import * as appConstant from 'src/app/shared/structures/app-constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  images = ['./assets/img/wine5.jpg', './assets/img/wine8.jpg', './assets/img/wine7.jpg'].map((n) => n);
  @ViewChild('f', {static: false}) loginForm: NgForm;
  loginSubscription: any;
  user = { email: '', pwd: '' };
  validUser = false;
  status = '';
  error = '';
  loginProgress: Observable<boolean>;
  errorDetails: Observable<any>;
  userName: Observable<string>;
  currentDate: Date = new Date();

  private toggleButton: any;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  constructor(private store: Store<any>, private router: Router, private appservice: AppService,
    private appToastrService: AppToastrService, private appService: AppService,
    private element: ElementRef) {
      this.nativeElement = element.nativeElement;
      this.sidebarVisible = false;

    this.loginProgress = store.pipe(select((s) => s.appMainStore.loggedInUser.isLoginProgress));
    this.errorDetails = store.pipe(select((s) => s.appMainStore.loggedInUser.error));
    this.userName = store.pipe(select((s) => s.appMainStore.loggedInUser.name));
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    // body.classList.add('off-canvas-sidebar');
    // const card = document.getElementsByClassName('card')[0];
    // setTimeout(function() {
    //     // after 1000 ms we add the class animated to the login/register card
    //     card.classList.remove('card-hidden');
    // }, 700);


    Session.removeAllSessionValue();
    this.loginSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.validUser = s.appMainStore.loggedInUser.isValidUser;
        this.status = s.appMainStore.loggedInUser.status;
        this.error = s.appMainStore.loggedInUser.error;
        if (this.validUser && this.status === appConstant.SUCCESS) {
          this.appservice.userLoginSession(s.appMainStore.loggedInUser.userId);
          Session.saveSession(s.appMainStore.loggedInUser);
          this.appToastrService.showSuccess('Logged in Sucessfully');
          if (s.appMainStore.loggedInUser.role === 'ROOT_ADMIN' || s.appMainStore.loggedInUser.role === 'SUPER_ADMIN'
          || s.appMainStore.loggedInUser.role === 'ADMIN') {
            // this.router.navigate(['/choosesubscription']);
            this.appservice.gotoURL('/choosesubscription');
          } else if (s.appMainStore.loggedInUser.role === 'SUBSCRIPTION') {
            Session.saveSubscription({
              id: s.appMainStore.loggedInUser.userId, name: s.appMainStore.loggedInUser.name,
              picture: s.appMainStore.subPicture,
              plan: s.appMainStore.subPlan,
            });
            this.appservice.gotoURL('/subscriptionhome');
          }
        } else if (!this.validUser && this.status === appConstant.FAILED) {
          this.appToastrService.showError(this.error);
          this.validUser = false;
        }
      });
  }

  ngOnDestroy() {
    if (!!this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (!!this.loginForm.value.inputEmail && !!this.loginForm.value.inputPass) {
      const user = { email: this.loginForm.value.inputEmail, password: this.loginForm.value.inputPass, mobile: '' };
      this.store.dispatch({ type: appActions.USER_LOGIN, payload: user });
      this.store.dispatch({ type: appActions.GET_COUNTRY_LIST, payload: {} });
      this.store.dispatch({type: appActions.GET_EVENT_COUNTRY_LIST, payload: {} });
    }
  }

  onForgotPassword() {
    this.appService.gotoURL('/forgotPassword');
  }

  onClearValue() {
    this.loginForm.reset();
  }

  onRegister() {}
}
