import * as soap from "soap";

export class CurrencyConvertor {
    private wsdlUrl: string

    constructor(wsdlUrl: string) {
        this.wsdlUrl = wsdlUrl;
    }
    
    public ConversionRate(request: ConversionRateOperationRequest): Promise<ConversionRateOperationResponse> {
        return new Promise<ConversionRateOperationResponse>((resolve, reject) => {
            soap.createClient(this.wsdlUrl, {}, (error, client: any) => {
                if(request.Headers) {
                    client.addSoapHeader(request.Headers, null, null);
                }
                client["ConversionRate"](request.Body, (error, result, raw, soapHeaders) => {
                    if(error) {
                        reject(error);
                        return;
                    }
                    let response = { Headers: soapHeaders, Body: result };
                    resolve(response as ConversionRateOperationResponse);
                });
            });
        });
    }
}


export interface ConversionRateType {
    
    $attributes: ConversionRateTypeAttributes
    
    
    FromCurrency: string
    
    
    ToCurrency: string
    
}

export interface ConversionRateTypeAttributes {
    
}


export interface ConversionRateResponseType {
    
    $attributes: ConversionRateResponseTypeAttributes
    
    
    ConversionRateResult: number
    
}

export interface ConversionRateResponseTypeAttributes {
    
}


export interface ConversionRateOperationRequestOperationHeaders {
    
    $attributes: ConversionRateOperationRequestOperationHeadersAttributes
    
}

export interface ConversionRateOperationRequestOperationHeadersAttributes {
    
}


export interface ConversionRateOperationRequest {
    
    $attributes: ConversionRateOperationRequestAttributes
    
    
    Body: ConversionRateType
    
    
    Headers: ConversionRateOperationRequestOperationHeaders
    
}

export interface ConversionRateOperationRequestAttributes {
    
}


export interface ConversionRateOperationResponseOperationHeaders {
    
    $attributes: ConversionRateOperationResponseOperationHeadersAttributes
    
}

export interface ConversionRateOperationResponseOperationHeadersAttributes {
    
}


export interface ConversionRateOperationResponse {
    
    $attributes: ConversionRateOperationResponseAttributes
    
    
    Body: ConversionRateResponseType
    
    
    Headers: ConversionRateOperationResponseOperationHeaders
    
}

export interface ConversionRateOperationResponseAttributes {
    
}
