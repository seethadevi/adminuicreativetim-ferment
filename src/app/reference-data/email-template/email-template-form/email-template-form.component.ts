import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Urls } from 'src/app/shared/structures/urls';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { AppService } from 'src/app/shared/services/app.service';
import { ActivatedRoute } from '@angular/router';
import { EmailTemplateService } from '../email-template.service';
import { NgForm } from '@angular/forms';
import { EmailEditorComponent } from 'src/app/shared/modules';
import * as appAction from 'src/app/action/app-actions';
import * as appConst from 'src/app/shared/structures/app-constant';

declare const $: any;
@Component({
  selector: 'app-email-template-form',
  templateUrl: './email-template-form.component.html',
  styleUrls: ['./email-template-form.component.scss']
})
export class EmailTemplateFormComponent implements OnInit {

  emailTemplateModel: any;
  isEdit = false;
  title = 'Add';
  emailtemplateId: '';
  options = {
  };

  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;

  constructor(private urls: Urls, private store: Store<any>, private emailTemplateService: EmailTemplateService,
      private appToastrService: AppToastrService, private appService: AppService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.emailTemplateModel = {
      name: '',
      content: {},
      html: {},
    };

    // // this.emailEditor.minHeight = '100';
    // const _this = this;
    //   // we simulate the window Resize so the charts will get updated in realtime.
    // const simulateTimerCheck = setInterval(function () {// Get a handle to the iframe element
    //   const iframe = $('iframe');
    //   if ($('iframe').length === 1) {
    //     if ($('#editor').length === 1) {
    //         // The loading is complete, call the function we want executed once the iframe is loaded
    //       _this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: false } });
    //       clearInterval(simulateTimerCheck);
    //     }
    //   }
    // }, 500);

      // // we stop the timer check after 5 sec
      // setTimeout(function() {
      //     clearInterval(simulateTimerCheck);
      // }, 5000);

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

  editorLoaded(event) {
    //  console.log('email-editor-loaded');
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
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
      // console.log('exportHtml', html);
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
        this.emailEditor.loadDesign(response.msg.content);
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
    // console.log(this.emailTemplateModel);
    if (!!this.emailTemplateModel.name &&
      (!!this.emailTemplateModel.content && !this.appService.isEmptyObject(this.emailTemplateModel.content))
      && (!!this.emailTemplateModel.html && !this.appService.isEmptyObject(this.emailTemplateModel.html))) {
      this.store.dispatch({ type: appAction.SHOWHIDE_APP_LOADING, payload: { flag: true } });
      if (!this.isEdit) {
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
    this.appService.gotoURL('/reference/appemailtemplate');
  }

}
