export class Orgprofile {
    org_name: string;
    add1: string;
    add2: string;
    city: string;
    state: string;
    pin: string;
    org_type: string;
    contactnumber: string;
    contactemail: string;
    longitude: string;
    latitude: string;
    org_logo: string;
    token : string;
    orgid : string;
    type : string;
    staffid: string;
    parentid: string;
    hierarchytype:string;
  }
  
  export class GetOrg {
    orgid: string
    org_name: string
    org_logo: string
    longitude: string
    latitude: string
    add1: string
    add2: string
    city: string
    state: string
    pin: string
    org_type: string
    contactperson: string
    contactnumber: string
    contactemail: string
    displaytag: string
    url: string;
    parentid: string;
    hierarchytype:string;
  }
  export class OrgUpdate{
    orgid: string
    org_name: string
    org_logo: string
    longitude: string
    latitude: string
    add1: string
    add2: string
    city: string
    state: string
    pin: string
    org_type: string
    contactperson: string
    contactnumber: string
    contactemail: string
    displaytag: string
    token: string
    type: string
    staffid: string
    url: string;
    parentid: string;
    hierarchytype:string;
  }
  export class OrgSettings{
    orgid: string;
    token: string;
    settings: Settings;
    fullname: number;
    layout: number;
    parkingnumber: number;
    reservation: number;
    cancellation: number;
    penalty:number;
    tac:any;
    privacy:any;
    about:any;
    availability:any;
    start:any;
    end:any;
    groupby:any;
    cancellationtime:any;
    cancellationamount:any;
    cancellationmethod:any;
    cancellationpercent:any;
    flagexit:number;
    constructor(settings:Settings,token:string){
      this.token=token;
      this.settings=settings;
    }
  }
  export class Settings{
    fullname: number;
    layout: number;
    parkingnumber: number;
    reservation: number;
    cancellation:number;
    penalty:number;
    tac:any;
    privacy:any;
    about:any;
    availability:any;
    start:any;
    end:any;
    groupby:any;
    cancellationtime:any;
    cancellationamount:any;
    cancellationmethod:any;
    cancellationpercent:any;
    flagexit:number;
  }
  
  export class getOrgSettings{
    fullname: number;
    layout: number;
    parkingnumber: number;
    reservation: number;
    cancellation:number;
    penalty:number;
    token:string;
    tac:any;
    privacy:any;
    about:any;
    availability:any;
    start:any;
    end:any;
    groupby:any;
    cancellationtime:any;
    cancellationamount:any;
    cancellationmethod:any;
    cancellationpercent:any;
    flagexit:number;
  }
  
  export class BankDetails {
    emailid:any;
    accountnumber:any;
    orgid:any;
    ifsc:any;
    accountname:any;
    accountid:any;
    token:any;
  }
