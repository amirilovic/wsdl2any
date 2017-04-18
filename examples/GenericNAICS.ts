import * as soap from "soap";

export class GenericNAICS {
    private wsdlUrl: string

    constructor(wsdlUrl: string) {
        this.wsdlUrl = wsdlUrl;
    }
    
    public GetNAICSByID(request: GetNAICSByIDOperationRequest): Promise<GetNAICSByIDOperationResponse> {
        return new Promise<GetNAICSByIDOperationResponse>((resolve, reject) => {
            soap.createClient(this.wsdlUrl, {}, (error, client: any) => {
                if(request.Headers) {
                    client.addSoapHeader(request.Headers, null, null);
                }
                client["GetNAICSByID"](request, (error, result: GetNAICSByIDOperationResponse, raw, soapHeaders) => {
                    result.Headers = soapHeaders;
                    resolve(result);
                });
            });
        });
    }
    public GetNAICSByIndustry(request: GetNAICSByIndustryOperationRequest): Promise<GetNAICSByIndustryOperationResponse> {
        return new Promise<GetNAICSByIndustryOperationResponse>((resolve, reject) => {
            soap.createClient(this.wsdlUrl, {}, (error, client: any) => {
                if(request.Headers) {
                    client.addSoapHeader(request.Headers, null, null);
                }
                client["GetNAICSByIndustry"](request, (error, result: GetNAICSByIndustryOperationResponse, raw, soapHeaders) => {
                    result.Headers = soapHeaders;
                    resolve(result);
                });
            });
        });
    }
    public GetNAICSGroupByID(request: GetNAICSGroupByIDOperationRequest): Promise<GetNAICSGroupByIDOperationResponse> {
        return new Promise<GetNAICSGroupByIDOperationResponse>((resolve, reject) => {
            soap.createClient(this.wsdlUrl, {}, (error, client: any) => {
                if(request.Headers) {
                    client.addSoapHeader(request.Headers, null, null);
                }
                client["GetNAICSGroupByID"](request, (error, result: GetNAICSGroupByIDOperationResponse, raw, soapHeaders) => {
                    result.Headers = soapHeaders;
                    resolve(result);
                });
            });
        });
    }
}


export interface GetNAICSByIDType {
    
    $attributes: GetNAICSByIDTypeAttributes
    
    
    NAICSCode: string
    
}

export interface GetNAICSByIDTypeAttributes {
    
}


export interface GetNAICSByIDResponseType {
    
    $attributes: GetNAICSByIDResponseTypeAttributes
    
    
    GetNAICSByIDResult: boolean
    
    
    NAICSData: NAICSList
    
}

export interface GetNAICSByIDResponseTypeAttributes {
    
}


export interface NAICSList {
    
    $attributes: NAICSListAttributes
    
    
    Records: number
    
    
    NAICSData: ArrayOfNAICS
    
}

export interface NAICSListAttributes {
    
}


export interface ArrayOfNAICS {
    
    $attributes: ArrayOfNAICSAttributes
    
    
    NAICS: Array<NAICS>
    
}

export interface ArrayOfNAICSAttributes {
    
}


export interface NAICS {
    
    $attributes: NAICSAttributes
    
    
    NAICSCode: string
    
    
    Title: string
    
    
    Country: string
    
    
    IndustryDescription: string
    
}

export interface NAICSAttributes {
    
}


export interface GetNAICSByIndustryType {
    
    $attributes: GetNAICSByIndustryTypeAttributes
    
    
    IndustryName: string
    
}

export interface GetNAICSByIndustryTypeAttributes {
    
}


export interface GetNAICSByIndustryResponseType {
    
    $attributes: GetNAICSByIndustryResponseTypeAttributes
    
    
    GetNAICSByIndustryResult: boolean
    
    
    NAICSData: NAICSList
    
}

export interface GetNAICSByIndustryResponseTypeAttributes {
    
}


export interface GetNAICSGroupByIDType {
    
    $attributes: GetNAICSGroupByIDTypeAttributes
    
    
    NAICSCode: string
    
}

export interface GetNAICSGroupByIDTypeAttributes {
    
}


export interface GetNAICSGroupByIDResponseType {
    
    $attributes: GetNAICSGroupByIDResponseTypeAttributes
    
    
    GetNAICSGroupByIDResult: boolean
    
    
    NAICSData: NAICSList
    
}

export interface GetNAICSGroupByIDResponseTypeAttributes {
    
}


export interface GetNAICSByIDOperationRequestOperationHeaders {
    
    $attributes: GetNAICSByIDOperationRequestOperationHeadersAttributes
    
}

export interface GetNAICSByIDOperationRequestOperationHeadersAttributes {
    
}


export interface GetNAICSByIDOperationRequest {
    
    $attributes: GetNAICSByIDOperationRequestAttributes
    
    
    GetNAICSByID: GetNAICSByIDType
    
    
    Headers: GetNAICSByIDOperationRequestOperationHeaders
    
}

export interface GetNAICSByIDOperationRequestAttributes {
    
}


export interface GetNAICSByIDOperationResponseOperationHeaders {
    
    $attributes: GetNAICSByIDOperationResponseOperationHeadersAttributes
    
}

export interface GetNAICSByIDOperationResponseOperationHeadersAttributes {
    
}


export interface GetNAICSByIDOperationResponse {
    
    $attributes: GetNAICSByIDOperationResponseAttributes
    
    
    GetNAICSByIDResponse: GetNAICSByIDResponseType
    
    
    Headers: GetNAICSByIDOperationResponseOperationHeaders
    
}

export interface GetNAICSByIDOperationResponseAttributes {
    
}


export interface GetNAICSByIndustryOperationRequestOperationHeaders {
    
    $attributes: GetNAICSByIndustryOperationRequestOperationHeadersAttributes
    
}

export interface GetNAICSByIndustryOperationRequestOperationHeadersAttributes {
    
}


export interface GetNAICSByIndustryOperationRequest {
    
    $attributes: GetNAICSByIndustryOperationRequestAttributes
    
    
    GetNAICSByIndustry: GetNAICSByIndustryType
    
    
    Headers: GetNAICSByIndustryOperationRequestOperationHeaders
    
}

export interface GetNAICSByIndustryOperationRequestAttributes {
    
}


export interface GetNAICSByIndustryOperationResponseOperationHeaders {
    
    $attributes: GetNAICSByIndustryOperationResponseOperationHeadersAttributes
    
}

export interface GetNAICSByIndustryOperationResponseOperationHeadersAttributes {
    
}


export interface GetNAICSByIndustryOperationResponse {
    
    $attributes: GetNAICSByIndustryOperationResponseAttributes
    
    
    GetNAICSByIndustryResponse: GetNAICSByIndustryResponseType
    
    
    Headers: GetNAICSByIndustryOperationResponseOperationHeaders
    
}

export interface GetNAICSByIndustryOperationResponseAttributes {
    
}


export interface GetNAICSGroupByIDOperationRequestOperationHeaders {
    
    $attributes: GetNAICSGroupByIDOperationRequestOperationHeadersAttributes
    
}

export interface GetNAICSGroupByIDOperationRequestOperationHeadersAttributes {
    
}


export interface GetNAICSGroupByIDOperationRequest {
    
    $attributes: GetNAICSGroupByIDOperationRequestAttributes
    
    
    GetNAICSGroupByID: GetNAICSGroupByIDType
    
    
    Headers: GetNAICSGroupByIDOperationRequestOperationHeaders
    
}

export interface GetNAICSGroupByIDOperationRequestAttributes {
    
}


export interface GetNAICSGroupByIDOperationResponseOperationHeaders {
    
    $attributes: GetNAICSGroupByIDOperationResponseOperationHeadersAttributes
    
}

export interface GetNAICSGroupByIDOperationResponseOperationHeadersAttributes {
    
}


export interface GetNAICSGroupByIDOperationResponse {
    
    $attributes: GetNAICSGroupByIDOperationResponseAttributes
    
    
    GetNAICSGroupByIDResponse: GetNAICSGroupByIDResponseType
    
    
    Headers: GetNAICSGroupByIDOperationResponseOperationHeaders
    
}

export interface GetNAICSGroupByIDOperationResponseAttributes {
    
}
