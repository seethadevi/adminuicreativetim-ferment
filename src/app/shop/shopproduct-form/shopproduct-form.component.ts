import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { WarehouseproductService } from '../../warehouse/warehouseproduct/warehouseproduct.service';
import { Store } from '@ngrx/store';
import { Urls } from '../../shared/structures/urls';
import { CategoryService } from 'src/app/category/category.service';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { AppService } from 'src/app/shared/services/app.service';
import { ActivatedRoute } from '@angular/router';
import * as appConst from 'src/app/shared/structures/app-constant';
import { ShopproductListService } from '../shopproduct-list.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import * as appAction from 'src/app/action/app-actions';
import { TaxclassService } from 'src/app/reference-data/taxclass/taxclass.service';

@Component({
  selector: 'app-shopproduct-form',
  templateUrl: './shopproduct-form.component.html',
  styleUrls: ['./shopproduct-form.component.scss']
})

export class ShopproductFormComponent implements OnInit, OnDestroy, AfterViewInit {

  category = false;
  basic = true;
  stockinfo = false;
  pricinginfo = false;
 // qrCode: boolean = false;
  shopProdSubscription: any;
  shopProdModel: any;
  products: any[];
  title = 'Add';
  isEdit = false;
  allCategoryList: any[];
  allTaxclassList: any[];
  shopProdId = '';
  selectCatgoryConst = 'Select Category';
  displayProduct: string;
  warehouseStock = 0;
  closeResult = '';
  shopaddModel: any;
  addStockClick = false;
  removeStockClick = false;
  shopremoveModel: any;
  productList: any[];

  constructor(private urls: Urls, private store: Store<any>, private shopproductListService: ShopproductListService,
    private warehouseproductService: WarehouseproductService, private categoryService: CategoryService,
    private appToastrService: AppToastrService, private appService: AppService, private route: ActivatedRoute
    , private modalService: NgbModal, private taxclassService: TaxclassService) { }


  ngOnInit() {
    this.shopaddModel = {
      quantity : ''
    };
    // this.shopremoveModel = {
    //   sid: ''
    // };
    this.shopremoveModel = {
      quantity: '',
      reason: '',
      remarks: ''
    };
    this.productList = [];
    this.shopProdModel = {
      category_id: '',
      category_type: '',
      sub_id: '',
      shop_id: '',
      warehouse_id: '',
      warehouse_product_id: '',
      name: '',
      description: '',
      gtin: '',
      stock_availability: 0,
      images: [],
      videos: [],
      pricing: {
        price: '',
        vat: '',
        vat_unit: 'pt',
        price_w_vat: '',
        taxclass_id: ''
      },
      prod_id : '',
      picture: '',
      logo: '',
      attr: {},
      ext_attr: {},
      producer: {},
      label: ''
    };
    this.displayProduct = '';
    this.shopProdSubscription = this.store.select<any>((state: any) => state)
        .subscribe((s: any) => {
          this.shopProdModel.sub_id = s.appMainStore.subscriptionId;
          this.shopProdModel.shop_id = s.appMainStore.shopId;
          this.shopProdModel.warehouse_id = s.appMainStore.warehouseId;
    });
    this.allCategoryList = [
      {type: this.selectCatgoryConst, id: ''}
    ];
    this.products = [];
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
    this.getAllCategoryList();
    this.getAllTaxclassList();
    this.getReferenceProductList();
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.shopProdId = this.route.snapshot.params['id'];
      this.getShopProductIdDetail();
    } else {

    }
  }
ngAfterViewInit() {
  if (this.isEdit) {
    this.basic = true;
    this.category = false;
    } else {
      this.category = true;
      this.basic = false;
    }
  }
  ngOnDestroy() {
    if (!!this.shopProdSubscription) {
      this.shopProdSubscription.unsubscribe();
    }
  }
  setCategoryId(event) {
    if (!!event.target && !!event.target.value) {
      const idx = this.allCategoryList.findIndex(x => x['type'] === event.target.value);
      this.shopProdModel.category_id = this.allCategoryList[idx]['id'];
    }
  }
  enableTab(val, event) {
    event.preventDefault();
    switch (val) {
      case 'category': {
        this.category = true;
        this.basic = false;
        this.stockinfo = false;
        this.pricinginfo = false;
        event.returnValue = true;
        break;
       }
       case 'info': {
        this.category = false;
        this.basic = true;
        this.stockinfo = false;
        this.pricinginfo = false;
        event.returnValue = true;
        break;
       }
        case 'stockinfo': {
        this.category = false;
        this.basic = false;
        this.stockinfo = true;
        this.pricinginfo = false;
        event.returnValue = true;
        break;
       }
        case 'pricinginfo': {
          this.category = false;
          this.basic = false;
          this.stockinfo = false;
          this.pricinginfo = true;
          event.returnValue = true;
          break;
        }
        default: {
          if (this.isEdit) {
          this.category = false;
            this.basic = true;
            this.stockinfo = false;
            this.pricinginfo = false;
            event.returnValue = true;
          } else {
            this.category = true;
            this.basic = false;
            this.stockinfo = false;
            this.pricinginfo = false;
            event.returnValue = true;
          }
          break;
        }
    }
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
        if (!this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
        if (response.status === appConst.SUCCESS) {
          this.allCategoryList = response.res.docs;
          this.allCategoryList.unshift({type: this.selectCatgoryConst, id: '' });
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        if (!this.isEdit) {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
        }
        this.appToastrService.showError(error.msg || 'Category detail failed to get.');
      });
  }

  getAllTaxclassList() {
    this.taxclassService.getSubscriptionTaxclass( { sub_id : this.shopProdModel.sub_id })
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

  getShopProductIdDetail() {
    this.shopproductListService.getShopProduct({id: this.shopProdId})
    .subscribe(
    (response: any) => {
      if (response.status === appConst.SUCCESS) {
        this.shopProdModel = response.msg;
         this.getWHProdctdetails(response.msg.warehouse_product_id );
      } else {
        this.appToastrService.showError(response.msg);
        this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Shop product detail failed to get.Please try agian later.');
    });
  }

  getWHProdctdetails(id) {
    this.warehouseproductService.getwarehouseProduct({id: id})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      if (response.status === 'success') {
        this.products.push(response.msg);
        if (!this.shopProdModel.category_id) {
          const idx = this.allCategoryList.findIndex(x => x['type'] === this.shopProdModel.category_type);
          this.shopProdModel.category_id = this.allCategoryList[idx]['id'];
        }
        this.displayProduct = response.msg['name'];
        this.warehouseStock = response.msg['stock_availability'];
        this.shopProdModel.picture = response.msg['picture'];
        this.shopProdModel.attr = response.msg['attr'];
        this.shopProdModel.ext_attr = response.msg['ext_attr'];
        this.shopProdModel.logo = response.msg['logo'];
        this.shopProdModel.label = response.msg['label'];
        this.shopProdModel.prod_id = response.msg['prod_id'];
        this.shopProdModel.producer = response.msg['producer'];
      } else {
        this.appToastrService.showError(response.msg);
      }
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Warehouse detail failed to get.Please try agian later.');
    });
  }

  public requestAutocompleteItems = (text$: Observable<string>): Observable<any> => {
   return this.warehouseproductService
      .getwarehouseProductsWithPageData(text$, this.shopProdModel.sub_id)
      .pipe(
        map(
          data => data
        )
      );
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
    this.warehouseproductService.getwarehouseProductsWithPageData(defaults, this.shopProdModel.sub_id)
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

  onAddingProduct(item: string) {
    const dataModel = {
      name : item['name'],
      description: item['description'],
      gtin: item['gtin'],
      stock_availability: 0,
      warehouse_product_id: item['id'],
      pricing: {
        price: item['pricing']['price'],
        vat: item['pricing']['vat'],
        vat_unit: 'pt',
        price_w_vat: item['pricing']['price_w_vat'],
        taxclass_id: item['pricing']['taxclass_id']
      },
      picture: item['picture'],
      logo: item['logo'],
      prod_id: item['prod_id'],
      attr: item['attr'],
      ext_attr: item['ext_attr'],
      producer: item['producer'],
      label: item['label']
    };
    this.warehouseStock = !!item['stock_availability'] ? item['stock_availability'] : 0;
    this.shopProdModel = Object.assign({}, this.shopProdModel, dataModel);
    // console.log('New saved Value', this.shopProdModel);
  }

  onRemovingProduct(item: string) {
   this.products = [];
    const dataModel = {
      name : '',
      description: '',
      gtin: '',
      stock_availability: 0,
      warehouse_product_id : '',
      pricing: {
        price: '',
        vat: '',
        vat_unit: 'pt',
        price_w_vat: '',
        taxclass_id : ''
      },
      picture: '',
      logo: '',
      prod_id: '',
      attr: {},
      ext_attr: {},
      producer: {},
      label: ''
    };
    this.shopProdModel = Object.assign({}, this.shopProdModel, dataModel);
    console.log('New saved Value', this.shopProdModel);
  }


  taxclassOnChange(event) {
    const val = event.target.value;
    const selectedTaxClass = this.allTaxclassList.find(s => s._id === val);
   //  console.log(selectedTaxClass);
    this.shopProdModel.pricing.vat = selectedTaxClass['tax_class_percent'];
    this.calculateTotalPrice(event);
  }
  calculateTotalPrice(event: any) {
   if (!isNaN(this.shopProdModel.pricing.price) && this.shopProdModel.pricing.price  !== ''
       && !isNaN(this.shopProdModel.pricing.vat)) {
     const price = !!this.shopProdModel.pricing.price ? this.shopProdModel.pricing.price : 0;
     const vat = !!this.shopProdModel.pricing.vat ? this.shopProdModel.pricing.vat : 0;
     this.shopProdModel.pricing.price_w_vat = (price + ((price * vat) / 100 )).toFixed(2);
   }
  }

  onSubmit(f: NgForm) {
   if (!!this.shopProdModel.name && !!this.shopProdModel.category_type && this.shopProdModel.prod_id
    && !!this.shopProdModel.pricing.price && !!this.shopProdModel.pricing.taxclass_id && !!this.shopProdModel.pricing.price_w_vat) {
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
       if (this.isEdit) {
         const newModel = Object.assign({}, this.shopProdModel, {'id': this.shopProdId});
         this.updateShopproduct(newModel);
       } else {
         if (parseInt(this.shopProdModel.stock_availability, 10) === 0) {
          this.saveShopproduct();
         } else {
           this.saveShopproductWithStock();
         }
       }

     }
  //  console.log('My saved value', this.shopProdModel);
  }

  saveShopproduct() {
   this.shopproductListService.saveShopProduct(this.shopProdModel)
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
    //  console.log(error);
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
     this.appToastrService.showError(error.msg || 'Shop product detail failed to save.Please try again later.');
   });
  }

  saveShopproductWithStock() {
   this.shopproductListService.saveShopProductWithStock(this.shopProdModel)
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
    //  console.log(error);
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
     this.appToastrService.showError(error.msg || 'Shop product detail failed to save.Please try again later.');
   });
  }

  updateShopproduct(updateWSProduct) {
   this.shopproductListService.updateShopProduct(updateWSProduct)
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
    //  console.log(error);
    this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
     this.appToastrService.showError(error.msg || 'Shop product detail failed to update.Please try agian later.');
   });
  }

  onClearValue() {
    this.appService.gotoURL('subscriptionhome/shop/detailview/shopproductlist');
  }

  addStockToProduct() {
    this.addStockClick = true;
    if (!!this.shopaddModel.quantity && this.shopaddModel.quantity <= this.warehouseStock) {
      this.shopproductListService.appUpdateProductStock({shopId: this.shopProdModel.shop_id, quantity: this.shopaddModel.quantity
        , warehouse_product_id: this.shopProdModel.warehouse_product_id, sub_id: this.shopProdModel.sub_id})
        .subscribe(
        (response: any) => {
          if (response.status === appConst.SUCCESS) {
            this.shopaddModel.quantity = '';
            this.getShopProductIdDetail();
            this.modalService.dismissAll('Close popup after Save.');
            this.appToastrService.showSuccess(response.msg);
          } else {
            this.appToastrService.showError(response.msg);
          }
          this.addStockClick = false;
        },
        error => {
          this.addStockClick = false;
          console.log(error);
          this.appToastrService.showError(error.msg || 'Shop Product Stock failed to update.Please try agian later.');
        });
    }
  }

  removeStockToProduct() {
    this.removeStockClick = true;
    // if (!!this.shopremoveModel.sid) {
    //   this.wsRemoveProduct(this.shopremoveModel.sid);
    // }
    if ( !!this.shopremoveModel.quantity && !!this.shopremoveModel.reason && !!this.shopremoveModel.remarks
      && this.shopProdModel.stock_availability >= this.shopremoveModel.quantity && this.shopremoveModel.quantity > 0 ) {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
      this.shopRemoveProduct();
    }
  }

  shopRemoveProduct() {
    this.shopproductListService.deleteProductStock({qty: this.shopremoveModel.quantity,
      reasonForRemoval: this.shopremoveModel.reason,
      comments: this.shopremoveModel.remarks, shop_product_id: this.shopProdId})
    .subscribe(
    (response: any) => {
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.removeStockClick = false;
      if (response.status === appConst.SUCCESS) {
        this.shopremoveModel = {
          quantity: '',
          reason: '',
          remarks: ''
        };
        this.appToastrService.showSuccess(response.msg);
        this.getShopProductIdDetail();
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


  // wsRemoveProduct(id) {
  //   this.shopproductListService.deleteProductStock({serial: id })
  //   .subscribe(
  //   (response: any) => {
  //     if (response.status === appConst.SUCCESS) {
  //       this.shopremoveModel.sid = '';
  //       this.removeStockClick = false;
  //       this.getShopProductIdDetail();
  //       this.modalService.dismissAll('Close popup after Save.');
  //       this.appToastrService.showSuccess(response.msg);
  //     } else {
  //       this.removeStockClick = false;
  //       this.appToastrService.showError(response.msg);
  //     }
  //   },
  //   error => {
  //     console.log(error);
  //     this.removeStockClick = false;
  //     this.appToastrService.showError(error.msg || 'Product Stock failed to delete.Please try agian later.');
  //   });
  // }

  openTypeSelectionModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.addStockClick = false;
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.addStockClick = false;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

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
