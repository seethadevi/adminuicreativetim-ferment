import { Component, OnInit, OnDestroy } from '@angular/core';
import { Urls } from '../../shared/structures/urls';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/shared/services/app.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as appConst from 'src/app/shared/structures/app-constant';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/category/category.service';
import { WarehouseproductService } from './warehouseproduct.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { VendorsubService } from 'src/app/vendorsub/vendorsub.service';
import * as appAction from 'src/app/action/app-actions';
import { TaxclassService } from 'src/app/reference-data/taxclass/taxclass.service';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ProductsubService } from 'src/app/productsub/productsub.service';
declare var $: any;
@Component({
  selector: 'app-warehouseproduct',
  templateUrl: './warehouseproduct.component.html',
  styleUrls: ['./warehouseproduct.component.scss']
})
export class WarehouseproductComponent implements OnInit, OnDestroy {
  selectCatgoryConst = 'Select Category';
  warehouseProdModel: any;
  products: any[];
  title = 'Add';
  isEdit = false;
  warehouseProdId = '';
  warehouseProdSubscription: any;
  allCategoryList: any[];
  allVendorList: any[];
  allTaxclassList: any[];
  closeResult: string;
  appConstValue: any;
  startDate: any;
  warehouseaddModel: any;
  warehouseremoveModel: any;
  displayProduct: string;
  addStockClick = false;
  removeStockClick = false;
  whShippingHistory: any[];
  centralStock = 0;
  isCentral = false;
  qrURLString = '';
  productList: any[];

  constructor(private urls: Urls, private productsubService: ProductsubService, private store: Store<any>,
    private warehouseproductService: WarehouseproductService, private categoryService: CategoryService,
    private appToastrService: AppToastrService, private appService: AppService, private vendorsubservice: VendorsubService,
    private route: ActivatedRoute, private modalService: NgbModal, private taxclassService: TaxclassService) { }

  ngOnInit() {
    this.appConstValue = appConst;
    this.warehouseaddModel = {
      quantity: '',
      skuprice: '',
      date: '',
      vendor_id: ''
    };
    this.productList = [];
    this.warehouseremoveModel = {
      quantity: '',
      reason: '',
      remarks: ''
    };
    this.allCategoryList = [
      {type: this.selectCatgoryConst}
    ];
    const d = new Date();
    this.startDate = { 'year': d.getFullYear(), 'month': d.getMonth() + 1, 'day': d.getDate() };
    this.warehouseProdModel = {
      name: '',
      description: '',
      gtin: '',
      sub_id: '',
      prod_id: '',
      images: [],
      videos: [],
      pricing: {
        price: '',
        vat: '',
        vat_unit: 'pt',
        price_w_vat: '',
        taxclass_id: ''
      },
      category_type: '',
      category_id: '',
      warehouse_id: '',
      vendor_id: {},
      stock_availability: 0,
      picture: '',
      logo: '',
      attr: {},
      ext_attr: {},
      producer: {},
      label: ''
    };
    this.centralStock = 0;
    this.products = [];
    this.warehouseProdSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.warehouseProdModel.sub_id = s.appMainStore.subscriptionId;
          this.warehouseProdModel.warehouse_id = s.appMainStore.warehouseId;
    });
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.getAllCategoryList();
    this.getAllVendorList();
    this.getAllTaxclassList();
    this.getReferenceProductList();
    this.displayProduct = '';
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.warehouseProdId = this.route.snapshot.params['id'];
      this.getWHProductIdDetail();
    } else {

    }
  }

  public beforeChange($event: NgbPanelChangeEvent) {
    if ($event.panelId === '1'  && $event.nextState !== false) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
       this.getWHShippingHistory();
    }
  }

  checkChangeVendor() {
    const vendor = this.allVendorList.find(s => s._id === this.warehouseaddModel.vendor_id);
    if (!!vendor && vendor.isCentral === 'TRUE') {
      this.getCentralwarehouseProduct();
      this.isCentral = true;
    } else {
      this.centralStock = 0;
      this.isCentral = false;
    }
  }

  getCentralwarehouseProduct() {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.warehouseproductService.getwarehouseProductCenter({id: this.warehouseProdModel.prod_id})
    .subscribe(
    (response: any) => {
      if (response.status === appConst.SUCCESS) {
        this.centralStock = response.msg.stock_availability;
      } else {
        this.centralStock = 0;
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.centralStock = 0;
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      // this.appToastrService.showError(error.msg || 'Cent product shipping history detail failed to get.Please try agian later.');
    });
  }

  ngOnDestroy() {
    if (!!this.warehouseProdSubscription) {
      this.warehouseProdSubscription.unsubscribe();
    }
  }

  setCategoryId(event) {
    if (!!event.target && !!event.target.value) {
      const idx = this.allCategoryList.findIndex(x => x['type'] === event.target.value);
      this.warehouseProdModel.category_id = this.allCategoryList[idx]['id'];
    }
  }

  getReferenceProductList() {
    const defaults = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: '',
      searchvalue: ''
    };
    this.productsubService.getProductsWithPageDataWithGlobal(defaults, this.warehouseProdModel.sub_id)
    .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.productList = response.res.docs;
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
          this.appToastrService.showError(error.msg || 'Failed to get the reference products.');
      });
  }

  selectProductRow(item) {
    this.onAddingProduct(item);
    this.products[0] = item;
    this.modalService.dismissAll('Close popup after select.');
  }

  getWHShippingHistory() {
    const defaults = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      search: '',
      sort: ''
    };
    this.warehouseproductService.getwarehouseProductsHistoryWithPageData(defaults, this.warehouseProdModel.sub_id, this.warehouseProdId)
    .subscribe(
    (response: any) => {
      if (response.status === appConst.SUCCESS) {
        this.whShippingHistory = response.res.docs;
        this.updateVendorName();
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Warehouse product shipping history detail failed to get.Please try agian later.');
    });
  }

  updateVendorName() {
    this.whShippingHistory = this.whShippingHistory.map((item) => {
      const vendor = this.allVendorList.find(s => s._id === item.vendor_id);
      let itemnew = {};
      if (!!vendor) {
        itemnew = Object.assign({}, item, {vendor_name : vendor.name});
      } else {
        itemnew = Object.assign({}, item, {vendor_name : '-'});
      }
      return itemnew;
    });
  }

  getWHProductIdDetail() {
    this.warehouseproductService.getwarehouseProduct({id: this.warehouseProdId})
    .subscribe(
    (response: any) => {
      if (response.status === appConst.SUCCESS) {
        this.warehouseProdModel = response.msg;
        if (!this.warehouseProdModel.category_id) {
          const idx = this.allCategoryList.findIndex(x => x['type'] === this.warehouseProdModel.category_type);
          this.warehouseProdModel.category_id = this.allCategoryList[idx]['id'];
        }
        this.getWineProdctdetails(response.msg.prod_id );
        // QR code logic
        let qrcode = environment.PRODUCTURL;
        if (response.msg.gtin) {
          qrcode += '/gtin/' + response.msg['gtin'];
        }
        qrcode += '?id=' + response.msg['prod_id'];
        this.qrURLString = qrcode;
        setTimeout(function() {
          $('#printData').find('img').attr('style', 'margin:auto'); },
          300);
      } else {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Warehouse product detail failed to get.Please try agian later.');
    });
  }

  getWineProdctdetails(id) {
    this.productsubService.getProduct({id: id})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.products.push(response.msg);
        this.warehouseProdModel.picture = response.msg.picture;
        this.warehouseProdModel.logo = response.msg.logo;
        this.warehouseProdModel.attr = response.msg.attr;
        this.warehouseProdModel.ext_attr = response.msg.ext_attr;
        this.warehouseProdModel.producer = response.msg.winery;
        this.warehouseProdModel.label = response.msg.label;
        this.displayProduct = response.msg['displayName'];
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Wine detail failed to get.Please try agian later.');
    });
  }

  Print (printSectionId) {
    let popupWinindow;
    const innerContents = document.getElementById(printSectionId).innerHTML;
    popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
    popupWinindow.document.open();
    let html = '<html><head><style>#printData img{margin:  auto;    padding-top: 20px;}';
    html += '.changetxt {display: none}';
    html +=  '#printData {text-align: center;    padding: 20px;}</style></head>';
    html += '<body onload="window.print()">' + innerContents + '</html>';
    popupWinindow.document.write(html);
    popupWinindow.document.close();
    return false;
  }

  getAllCategoryList() {
    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: ['type']
    };
    this.categoryService.getCategorysWithPageData(defaultParams)
      .subscribe(
      (response: any) => {
        // debugger;
        if (response.status === 'success') {
          this.allCategoryList = response.res.docs;
          this.allCategoryList.unshift({type: this.selectCatgoryConst });
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.appToastrService.showError(error.msg || 'Category detail failed to get.');
      });
  }

  getAllVendorList() {
    this.vendorsubservice.getSubscriptionVender({ sub_id : this.warehouseProdModel.sub_id })
      .subscribe(
      (response: any) => {
        // debugger;
        if (response.status === 'success') {
          this.allVendorList = response.msg;
        } else {
          this.appToastrService.showError(response.msg);
        }
        if (!this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
      },
      error => {
        // console.log(error);
        if (!this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
        this.appToastrService.showError(error.msg || 'Vendor detail failed to get.');
      });
  }

  getAllTaxclassList() {
    this.taxclassService.getSubscriptionTaxclass( { sub_id : this.warehouseProdModel.sub_id })
      .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.allTaxclassList = response.msg;
        } else {
          this.appToastrService.showError(response.msg);
        }
        if (!this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
      },
      error => {
        if (!this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
        this.appToastrService.showError(error.msg || 'Taxclass detail failed to get.');
      });
  }

  public requestAutocompleteItems = (text$: Observable<string>): Observable<any> => {
    return this.productsubService
       .getProductsWithPageDataWithGlobal(text$, this.warehouseProdModel.sub_id)
       .pipe(
         map(
           data => data
         )
       );
   }

   onAddingProduct(item: string) {
     const dataModel = {
       name : item['displayName'],
       description: item['description'],
       gtin: item['gtin'],
       stock_availability: 0,
       prod_id: item['id'],
       pricing: {
         price: '',
         vat: '',
         vat_unit: 'pt',
         price_w_vat: '',
         taxclass_id: ''
       },
       picture: item['picture'],
       logo: item['logo'],
       attr: item['attr'],
       ext_attr: item['ext_attr'],
       producer: item['winery'],
       label: item['label']
     };
     this.warehouseProdModel = Object.assign({}, this.warehouseProdModel, dataModel);
    //  console.log('New saved Value', this.warehouseProdModel);
   }

   onRemovingProduct(item: string) {
    this.products = [];
     const dataModel = {
       name : '',
       description: '',
       gtin: '',
       stock_availability: 0,
       prod_id : '',
       pricing: {
         price: '',
         vat: '',
         vat_unit: 'pt',
         price_w_vat: '',
         taxclass_id: ''
       },
       picture: '',
       logo: '',
       attr: {},
       ext_attr: {},
       producer: {},
       label: ''
     };
     this.warehouseProdModel = Object.assign({}, this.warehouseProdModel, dataModel);
    //  console.log('New saved Value', this.warehouseProdModel);
   }

   taxclassOnChange(event) {
     const val = event.target.value;
     const selectedTaxClass = this.allTaxclassList.find(s => s._id === val);
    //  console.log(selectedTaxClass);
     this.warehouseProdModel.pricing.vat = selectedTaxClass['tax_class_percent'];
     this.calculateTotalPrice(event);
   }

   calculateTotalPrice(event: any) {
    if (!isNaN(this.warehouseProdModel.pricing.price) && this.warehouseProdModel.pricing.price  !== ''
        && !isNaN(this.warehouseProdModel.pricing.vat)) {
      const price = !!this.warehouseProdModel.pricing.price ? this.warehouseProdModel.pricing.price : 0;
      const vat = !!this.warehouseProdModel.pricing.vat ? this.warehouseProdModel.pricing.vat : 0;
      this.warehouseProdModel.pricing.price_w_vat = (price + ((price * vat) / 100 )).toFixed(2);
    }
   }

   onSubmit(f: NgForm) {
    if (!!this.warehouseProdModel.name && !!this.warehouseProdModel.category_type && !!this.warehouseProdModel.prod_id
      && !!this.warehouseProdModel.pricing.price && !!this.warehouseProdModel.pricing.taxclass_id
      && !!this.warehouseProdModel.pricing.price_w_vat) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
        if (this.isEdit) {
          const newModel = Object.assign({}, this.warehouseProdModel, {'id': this.warehouseProdId});
          this.updateWarehouseproduct(newModel);
        } else {
          this.saveWarehouseproduct();
        }

      }
    // console.log('My saved value', this.warehouseProdModel);
   }

   saveWarehouseproduct() {
    this.warehouseproductService.saveWarehouseProduct(this.warehouseProdModel)
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
      this.appToastrService.showError(error.msg || 'Warehouse product detail failed to save.Please try again later.');
    });
   }

   updateWarehouseproduct(updateWSProduct) {
    this.warehouseproductService.updatewarehouseProduct(updateWSProduct)
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
      this.appToastrService.showError(error.msg || 'Warehouse product detail failed to update.Please try agian later.');
    });
   }

   gotoAddStock(id) {
     this.appService.gotoURL('subscriptionhome/warehouse/warehouseproduct/addstock/' + id);
   }
   gotoARemoveStock(id) {
     this.appService.gotoURL('subscriptionhome/warehouse/warehouseproduct/removestock/' + id);
   }

   onClearValue() {
    this.appService.gotoURL('subscriptionhome/warehouse/warehouseproductlist');
  }

  addStockToProduct() {
    // Write the call to add stock
    this.addStockClick = true;
    if (!!this.warehouseaddModel.quantity && this.warehouseaddModel.quantity > 0 &&
    !!this.warehouseaddModel.skuprice && !!this.warehouseaddModel.vendor_id) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.wsAddUpdateProduct();
    } else {
      if (this.warehouseaddModel.quantity === 0) {
        this.warehouseaddModel.quantity = '';
      }
    }
  }

  wsAddUpdateProduct() {
    if (this.isCentral) {
      this.warehouseproductService.centralappUpdateProductStock({productId: this.warehouseProdId,
        qty: this.warehouseaddModel.quantity, skuPricing: this.warehouseaddModel.skuprice.toString(),
        vendor_id: this.warehouseaddModel.vendor_id, orderDate: this.getFormatedDate(this.startDate),
      prod_id: this.warehouseProdModel.prod_id})
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.addStockClick = false;
        if (response.status === appConst.SUCCESS) {
          this.warehouseaddModel = {
            quantity: '',
            skuprice: '',
            date: '',
            vendor_id: '',
          };
          this.appToastrService.showSuccess(response.msg);
          this.getWHProductIdDetail();
          this.getWHShippingHistory();
          this.modalService.dismissAll('Close popup after Save.');
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        this.addStockClick = false;
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        // console.log(error);
        this.appToastrService.showError(error.msg || 'Product Stock failed to update.Please try agian later.');
      });
    } else {
      this.warehouseproductService.appUpdateProductStock({productId: this.warehouseProdId,
        qty: this.warehouseaddModel.quantity, skuPricing: this.warehouseaddModel.skuprice.toString(),
        vendor_id: this.warehouseaddModel.vendor_id, orderDate: this.getFormatedDate(this.startDate)})
      .subscribe(
      (response: any) => {
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        this.addStockClick = false;
        if (response.status === appConst.SUCCESS) {
          this.warehouseaddModel = {
            quantity: '',
            skuprice: '',
            date: '',
            vendor_id: '',
          };
          this.appToastrService.showSuccess(response.msg);
          this.getWHProductIdDetail();
          this.getWHShippingHistory();
          this.modalService.dismissAll('Close popup after Save.');
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        this.addStockClick = false;
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        // console.log(error);
        this.appToastrService.showError(error.msg || 'Product Stock failed to update.Please try agian later.');
      });
    }
  }

  getFormatedDate(dateValue) {
    return dateValue.year + '-' + dateValue.month + '-' + dateValue.day;
  }

  removeStockToProduct() {
    this.removeStockClick = true;
    if ( !!this.warehouseremoveModel.quantity && !!this.warehouseremoveModel.reason && !!this.warehouseremoveModel.remarks
      && this.warehouseProdModel.stock_availability >= this.warehouseremoveModel.quantity && this.warehouseremoveModel.quantity > 0) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.wsRemoveProduct();
    }
  }

  wsRemoveProduct() {
    this.warehouseproductService.deleteProductStock({qty: this.warehouseremoveModel.quantity,
      reasonForRemoval: this.warehouseremoveModel.reason,
      comments: this.warehouseremoveModel.remarks, productId: this.warehouseProdId})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.removeStockClick = false;
      if (response.status === appConst.SUCCESS) {
        this.warehouseremoveModel = {
          quantity: '',
          reason: '',
          remarks: ''
        };
        this.appToastrService.showSuccess(response.msg);
        this.getWHProductIdDetail();
        this.getWHShippingHistory();
        this.modalService.dismissAll('Close popup after Save.');
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.removeStockClick = false;
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Product Stock failed to delete.Please try agian later.');
    });
  }

  openTypeSelectionModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // console.log(this.closeResult);
    });
  }
  // openTypeSelectionModalSize(content, size) {
  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //     // console.log(this.closeResult);
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     // console.log(this.closeResult);
  //   });
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
