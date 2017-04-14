export interface WSDReiseAuskunftInterface {

    angebotssuche(request: AngebotssucheRequest): AngebotssucheResponse
    Angebotsdetails(request: AngebotsdetailsRequest): AngebotsdetailsResponse
    Ping(request: PingRequestRA): PingResponse
    Monitoring(request: MonitoringRequest): MonitoringResponse
}


export interface AngebotsdetailsRequest {



    Header: HeaderRequestRA


    RequestData: RequestData

}


export interface HeaderRequestRA {

    attributes: {


        us: string


        sig: string


        tnr: string


        t: string


        l: string

    }


}


export interface RequestData {

    attributes: {


        ot: string


        bmis: number

    }



    TariffIdentificationH: TariffIdentification


    TariffIdentificationR: TariffIdentification


    TravelerList: TravelerList


    ScheduleH: Schedule


    ScheduleR: Schedule

}


export interface TariffIdentification {

    attributes: {


        t: string


        c: string

    }


}


export interface TravelerList {



    Traveler: Traveler

}


export interface Traveler {

    attributes: {


        age: number


        r: string

    }


}


export interface Schedule {

    attributes: {


        sid: string


        dt: string

    }



    TrainList: TrainList

}


export interface TrainList {



    Train: Train

}


export interface Train {

    attributes: {


        tid: string


        s: number


        d: number


        dep: string


        arr: string


        tn: string


        lt: string

    }


}


export interface AngebotsdetailsResponse {



    Header: HeaderResponse


    Error: Error


    ResponseData: ResponseData

}


export interface HeaderResponse {

    attributes: {


        tnr: string


        t: string

    }


}


export interface Error {

    attributes: {


        nr: string


        txt: string


        sev: string

    }


}


export interface ResponseData {



    OfferDetails: OfferDetails


    ScheduleH: Schedule1


    ScheduleR: Schedule1

}


export interface OfferDetails {

    attributes: {


        pp: number


        ssn: string


        sdn: string


        ssnr: string


        sdnr: string


        bmis: number


        ff: string


        post: number


        mot: string

    }



    TariffIdentificationH: TariffIdentification1


    TariffIdentificationR: TariffIdentification1


    TravelerList: TravelerList


    OfferSegList: OfferSegmentList


    SeatResH: SeatReservation


    SeatResR: SeatReservation

}


export interface TariffIdentification1 {

    attributes: {


        t: string


        c: string

    }


}


export interface OfferSegmentList {



    OfferSeg: OfferSegment

}


export interface OfferSegment {

    attributes: {


        dir: string


        st: string


        sn: string


        dn: string


        p: number


        tt: string


        od: string


        oc: string


        zb: string


        tid: string

    }


}


export interface SeatReservation {

    attributes: {


        p: number

    }



    RefTrain: RefTrain

}


export interface RefTrain {

    attributes: {


        tid: string

    }


}


export interface Schedule1 {

    attributes: {


        sid: string


        dt: string


        dur: string


        nt: number


        pr: string

    }



    TrainList: TrainList1

}


export interface TrainList1 {



    Train: Train1

}


export interface Train1 {

    attributes: {


        tid: string


        sn: string


        s: number


        dn: string


        d: number


        dep: string


        arr: string


        ptfd: string


        ptfa: string


        tn: string


        lt: string


        rt1: string


        rt2: string

    }


}


export interface AngebotssucheRequest {



    Header: HeaderRequestRA


    RequestData: RequestData1

}


export interface RequestData1 {

    attributes: {


        s: number


        d: number


        c: string


        bmis: number


        dc: string


        coc: string

    }



    DateTimeH: DateTime


    DateTimeR: DateTime


    TravelerList: TravelerList

}


export interface DateTime {

    attributes: {


        d: string

    }



    SearchPeriod: SearchPeriod

}


export interface SearchPeriod {

    attributes: {


        t: string


        dur: number

    }


}


export interface AngebotssucheResponse {



    Header: HeaderResponse


    Error: Error


    ResponseData: ResponseData1

}


export interface ResponseData1 {

    attributes: {


        post: number

    }



    Offers: Offers


    ScheduleResult: ScheduleResult

}


export interface Offers {

    attributes: {


        dir: string

    }



    Offer: Offer

}


export interface Offer {

    attributes: {


        p: number


        t: string


        od: string


        tt: string


        c: string


        zb: string


        arq: string


        ff: string


        mot: string

    }



    RefSchedule: RefSchedule

}


export interface RefSchedule {

    attributes: {


        sid: string

    }


}


export interface ScheduleResult {



    Schedule: Schedule2

}


export interface Schedule2 {

    attributes: {


        dir: string


        sid: string


        dt: string


        dur: string


        nt: number


        pr: string

    }



    TrainList: TrainList2

}


export interface TrainList2 {



    Train: Train2

}


export interface Train2 {

    attributes: {


        tid: string


        sn: string


        s: number


        dn: string


        d: number


        dep: string


        arr: string


        tn: string


        lt: string

    }


}


export interface HeaderRequestFA {

    attributes: {


        us: string


        pwd: string


        tnr: string


        t: string


        l: string

    }


}


export interface MonitoringRequest {



    Header: HeaderRequestRA

}


export interface MonitoringResponse {



    Header: HeaderResponse


    Error: Error

}


export interface PingRequestFA {



    Header: HeaderRequestFA

}


export interface PingRequestRA {



    Header: HeaderRequestRA

}


export interface PingResponse {



    Header: HeaderResponse


    Error: Error

}
