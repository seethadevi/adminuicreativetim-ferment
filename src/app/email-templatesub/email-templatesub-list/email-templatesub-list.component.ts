import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/shared/services/app.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { EmailTemplatesubService } from '../email-templatesub.service';

@Component({
  selector: 'app-email-templatesub-list',
  templateUrl: './email-templatesub-list.component.html',
  styleUrls: ['./email-templatesub-list.component.scss']
})
export class EmailTemplatesubListComponent implements OnInit, OnDestroy {
  emailSubscription: any;
  sub_id = '';
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

  constructor(private store: Store<any>, private appService: AppService, private emailTemplateService: EmailTemplatesubService,
    private appToastrService: AppToastrService) { }



  ngOnInit(): void {
    this.emailSubscription = this.store.select<any>((state: any) => state)
      .subscribe((s: any) => {
        this.sub_id = s.appMainStore.subscriptionId;
      });
      this.headers = [
        { key: 'name', cansort: true, label: 'Name'},
      ];
      this.actions = { edit: true, delete: false };
      this.reloadGrid(this.defaultParams);

  }

  ngOnDestroy() {
    if (!!this.emailSubscription) {
      this.emailSubscription.unsubscribe();
    }
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

    this.emailTemplateService.getHtmlTemplatesWithPageData(curparams, this.sub_id)
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
      this.appService.gotoURL('/subscriptionhome/appemailtemplatesub/update/' + event.item.id);
    } else if (event.action === 'delete') {
    }
  }

  createnew() {
    this.appService.gotoURL('/subscriptionhome/appemailtemplatesub/new');
  }



}
