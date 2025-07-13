import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocationService } from '../../location/location.service';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { EmailTemplateService } from '../email-template.service';

@Component({
  selector: 'app-email-template-list',
  templateUrl: './email-template-list.component.html',
  styleUrls: ['./email-template-list.component.scss']
})
export class EmailTemplateListComponent implements OnInit {
  emailSubscription: any;
  emailTemplateList: any[];
  defaultParams = {
    page: 1,
    limit: 25,
    sortkey: '',
    sortorderstring: 'desc',
    searchvalue: '',
    searchelems: ['name', 'content', 'html']
  };
  gridstate: any;
  totalRecords: number;
  headers: any;
  actions: any;

  constructor(private store: Store<any>, private appService: AppService, private emailTemplateService: EmailTemplateService,
    private appToastrService: AppToastrService) { }



  ngOnInit(): void {
      this.headers = [
        { key: 'name', cansort: true, label: 'Name'},
      ];
      this.actions = { edit: true, delete: false };
      this.reloadGrid(this.defaultParams);

  }

  onReloadEvent(event) {
    // console.log(event);
    this.reloadGrid(event.params);
  }

  reloadGridState() {
    this.reloadGrid(this.gridstate);
  }
  reloadGrid(curparams) {
    this.gridstate = curparams;

    this.emailTemplateService.getHtmlTemplatesWithPageData(curparams)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.emailTemplateList = response.res.docs;
            this.totalRecords = response.res.total;
          } else {
            this.appToastrService.showError(response.msg);
          }
        },
        error => {
          // console.log(error);
          this.appToastrService.showError( error.msg || 'Email Template detail failed to get.');
        });
  }

  onOperation(event) {
    if (event.action === 'edit') {
      this.appService.gotoURL('/reference/appemailtemplate/update/' + event.item.id);
    } else if (event.action === 'delete') {
    }
  }

  createnew() {
    this.appService.gotoURL('/reference/appemailtemplate/new');
  }




}
