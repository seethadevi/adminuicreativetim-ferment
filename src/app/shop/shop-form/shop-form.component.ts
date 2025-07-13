import { Component, OnInit, NgZone, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import * as moment from 'moment';
import { AppService } from 'src/app/shared/services/app.service';
import { Urls } from 'src/app/shared/structures/urls';
import { AppToastrService } from 'src/app/shared/services/app-toastr.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as appAction from 'src/app/action/app-actions';
import * as appConst from 'src/app/shared/structures/app-constant';
import { ShopService } from '../shop.service';
import { MapsAPILoader } from '@agm/core';
import { map } from 'rxjs/operators';
import { WeezeventService } from '../weezevent.service';
import { LocationService } from 'src/app/reference-data/location/location.service';
import { DatasharingService } from '../shop-list/datasharing.service';
import { ChannelService } from 'src/app/channel/channel.service';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/reference-data/category/category-service';

declare var $: any;
declare const google: any;
@Component({
  selector: 'app-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.scss']
})
export class ShopFormComponent implements OnInit, OnDestroy {

  endDate: any;
  startDate: any;
  shopModel: any;
  selectedTab = '';
  listOfTabString = ['location', 'additional'];
  imgUploadUrl = '';
  thumbnailurl = '';
  thumbnailurl1 = '';
  timezonesList: any[];
  title = 'Add';
  isEdit = false;
  shopId = '';
  countryList: any[];
  qrURLString = '';
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public searchText: any;
  saveClickValidation = false;
  shopSubscription: any;
  shopOption: any;
  profDomainList: any;
  profTypeList: any;
  shopTypes: any;
  eventFromSubmit: boolean;
  locationsList: any[];
  subPlan: string;
  CHNANEL_ACCESS_PLANS = appConst.CHNANEL_ACCESS_PLANS;
  newEventOption: any;
  channelList: any[];
  allCategoryList: any[];
  codeList: any;
  selectedCategories: any[];
  @ViewChild('search', {static: true}) public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder, private urls: Urls, public appService: AppService, private store: Store<any>,
              private route: ActivatedRoute, private appToastrService: AppToastrService, private shopservice: ShopService,
              private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private weezeventService: WeezeventService,
              private locationService: LocationService, private datasharingService: DatasharingService,
              private channelService: ChannelService, private categoryService: CategoryService) {
    this.imgUploadUrl = this.urls.api['shopImage'];
  }

  ngOnInit() {
    this.timezonesList = [];
    this.locationsList = [];
    this.codeList = [];
    this.selectedTab = this.listOfTabString[0];
    this.shopModel = {
      sub_id: '',
      name: '',
      description: '',
      url: '',
      email: '',
      picture: '',
      startDate: '',
      endDate: '',
      mobile: '',
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      },
      country_code: '',
      event_id: '',
      logo: '',
      cust_mob_evt_show: false,
      geofencing_radius: 0,
      currency: {},
      timezone: '',
      site: '',
      longitude: '',
      latitude: '',
      payment_webshop: {
        cust_pay_at_till_flag: true,
        cust_pay_flag: false,
        cust_pay_and_settle_flag: false,
      },
      payment_mobile: {
        cust_pay_at_till_flag: true,
        cust_pay_flag: false,
        cust_pay_and_settle_flag: false,
      },
      shop_type: '',
      pricing_flag: true,
      order_transaction_flag: true,
      cart_flag: true,
      prof_type: '',
      prof_domain: '',
      score_range: 0,
      isWeezEvent: false,
      weezEventId: '',
      tickets: [],
      ticket_groups: [],
      isPrivate: false,
      location_code: '',
      organiser_name: '',
      channels: [],
      category_list: []
    };
    this.getAllCategoryList();
    this.profDomainList = [{id: 'RESTAURANT_OWNER', name: 'Restaurant Owner'},
                           {id: 'WINESHOP_OWNER', name: 'Wineshop Owner'},
                           {id: 'AGENT', name: 'Agent'},
                           {id: 'DISTRIBUTOR', name: 'Distributor'}
                          //  {id: 'JOURNALIST', name: 'Journalist'},
                          // { id: 'OTHER', name: 'Other' }
    ];
    this.profTypeList = [{id: 'WINE', name: 'Wine'},
      { id: 'CHEESE', name: 'Cheese' }];
    this.shopTypes = [{id: '', name: 'Shop Type'},
                    { id: 'SALES', name: 'Sales' },
                    {id: 'TASTING', name: 'Tasting'}];
    this.shopSubscription = this.store.select<any>((state: any) => state)
    .subscribe((s: any) => {
      this.shopModel.sub_id = s.appMainStore.subscriptionId;
      this.countryList = s.appMainStore.list_of_event_country;
      this.subPlan = s.appMainStore.subPlan;
    });
    this.shopOption = this.datasharingService.currentMessage.subscribe(message => this.newEventOption = message);
    this.searchText = '';
    this.getListOfChannels();
    if (this.route.snapshot.params['id']) {
      this.isEdit = true;
      this.title = 'Edit';
      this.shopId = this.route.snapshot.params['id'];
      this.qrURLString = environment.WEBSTORE + '/?shopid=' + this.shopId + '&sub_id=' + this.shopModel.sub_id;
      this.getShopIdDetail();
    } else if (this.route.snapshot.params['event_id']) {
      this.getWeezEventIDDetails(this.route.snapshot.params['event_id']);
    } else {
      this.selectedCategories = ['Wine'];
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      // set google maps defaults
      this.zoom = 4;
      this.latitude = parseFloat('48.86413152779803');
      this.longitude = parseFloat('2.3417617185671133');
      // set current position
      // this.setCurrentPosition();
    }

    // create search FormControl
    this.searchControl = new FormControl();

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
      //    const place: google.maps.places.PlaceResult = autocomplete.getPlace();
      const place  = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          if (!!place.adr_address) {
            this.shopModel.address['address1'] = $(place.adr_address).filter('.street-address').text();
            this.shopModel.address['zip'] = $(place.adr_address).filter('.postal-code').text();
            this.shopModel.address['city'] = $(place.adr_address).filter('.locality').text();
            if (!!$(place.adr_address).filter('.region').text() && !!$(place.adr_address).filter('.locality').text()) {
              this.shopModel.address['city'] += ', ' + $(place.adr_address).filter('.region').text();
            } else if (!!$(place.adr_address).filter('.region').text() && !$(place.adr_address).filter('.locality').text()) {
              this.shopModel.address['city'] = $(place.adr_address).filter('.region').text();
            }
            this.shopModel.address['country'] = $(place.adr_address).filter('.country-name').text();
            this.shopModel.site = !!this.searchElementRef.nativeElement.value ?
                              this.searchElementRef.nativeElement.value : this.searchText;
            // this.loadcountryData();
          }
          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          // console.log("here lat", this.latitude);
          // console.log("here lat", this.longitude);
          this.zoom = 12;
        });
      });
    });

    $('[data-toggle="wizard-checkbox"]').click(function() {
     // console.log(this.payment_webshop.cust_pay_at_till_flag)
      if ( $(this).hasClass('active')) {
          $(this).removeClass('active');
          $(this).find('[type="checkbox"]').removeAttr('checked');
      } else {
          $(this).addClass('active');
          $(this).find('[type="checkbox"]').attr('checked', 'true');
      }
    });

    this.eventFromSubmit = false;

    // this.shopeditbasic = this.formBuilder.group({
    //   // To add a validator, we must first convert the string value into an array.
    //   // The first item in the array is the default value if any, then the next item in the array is the validator.
    //   // Here we are adding a required validator meaning that the firstName attribute must have a value in it.
    //   shopname: [null, [Validators.required]],
    //   // We can use more than one validator per field. If we want to use more than one validator
    //   // we have to wrap our array of validators with a Validators.compose function.
    //   // Here we are using a required, minimum length and maximum length validator.
    //   siteurl: [''],
    //   description: [''],
    //   startdate: [new FormControl(new Date()), Validators.required],
    //   enddate: [new FormControl(new Date()), Validators.required],
    //   email: [''],
    //   mobile: [''],
    //  });

    //  this.shopeditother = this.formBuilder.group({
    //    shopname: [null, [Validators.required]],
    //    siteurl: [''],
    //   description: [''],
    //   startdate: [new FormControl(new Date()), Validators.required],
    //   enddate: [new FormControl(new Date()), Validators.required],
    //   email: [''],
    //   mobile: [''],
    //  });
  }

  // getFormatedUTCDate(date) {
  //   const year = date.getFullYear();
  //   const month = date.getMonth();
  // }

  getListOfChannels() {
    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'desc',
      searchvalue: '',
      searchelems: []
    };
    this.channelService.getChannelsWithPageData(defaultParams, this.shopModel.sub_id)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
          const channels = response.res.docs;
          const channelList = channels.map((channel) => {
            const item = channel;
            item['isAdded'] = false;
            return item;
          });
          // Display the selected Channel Options if selected in the list popup
          this.channelList = channelList.map((channel) => {

            const channelObj = this.newEventOption.channels.find(s => s._id === channel._id);

            if ( !!channelObj ) {
              channel['isAdded'] = true;
            }
            return channel;
          });

          this.shopModel.isPrivate = this.newEventOption.isPrivate;
            // console.log('updated value', this.channelList);
        } else {
          this.appToastrService.showError(response.msg);
        }
      },
      error => {
        // console.log(error);
        this.appToastrService.showError( error.msg || 'Channel detail failed to get.');
      });
  }

  addChannel(channel, idx) {
    this.channelList[idx]['isAdded'] = !this.channelList[idx]['isAdded'];
    return false;
  }

  getWeezEventIDDetails(event_id) {
    this.weezeventService.getWeezEventDetails({ sub_id: this.shopModel.sub_id , event_id: event_id})
    .subscribe(
      (response: any) => {
        const event_data = {
          name: response.events.title,
          description: response.events.description,
          url: response.events.site_url,
          email: response.events.organizer.email,
          picture: {
            lg: response.events.image,
            md: response.events.image,
            sm: response.events.image
          },
          startDate: response.events.period.start,
          endDate: response.events.period.end,
          mobile: response.events.organizer.phone,
          address: {
            address1: response.events.venue.address,
            address2: response.events.venue.name ,
            city: response.events.venue.city,
            state: response.events.venue.state,
            zip: response.events.venue.zip_code,
            country: response.events.venue.country.name
          },
          country_code: response.events.venue.country.code,
          event_id: response.events.id,
          logo: '',
          cust_mob_evt_show: false,
          geofencing_radius: 0,
          site: response.events.venue.address + ' ' + response.events.venue.zip_code + ' ' +
              response.events.venue.city + ' ' + response.events.venue.country.name,
          longitude: response.events.venue.coordinates.long,
          latitude: response.events.venue.coordinates.lat,
          isWeezEvent: true,
          weezEventId: response.events.id,
          city: response.events.venue.city,
          organiser_name: response.events.organizer.first_name + ' ' + response.events.organizer.last_name
        };
        this.shopModel = Object.assign({}, this.shopModel, event_data);
        this.endDate = this.formatWeezeventDate(response.events.period.end);
        this.startDate = this.formatWeezeventDate(response.events.period.start);
        // this.loadcountryData();
        this.selectCountryData();
        // this.thumbnailurl = !!response.msg.banner ? response.msg.banner.md : '';
        // this.thumbnailurl1 = !!response.msg.picture ? response.msg.picture.md : '';
        this.searchText = response.events.venue.address.replace(/,/g, ' ') + ' ' + response.events.venue.zip_code + ' ' +
          response.events.venue.city + ' ' + response.events.venue.country.name;
        this.zoom = 12;
        this.latitude = parseFloat(response.events.venue.coordinates.lat);
        this.longitude = parseFloat(response.events.venue.coordinates.long);
        this.setCurrentPosition();
      // if (!!response.events && !!response.events.length) {
      //   this.weezeventList = response.events;
      //   this.totalRecords = response.events.length;
      // } else {
      //   this.appToastrService.showError(response.msg);
      // }
    },
    error => {
      // console.log(error);
      this.appToastrService.showError(error.msg || 'Weezevent detail failed to get.');
    });
  }

  getAllCategoryList() {

    const defaultParams = {
      page: 1,
      limit: 100,
      sortkey: '',
      sortorderstring: 'asc',
      searchvalue: '',
      searchelems: ['type']
    };
    this.categoryService.getCategorysWithPageData(defaultParams)
      .subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.allCategoryList = response.res.docs;
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

  ngOnDestroy() {
    if (!!this.shopSubscription) {
      this.shopSubscription.unsubscribe();
    }

    if (!!this.shopOption) {
      this.shopOption.unsubscribe();
    }
  }

  formatWeezeventDate(dateValue) {
    // Value from 2019-10-18 01:00:00 - > Need to change like : 2019-10-18T01:00:00.000Z
    return dateValue.replace(' ', 'T').concat('.000Z');
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  setSelectedTab(tabStr) {
    this.selectedTab = tabStr;
  }

  selectCountryData() {
    const selectedCountry = this.countryList.find(s => s.code.toLowerCase() === this.shopModel.country_code.toLowerCase());
    if (!!selectedCountry) {
      const dataModel = {
        currency: selectedCountry['currency'],
        timezone: selectedCountry['timezones'][0]
      };
      this.timezonesList = selectedCountry['timezones'];
      this.shopModel = Object.assign({}, this.shopModel, dataModel);
    }
  }

  loadcountryData() {
    if (!!this.shopModel.address.country) {
      const selectedCountry = this.countryList.find(s => s.name.toLowerCase() === this.shopModel.address.country.toLowerCase());
      if (!!selectedCountry) {
        const dataModel = {
          currency: selectedCountry['currency'],
          timezone: selectedCountry['timezones'][0]
        };
        this.timezonesList = selectedCountry['timezones'];
        this.shopModel = Object.assign({}, this.shopModel, dataModel);
      }
    }
  }

  selectOptionFlag() {
    let dataModel;
    if ( this.shopModel.shop_type === 'TASTING') {
      dataModel = {
        pricing_flag: false,
        order_transaction_flag: false,
        cart_flag: false,
      };
    } else {
      dataModel = {
        pricing_flag: true,
        order_transaction_flag: true,
        cart_flag: true,
      };
    }
    this.shopModel = Object.assign({}, this.shopModel, dataModel);
  }

   createDateOject(value) {
    const object1 = value.split('T');
    const object2 = object1[0].split('-');
    return { 'year': parseInt(object2[0], 10), 'month': parseInt(object2[1], 10), 'day': parseInt(object2[2], 10) };
    // return parseInt(object2[0], 10) + '-' + parseInt(object2[1], 10) + '-' + parseInt(object2[2], 10);
   }

  // getLocationCodeList() {
  //   const defaultParams = {
  //     page: 1,
  //     limit: 10000,
  //     sortkey: '',
  //     sortorderstring: 'desc',
  //     searchvalue: '',
  //     searchelems: ['code', 'name.en']
  //   };
  //   this.locationService.getLocationsWithPageData(defaultParams, this.shopModel.country_code, true)
  //   .subscribe(
  //     (response: any) => {
  //       if (response.status === 'success') {
  //         this.locationsList = response.res.docs;
  //         if (this.isEdit) {
  //           this.getShopIdDetail();
  //         }
  //       } else {
  //         this.appToastrService.showError(response.msg);
  //       }
  //     },
  //     error => {
  //       // console.log(error);
  //       this.appToastrService.showError( error.msg || 'Location detail failed to get.');
  //     });
  // }

  public requestAutocompleteItems = (text$: Observable<string>): Observable<any> => {
    if (this.shopModel.country_code) {
      return this.locationService
       .getLocationsWithPageData(text$, this.shopModel.country_code, true)
       .pipe(
         map(
           data => data
         )
       );
    }
  }

  onAddingCode(item: string) {
    this.shopModel['location_code'] = item['code'];
  }

  onRemovingCode(item: string) {
    this.shopModel['location_code'] = '';
  }

   getShopIdDetail() {
    this.shopservice.getShop({id: this.shopId})
    .subscribe(
      (response: any) => {
      if (response.status === 'success') {
        // Make center align the QR code
        $('#printData').find('img').attr('style', 'margin:auto');
        // console.log(response.msg);
        this.shopModel = Object.assign({}, this.shopModel, response.msg);
        // console.log(this.shopModel.name);
        // this.endDate = this.createDateOject(response.msg.endDate);
        // this.startDate = this.createDateOject(response.msg.startDate);
        this.endDate = response.msg.endDate;
        this.startDate = response.msg.startDate;
        this.shopModel.tickets = !!this.shopModel.tickets ? this.shopModel.tickets : [];
        // this.loadcountryData();
        this.selectCountryData();
        if ( response.msg.location_code ) {
          this.codeList.push(response.msg.location_code);
        }
        if (!!response.msg.category_list) {
          this.selectedCategories = response.msg.category_list.map((item) => {
            return item['type'];
          });
        }
        this.thumbnailurl = !!response.msg.banner ? response.msg.banner.lg : '';
        this.thumbnailurl1 = !!response.msg.picture ? response.msg.picture.lg : '';
        this.searchText = response.msg.site;
        if (response.msg.location_code === undefined) {
          this.shopModel.location_code = '';
        }
        this.zoom = 12;
        this.latitude = parseFloat(response.msg.location.coordinates[1]);
        this.longitude = parseFloat(response.msg.location.coordinates[0]);
        // this.setCurrentPosition();
      } else {
        this.appToastrService.showError(response.msg);
      }
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
    },
    error => {
      // console.log(error);
      this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
      this.appToastrService.showError(error.msg || 'Event detail failed to get.Please try agian later.');
    });
  }

  searchKeyDown(event: any) {
    if (event.key === 'Enter') {
      // console.log(event);
      event.preventDefault();
    }
  }
  onFileUploadEvent(event: any) {
    // console.log(event);
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.shopModel.banner = '';
    } else {
      this.shopModel.banner = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }
  selectPaymentOption(optionStr) {
    this.shopModel.payment_mobile[optionStr] = !this.shopModel.payment_mobile[optionStr];
    // console.log(this.shopModel);
  }
  onSaveClick() {
    this.eventFromSubmit = true;
    if (!this.shopModel.name) {
      this.setSelectedTab(this.listOfTabString[0]);
      return false;
    }
    if (!this.startDate) {
      this.setSelectedTab(this.listOfTabString[0]);
      return false;
    }
    if (!this.endDate) {
      this.setSelectedTab(this.listOfTabString[0]);
      return false;
    }
    if (!this.shopModel.shop_type) {
      this.setSelectedTab(this.listOfTabString[0]);
      return false;
    }

    if (!this.shopModel.organiser_name) {
      this.setSelectedTab(this.listOfTabString[0]);
      return false;
    }

    if (!this.shopModel.location_code) {
      this.setSelectedTab(this.listOfTabString[0]);
      return false;
    }

    if (!this.shopModel.address.address1 || !this.shopModel.address.city
      || !this.shopModel.address.zip || !this.shopModel.address.country) {
      this.setSelectedTab(this.listOfTabString[0]);
      return false;
    }

    if (!!this.shopModel.shop_type && this.shopModel.shop_type === 'TASTING' &&
      (!this.shopModel.prof_domain || !this.shopModel.prof_type)) {
      this.setSelectedTab(this.listOfTabString[1]);
      return false;
    }
    const selchannels = [];
    this.channelList.forEach((item) => {
      if (item.isAdded) {
        selchannels.push(item);
      }
    });

    this.shopModel.channels = selchannels;

    const selCategories = [];
    this.selectedCategories.forEach((item) => {
      const idx = this.allCategoryList.findIndex(x => x['type'] === item);
      const selItem = this.allCategoryList[idx];
      delete selItem['_id'];
      selCategories.push(this.allCategoryList[idx]);
    });

    this.shopModel.category_list = selCategories;

    if (!!this.shopModel.name && !!this.startDate && !!this.endDate
      && !!this.shopModel.address.address1 && !!this.shopModel.address.city
      && !!this.shopModel.address.zip && !!this.shopModel.address.country) {
        this.saveClickValidation = false;
        //  this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : true}});
        this.shopModel.endDate = this.endDate;
        this.shopModel.startDate = this.startDate;
        this.shopModel.longitude = this.longitude;
        this.shopModel.latitude = this.latitude;
          if (!this.shopModel.geofencing_radius) {
          this.shopModel.geofencing_radius = 0;
        }
        if (this.isEdit) {
          const newModel = Object.assign({}, this.shopModel, { 'id': this.shopId });
          // console.log('i am in update');
          this.updateShop(newModel);
        } else {
          this.saveShop();
        }
      }
      //  console.log('My saved value', this.shopModel);
    }
  // Model: "2018-11-09T06:30:00.000Z"
    getFormatedDate(dateValue) {
      return dateValue.year + '-' + dateValue.month + '-' + dateValue.day;
    }

    saveShop() {
      this.shopservice.saveShop(this.shopModel)
        .subscribe(
        (response: any) => {
          if (response.status === appConst.SUCCESS) {
            this.appToastrService.showSuccess(response.msg);
            this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
            // this.openTypeSelectionModal('shopQRCode');
            this.onClearValue();
          } else {
            this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
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
          this.appToastrService.showError(error.msg || 'Event detail failed to save.Please try again later.');
        });
    }

    updateShop(updateShop) {
      this.shopservice.updateShop(updateShop)
      .subscribe(
      (response: any) => {
        if (response.status === appConst.SUCCESS) {
          this.appToastrService.showSuccess(response.msg);
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
          this.onClearValue();
        } else {
          this.store.dispatch({type: appAction.SHOWHIDE_APP_LOADING, payload: { flag : false}});
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
        this.appToastrService.showError(error.msg || 'Event detail failed to update.Please try agian later.');
      });
    }

    onClearValue() {
      this.appService.gotoURL('subscriptionhome/shop');
    }

  // getFormatedDate(dateValue) {
  //   return moment(dateValue).format('YYYY-MM-DD');
  // }


  // onSubmit(f: NgForm) {
  //     this.shopModel.endDate = this.getFormatedDate(f.value.enddate);
  //     this.shopModel.startDate = this.getFormatedDate(f.value.startdate);
  //     this.shopModel.name = f.value.shopname;
  //     this.shopModel.url = f.value.siteurl;
  //     this.shopModel.description = f.value.description;
  //     this.shopModel.mobile = f.value.mobile;
  //     this.shopModel.email = f.value.email;
  // }

  // enableTab(val, event) {
  //   // debugger;
  //   event.preventDefault();
  //   switch (val) {
  //     case 'additional': {
  //       this.basic = false;
  //       this.otherDetails = true;
  //       this.paySettings = false;
  //       this.locationInfo = false;
  //       this.qrSettings = false;
  //       event.returnValue = true;
  //       break;
  //     }
  //     case 'locationInfo': {
  //       this.basic = false;
  //       this.otherDetails = false;
  //       this.paySettings = false;
  //       this.locationInfo = true;
  //       this.qrSettings = false;
  //       event.returnValue = true;
  //       break;
  //     }
  //     case 'paysettings': {
  //       this.basic = false;
  //       this.otherDetails = false;
  //       this.paySettings = true;
  //       this.locationInfo = false;
  //       this.qrSettings = false;
  //       event.returnValue = true;
  //       break;
  //     }
  //     case 'qrSettings': {
  //       this.basic = false;
  //       this.otherDetails = false;
  //       this.paySettings = false;
  //       this.locationInfo = false;
  //       this.qrSettings = true;
  //       event.returnValue = true;
  //       break;
  //     }
  //     case 'basicinfo': {
  //       this.basic = true;
  //       this.otherDetails = false;
  //       this.paySettings = false;
  //       this.locationInfo = false;
  //       this.qrSettings = false;
  //       event.returnValue = true;
  //       break;
  //     }
  //     default: {
  //       this.basic = true;
  //       this.otherDetails = false;
  //       this.paySettings = false;
  //       this.locationInfo = false;
  //       this.qrSettings = false;
  //       event.returnValue = true;
  //       break;
  //     }
  //   }
  // }
  onFileUploadEvent1(event: any) {
    // console.log(event);
    if (event.status === -1) {
      this.appToastrService.showError(event.msg);
    } else if (event.status === -2) {
      this.shopModel.pciture = '';
    } else {
      this.shopModel.picture = event.url;
      this.appToastrService.showSuccess(event.msg);
    }
  }
  Print(printSectionId) {
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
}
