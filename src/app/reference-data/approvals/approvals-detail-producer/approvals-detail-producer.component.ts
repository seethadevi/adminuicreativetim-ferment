import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { Urls } from 'src/app/shared/structures/urls';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ProducersubService } from 'src/app/producersub/producersub.service';
import { Store } from '@ngrx/store';
import * as appAction from 'src/app/action/app-actions';
import { ApprovalsService } from '../approvals.service';
import swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-approvals-detail-producer',
  templateUrl: './approvals-detail-producer.component.html',
  styleUrls: ['./approvals-detail-producer.component.scss']
})
export class ApprovalsDetailProducerComponent implements OnInit {

  wineryModel: any;
  isEdit = true;
  title = 'New';
  wineryId: '';
  imgUploadUrl = '';
  thumbnailurlLogo = '';
  countryList: any[];
  regionList: any[];
  constructor(private route: ActivatedRoute, public appservice: AppService, private router: Router, private store: Store<any>,
    private appToastrService: AppToastrService, private approvalsService: ApprovalsService ) {
  }

  ngOnInit(): void {
    this.wineryModel = {
      name: '',
      seo_name: '',
      description: '',
      images: [],
      videos: [],
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      pri_email: '',
      pri_contact_name: '',
      sec_contact_name: '',
      sec_email1: '',
      sec_email2: '',
      sec_email3: '',
      pri_phone: '',
      sec_phone1: '',
      sec_phone2: '',
      sec_phone3: '',
      region: '',
      picture: '',
      type: 'PRODUCER',
      producer_id: ''
    };
    if (this.route.snapshot.params['id']) {
      this.wineryId = this.route.snapshot.params['id'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.getApprovalWineryDetail();
    }
  }

  getApprovalWineryDetail() {
    this.approvalsService.getApprovalItem({id: this.wineryId})
    .subscribe(
    (response: any) => {
        if (response.status === 'success') {
          $('#printData').find('img').attr('style', 'margin:auto');
          this.wineryModel = response.msg;
          if ( response.msg.producer_id !== undefined && !!response.msg.producer_id && response.msg.producer_id !== '') {
            this.title = 'Update';
           }
          this.thumbnailurlLogo = !!response.msg.picture ? response.msg.picture['md'] : '';
          // this.loadCountryData(response.msg.address.country);
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Winery detail failed to get.Please try agian later.');
    });
  }

  actionApproval() {
    let selectedRowData;
    if ( this.wineryModel.producer_id !== undefined && !!this.wineryModel.producer_id && this.wineryModel.producer_id !== '') {
      selectedRowData = Object.assign({}, this.wineryModel , {status: 'APPROVED',  'id': this.wineryId, action: 'UPDATE'});
    } else {
      selectedRowData = Object.assign({}, this.wineryModel , {status: 'APPROVED',  'id': this.wineryId, action: 'ADD'});
    }
    this.updateStatus(selectedRowData);
  }

  actionReject() {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-info',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: 'Reason to Reject',
        html: '<div class="row">' +
                '<label class="col-md-3 col-form-label">Reason *</label>' +
                '<div class="col-md-9">' +
                  '<textarea id="reason-msg" type="text" row="5" class="form-control border-primary" placeholder="Reason to Reject" ></textarea>' +
                '</div>' +
              '</div>' ,
        showCancelButton: true,
        confirmButtonText: 'Send',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => swal.isLoading(),
        preConfirm: (() => {

          if ($.trim($('#reason-msg').val()) !== '') {
            let selectedRowData;
            if ( this.wineryModel.producer_id !== undefined && !!this.wineryModel.producer_id && this.wineryModel.producer_id !== '') {
              selectedRowData = Object.assign({}, this.wineryModel, {
                status: 'REJECTED', 'id': this.wineryId, action: 'UPDATE',
                comments: $.trim($('#reason-msg').val())});
            } else {
              selectedRowData = Object.assign({}, this.wineryModel, {
                status: 'REJECTED', 'id': this.wineryId, action: 'ADD',
                comments: $.trim($('#reason-msg').val())});
            }
            console.log(selectedRowData);
            // this.approvalsService.updateApprovalStatus(selectedRowData)
            // .subscribe(
            // (response: any) => {
            //   if (response.status === 'success') {
            //     this.appToastrService.showSuccess(response.msg);
            //     this.onClearValue();
            //   } else {
            //     if (!!response['errors']) {
            //       let errorHtml = '<ul>';
            //       Object.keys(response['errors']).map((item) => {
            //         errorHtml += '<li>' + response['errors'][item][0] + '</li>';
            //       });
            //       errorHtml += '</ul>';
            //       this.appToastrService.typeCustom(errorHtml);
            //     } else {
            //       this.appToastrService.showError(response.msg);
            //     }
            //   }
            // },
            //   error => {
            //   this.appToastrService.showError(error.msg || 'Approval detail failed to Update.Please try again later.');
            // });
          } else {
            swal.showValidationMessage('Please fill reason details');
          }
        })
    }).then((result) => {
      if (result.value) {

      // this.accessToken = '1b1a289e92a7f2ea3f60268a542931fb';
      // this.encoded_accessToken = this.encodeAccesstoken(this.accessToken);
      // this.updateSubscriptionAccessToken({
      //   api_key : postParam.api_key,
      //   access_token : this.accessToken
      // });
      } else if ( result.dismiss === swal.DismissReason.cancel) {

      } else {

      }
    }).catch();
  }



  updateStatus(postParam) {
    // console.log(postParam);
    this.approvalsService.updateApprovalStatus(postParam)
      .subscribe(
      (response: any) => {
         if (response.status === 'success') {
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
        this.appToastrService.showError(error.msg || 'Approval detail failed to Update.Please try again later.');
      });
  }

  onClearValue() {
  this.appservice.gotoURL('/reference/approvals');
  }


}
