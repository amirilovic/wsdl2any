export interface WSDReiseAuskunftInterface {
    
        angebotssuche(request: AngebotssucheRequest): AngebotssucheResponse 
        Angebotsdetails(request: AngebotsdetailsRequest): AngebotsdetailsResponse 
        Ping(request: PingRequestRA): PingResponse 
        Monitoring(request: MonitoringRequest): MonitoringResponse 
}


export interface AngebotsdetailsRequest {
    
    $attributes: AngebotsdetailsRequestAttributes
    
    
    Header: HeaderRequestRA
    
    
    RequestData: RequestData
    
}

export interface AngebotsdetailsRequestAttributes {
    
}


export interface HeaderRequestRA {
    
    $attributes: HeaderRequestRAAttributes
    
}

export interface HeaderRequestRAAttributes {
    
    
    us: string
    
    
    sig: string
    
    
    tnr: string
    
    
    t: string
    
    
    l: string
    
}


export interface RequestData {
    
    $attributes: RequestDataAttributes
    
    
    TariffIdentificationH: TariffIdentification
    
    
    TariffIdentificationR: Array<TariffIdentification>
    
    
    TravelerList: TravelerList
    
    
    ScheduleH: Schedule
    
    
    ScheduleR: Array<Schedule>
    
}

export interface RequestDataAttributes {
    
    
    ot: string
    
    
    bmis: number
    
}


export interface TariffIdentification {
    
    $attributes: TariffIdentificationAttributes
    
}

export interface TariffIdentificationAttributes {
    
    
    t: string
    
    
    c: string
    
}


export interface TravelerList {
    
    $attributes: TravelerListAttributes
    
    
    Traveler: Array<Traveler>
    
}

export interface TravelerListAttributes {
    
}


export interface Traveler {
    
    $attributes: TravelerAttributes
    
}

export interface TravelerAttributes {
    
    
    age: number
    
    
    r: string
    
}


export interface Schedule {
    
    $attributes: ScheduleAttributes
    
    
    TrainList: TrainList
    
}

export interface ScheduleAttributes {
    
    
    sid: string
    
    
    dt: string
    
}


export interface TrainList {
    
    $attributes: TrainListAttributes
    
    
    Train: Array<Train>
    
}

export interface TrainListAttributes {
    
}


export interface Train {
    
    $attributes: TrainAttributes
    
}

export interface TrainAttributes {
    
    
    tid: string
    
    
    s: number
    
    
    d: number
    
    
    dep: string
    
    
    arr: string
    
    
    tn: string
    
    
    lt: string
    
}


export interface AngebotsdetailsResponse {
    
    $attributes: AngebotsdetailsResponseAttributes
    
    
    Header: HeaderResponse
    
    
    Error: Array<Error>
    
    
    ResponseData: Array<ResponseData>
    
}

export interface AngebotsdetailsResponseAttributes {
    
}


export interface HeaderResponse {
    
    $attributes: HeaderResponseAttributes
    
}

export interface HeaderResponseAttributes {
    
    
    tnr: string
    
    
    t: string
    
}


export interface Error {
    
    $attributes: ErrorAttributes
    
}

export interface ErrorAttributes {
    
    
    nr: string
    
    
    txt: string
    
    
    sev: string
    
}


export interface ResponseData {
    
    $attributes: ResponseDataAttributes
    
    
    OfferDetails: OfferDetails
    
    
    ScheduleH: Schedule1
    
    
    ScheduleR: Array<Schedule1>
    
}

export interface ResponseDataAttributes {
    
}


export interface OfferDetails {
    
    $attributes: OfferDetailsAttributes
    
    
    TariffIdentificationH: TariffIdentification1
    
    
    TariffIdentificationR: Array<TariffIdentification1>
    
    
    TravelerList: TravelerList
    
    
    OfferSegList: OfferSegmentList
    
    
    SeatResH: Array<SeatReservation>
    
    
    SeatResR: Array<SeatReservation>
    
}

export interface OfferDetailsAttributes {
    
    
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


export interface TariffIdentification1 {
    
    $attributes: TariffIdentification1Attributes
    
}

export interface TariffIdentification1Attributes {
    
    
    t: string
    
    
    c: string
    
}


export interface OfferSegmentList {
    
    $attributes: OfferSegmentListAttributes
    
    
    OfferSeg: Array<OfferSegment>
    
}

export interface OfferSegmentListAttributes {
    
}


export interface OfferSegment {
    
    $attributes: OfferSegmentAttributes
    
}

export interface OfferSegmentAttributes {
    
    
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


export interface SeatReservation {
    
    $attributes: SeatReservationAttributes
    
    
    RefTrain: Array<RefTrain>
    
}

export interface SeatReservationAttributes {
    
    
    p: number
    
}


export interface RefTrain {
    
    $attributes: RefTrainAttributes
    
}

export interface RefTrainAttributes {
    
    
    tid: string
    
}


export interface Schedule1 {
    
    $attributes: Schedule1Attributes
    
    
    TrainList: TrainList1
    
}

export interface Schedule1Attributes {
    
    
    sid: string
    
    
    dt: string
    
    
    dur: string
    
    
    nt: number
    
    
    pr: string
    
}


export interface TrainList1 {
    
    $attributes: TrainList1Attributes
    
    
    Train: Array<Train1>
    
}

export interface TrainList1Attributes {
    
}


export interface Train1 {
    
    $attributes: Train1Attributes
    
}

export interface Train1Attributes {
    
    
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


export interface AngebotssucheRequest {
    
    $attributes: AngebotssucheRequestAttributes
    
    
    Header: HeaderRequestRA
    
    
    RequestData: RequestData1
    
}

export interface AngebotssucheRequestAttributes {
    
}


export interface RequestData1 {
    
    $attributes: RequestData1Attributes
    
    
    DateTimeH: DateTime
    
    
    DateTimeR: Array<DateTime>
    
    
    TravelerList: TravelerList
    
}

export interface RequestData1Attributes {
    
    
    s: number
    
    
    d: number
    
    
    c: string
    
    
    bmis: number
    
    
    dc: string
    
    
    coc: string
    
}


export interface DateTime {
    
    $attributes: DateTimeAttributes
    
    
    SearchPeriod: Array<SearchPeriod>
    
}

export interface DateTimeAttributes {
    
    
    d: string
    
}


export interface SearchPeriod {
    
    $attributes: SearchPeriodAttributes
    
}

export interface SearchPeriodAttributes {
    
    
    t: string
    
    
    dur: number
    
}


export interface AngebotssucheResponse {
    
    $attributes: AngebotssucheResponseAttributes
    
    
    Header: HeaderResponse
    
    
    Error: Array<Error>
    
    
    ResponseData: Array<ResponseData1>
    
}

export interface AngebotssucheResponseAttributes {
    
}


export interface ResponseData1 {
    
    $attributes: ResponseData1Attributes
    
    
    Offers: Array<Offers>
    
    
    ScheduleResult: ScheduleResult
    
}

export interface ResponseData1Attributes {
    
    
    post: number
    
}


export interface Offers {
    
    $attributes: OffersAttributes
    
    
    Offer: Array<Offer>
    
}

export interface OffersAttributes {
    
    
    dir: string
    
}


export interface Offer {
    
    $attributes: OfferAttributes
    
    
    RefSchedule: Array<RefSchedule>
    
}

export interface OfferAttributes {
    
    
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


export interface RefSchedule {
    
    $attributes: RefScheduleAttributes
    
}

export interface RefScheduleAttributes {
    
    
    sid: string
    
}


export interface ScheduleResult {
    
    $attributes: ScheduleResultAttributes
    
    
    Schedule: Array<Schedule2>
    
}

export interface ScheduleResultAttributes {
    
}


export interface Schedule2 {
    
    $attributes: Schedule2Attributes
    
    
    TrainList: TrainList2
    
}

export interface Schedule2Attributes {
    
    
    dir: string
    
    
    sid: string
    
    
    dt: string
    
    
    dur: string
    
    
    nt: number
    
    
    pr: string
    
}


export interface TrainList2 {
    
    $attributes: TrainList2Attributes
    
    
    Train: Array<Train2>
    
}

export interface TrainList2Attributes {
    
}


export interface Train2 {
    
    $attributes: Train2Attributes
    
}

export interface Train2Attributes {
    
    
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


export interface HeaderRequestFA {
    
    $attributes: HeaderRequestFAAttributes
    
}

export interface HeaderRequestFAAttributes {
    
    
    us: string
    
    
    pwd: string
    
    
    tnr: string
    
    
    t: string
    
    
    l: string
    
}


export interface MonitoringRequest {
    
    $attributes: MonitoringRequestAttributes
    
    
    Header: HeaderRequestRA
    
}

export interface MonitoringRequestAttributes {
    
}


export interface MonitoringResponse {
    
    $attributes: MonitoringResponseAttributes
    
    
    Header: HeaderResponse
    
    
    Error: Array<Error>
    
}

export interface MonitoringResponseAttributes {
    
}


export interface PingRequestFA {
    
    $attributes: PingRequestFAAttributes
    
    
    Header: HeaderRequestFA
    
}

export interface PingRequestFAAttributes {
    
}


export interface PingRequestRA {
    
    $attributes: PingRequestRAAttributes
    
    
    Header: HeaderRequestRA
    
}

export interface PingRequestRAAttributes {
    
}


export interface PingResponse {
    
    $attributes: PingResponseAttributes
    
    
    Header: HeaderResponse
    
    
    Error: Array<Error>
    
}

export interface PingResponseAttributes {
    
}
