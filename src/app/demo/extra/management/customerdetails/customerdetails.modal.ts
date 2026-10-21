

export class GetCustomerdetails {
    address: string;
    createddate: string;
    email:string;
    fullname: string;
    image: string;
    isactive: string;
    org_name: string;
    orgid: string;
    otp:string;
    otpdate: string;
    phone: string;
    id: string;
    vehicleno: string;
    vehicletype: string;
    token: string;
    profilepassword:string;
    tagid:any;
}
export class AddCustomerDetails {
    phone: string;
    fullname: string;
    vehiclecat:string;
    vehiclenumber:string;
    isactive:any;
    token: string;
    custid:string;
    isspecial:any;
    ctype:any;
    parkinglotid:any;
    empid:any;
    enddate:any;
    tagid:any;
    tagstatus:any;
    imageurl:any;
    type:any;
    orgid:any;
}

export class EmployeeBulkUpload {
    phone: any[];
    fullname: any[];
    vehiclecat:string;
    vehiclenumber:string;
    isactive:any;
    token: string;
    custid:string;
    isspecial:any;
    ctype:any;
    parkinglotid:any;
    empid:any[];
    enddate:any[];
    tagid:any[];
    type:any;
}