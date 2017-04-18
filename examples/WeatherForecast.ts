import * as soap from "soap";

export class WeatherForecast {
    private wsdlUrl: string

    constructor(wsdlUrl: string) {
        this.wsdlUrl = wsdlUrl;
    }
    
    public GetWeatherByZipCode(request: GetWeatherByZipCodeOperationRequest): Promise<GetWeatherByZipCodeOperationResponse> {
        return new Promise<GetWeatherByZipCodeOperationResponse>((resolve, reject) => {
            soap.createClient(this.wsdlUrl, {}, (error, client: any) => {
                if(request.Headers) {
                    client.addSoapHeader(request.Headers, null, null);
                }
                client["GetWeatherByZipCode"](request, (error, result: GetWeatherByZipCodeOperationResponse, raw, soapHeaders) => {
                    result.Headers = soapHeaders;
                    resolve(result);
                });
            });
        });
    }
    public GetWeatherByPlaceName(request: GetWeatherByPlaceNameOperationRequest): Promise<GetWeatherByPlaceNameOperationResponse> {
        return new Promise<GetWeatherByPlaceNameOperationResponse>((resolve, reject) => {
            soap.createClient(this.wsdlUrl, {}, (error, client: any) => {
                if(request.Headers) {
                    client.addSoapHeader(request.Headers, null, null);
                }
                client["GetWeatherByPlaceName"](request, (error, result: GetWeatherByPlaceNameOperationResponse, raw, soapHeaders) => {
                    result.Headers = soapHeaders;
                    resolve(result);
                });
            });
        });
    }
}


export interface GetWeatherByZipCodeType {
    
    $attributes: GetWeatherByZipCodeTypeAttributes
    
    
    ZipCode: string
    
}

export interface GetWeatherByZipCodeTypeAttributes {
    
}


export interface GetWeatherByZipCodeResponseType {
    
    $attributes: GetWeatherByZipCodeResponseTypeAttributes
    
    
    GetWeatherByZipCodeResult: WeatherForecasts
    
}

export interface GetWeatherByZipCodeResponseTypeAttributes {
    
}


export interface WeatherForecasts {
    
    $attributes: WeatherForecastsAttributes
    
    
    Latitude: number
    
    
    Longitude: number
    
    
    AllocationFactor: number
    
    
    FipsCode: string
    
    
    PlaceName: string
    
    
    StateCode: string
    
    
    Status: string
    
    
    Details: ArrayOfWeatherData
    
}

export interface WeatherForecastsAttributes {
    
}


export interface ArrayOfWeatherData {
    
    $attributes: ArrayOfWeatherDataAttributes
    
    
    WeatherData: Array<WeatherData>
    
}

export interface ArrayOfWeatherDataAttributes {
    
}


export interface WeatherData {
    
    $attributes: WeatherDataAttributes
    
    
    Day: string
    
    
    WeatherImage: string
    
    
    MaxTemperatureF: string
    
    
    MinTemperatureF: string
    
    
    MaxTemperatureC: string
    
    
    MinTemperatureC: string
    
}

export interface WeatherDataAttributes {
    
}


export interface GetWeatherByPlaceNameType {
    
    $attributes: GetWeatherByPlaceNameTypeAttributes
    
    
    PlaceName: string
    
}

export interface GetWeatherByPlaceNameTypeAttributes {
    
}


export interface GetWeatherByPlaceNameResponseType {
    
    $attributes: GetWeatherByPlaceNameResponseTypeAttributes
    
    
    GetWeatherByPlaceNameResult: WeatherForecasts
    
}

export interface GetWeatherByPlaceNameResponseTypeAttributes {
    
}


export interface GetWeatherByZipCodeOperationRequestOperationHeaders {
    
    $attributes: GetWeatherByZipCodeOperationRequestOperationHeadersAttributes
    
}

export interface GetWeatherByZipCodeOperationRequestOperationHeadersAttributes {
    
}


export interface GetWeatherByZipCodeOperationRequest {
    
    $attributes: GetWeatherByZipCodeOperationRequestAttributes
    
    
    GetWeatherByZipCode: GetWeatherByZipCodeType
    
    
    Headers: GetWeatherByZipCodeOperationRequestOperationHeaders
    
}

export interface GetWeatherByZipCodeOperationRequestAttributes {
    
}


export interface GetWeatherByZipCodeOperationResponseOperationHeaders {
    
    $attributes: GetWeatherByZipCodeOperationResponseOperationHeadersAttributes
    
}

export interface GetWeatherByZipCodeOperationResponseOperationHeadersAttributes {
    
}


export interface GetWeatherByZipCodeOperationResponse {
    
    $attributes: GetWeatherByZipCodeOperationResponseAttributes
    
    
    GetWeatherByZipCodeResponse: GetWeatherByZipCodeResponseType
    
    
    Headers: GetWeatherByZipCodeOperationResponseOperationHeaders
    
}

export interface GetWeatherByZipCodeOperationResponseAttributes {
    
}


export interface GetWeatherByPlaceNameOperationRequestOperationHeaders {
    
    $attributes: GetWeatherByPlaceNameOperationRequestOperationHeadersAttributes
    
}

export interface GetWeatherByPlaceNameOperationRequestOperationHeadersAttributes {
    
}


export interface GetWeatherByPlaceNameOperationRequest {
    
    $attributes: GetWeatherByPlaceNameOperationRequestAttributes
    
    
    GetWeatherByPlaceName: GetWeatherByPlaceNameType
    
    
    Headers: GetWeatherByPlaceNameOperationRequestOperationHeaders
    
}

export interface GetWeatherByPlaceNameOperationRequestAttributes {
    
}


export interface GetWeatherByPlaceNameOperationResponseOperationHeaders {
    
    $attributes: GetWeatherByPlaceNameOperationResponseOperationHeadersAttributes
    
}

export interface GetWeatherByPlaceNameOperationResponseOperationHeadersAttributes {
    
}


export interface GetWeatherByPlaceNameOperationResponse {
    
    $attributes: GetWeatherByPlaceNameOperationResponseAttributes
    
    
    GetWeatherByPlaceNameResponse: GetWeatherByPlaceNameResponseType
    
    
    Headers: GetWeatherByPlaceNameOperationResponseOperationHeaders
    
}

export interface GetWeatherByPlaceNameOperationResponseAttributes {
    
}
