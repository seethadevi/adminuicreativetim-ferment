import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Urls } from 'src/app/shared/structures/urls';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { AppService } from 'src/app/shared/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { EmailTemplatesubService } from '../email-templatesub.service';
import { NgForm } from '@angular/forms';
import { EmailEditorComponent } from 'src/app/shared/modules';
import * as appAction from 'src/app/action/app-actions';
import * as appConst from 'src/app/shared/structures/app-constant';

declare const $: any;
@Component({
  selector: 'app-email-templatesub-form',
  templateUrl: './email-templatesub-form.component.html',
  styleUrls: ['./email-templatesub-form.component.scss']
})
export class EmailTemplatesubFormComponent implements OnInit, OnDestroy {

  emailTemplateModel: any;
  isEdit = false;
  title = 'Add';
  emailtemplateId: '';
  options = {
  };
  emailSubscription: any;
  sub_id = '';
  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;

  constructor(private urls: Urls, private store: Store<any>, private emailTemplateService: EmailTemplatesubService,
      private appToastrService: AppToastrService, private appService: AppService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.emailTemplateModel = {
      name: '',
      content: {},
      html: {},
      sub_id: ''
    };
    this.emailSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.sub_id = s.appMainStore.subscriptionId;
    });

    // this.emailEditor.minHeight = '100';

    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.emailtemplateId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getEmailTemplatDetail();
    } else {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});

    }
  }

  ngOnDestroy() {
    if (!!this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
  }

  editorLoaded(event) {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
     console.log('email-editor-loaded');
  }

  // saveDesign = () => {
  //   const _this = this;
  //   this.emailEditor.saveDesign(design => {
  //     _this.emailTemplateModel.content = design;
  //     console.log('saveDesign', design);
  //   });
  // }

  exportHtml = () => {
    const _this = this;
    this.emailEditor.exportHtml(data => {
      const html = data;
      _this.emailTemplateModel.content = html['design'];
      delete html['design'];
      _this.emailTemplateModel.html = data;
      console.log('exportHtml', html);
      _this.onSubmitSaveAction();
    });
  }

  // exportHtml() {
  //   this.emailEditor.exportHtml((data) => console.log('exportHtml', data));
  // }

  getEmailTemplatDetail() {

    this.emailTemplateService.getHtmlTemplate({id: this.emailtemplateId})
    .subscribe(
    (response: any) => {
      if (response.status === appConst.SUCCESS) {
        // Always update the std_form_compoenet from the JSON
        this.emailTemplateModel = response.msg;
        this.emailEditor.loadDesign(this.emailTemplateModel.content);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      } else {
        this.appToastrService.showError(response.msg);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Html Template form detail failed to get.Please try agian later.');
    });

  }

  onSubmit(f: NgForm) {
    this.exportHtml();
    // this.saveDesign();
  }

  onSubmitSaveAction() {
    console.log(this.emailTemplateModel);
    if (!!this.emailTemplateModel.name &&
      (!!this.emailTemplateModel.content && !this.appService.isEmptyObject(this.emailTemplateModel.content))
      && (!!this.emailTemplateModel.html && !this.appService.isEmptyObject(this.emailTemplateModel.html))) {
      this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: true } });
      if (!this.isEdit) {
        this.emailTemplateModel = Object.assign({}, this.emailTemplateModel, {  sub_id: this.sub_id});
        this.saveEmailTemplate();
      } else {
        const newModel = Object.assign({}, this.emailTemplateModel, { 'id': this.emailtemplateId });
        this.updateEmailTemplate(newModel);
        }
    }
  }

  saveEmailTemplate() {
    this.emailTemplateService.saveHtmlTemplate(this.emailTemplateModel)
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === appConst.SUCCESS) {
        this.appToastrService.showSuccess(response.msg);
        this.onClearValue();
      } else {
        if (!!response['errors']) {
          let errorHtml = '<ul>';
          Object.keys(response['errors']).map((item) => {
            errorHtml += '<li>' + response['errors'][item][0] + '</li>';
          });
          errorHtml += '</ul>';
          this.appToastrService.typeCustom(errorHtml);
        } else {
          this.appToastrService.showError(response.msg);
        }
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Dynamic form detail failed to save.Please try again later.');
    });
  }

  updateEmailTemplate(updateHtmlTemplateValue) {
    this.emailTemplateService.updateHtmlTemplate(updateHtmlTemplateValue)
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          this.onClearValue();
        } else {
          if (!!response['errors']) {
            let errorHtml = '<ul>';
            Object.keys(response['errors']).map((item) => {
              errorHtml += '<li>' + response['errors'][item][0] + '</li>';
            });
            errorHtml += '</ul>';
            this.appToastrService.typeCustom(errorHtml);
          } else {
            this.appToastrService.showError(response.msg);
          }
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Dynamic form detail failed to update.Please try agian later.');
      });
    }

  onClearValue() {
    this.appService.gotoURL('/subscriptionhome/appemailtemplatesub');
  }

}
