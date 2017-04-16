import * as xpath from 'xpath'
import * as dom from 'xmldom'


var promisify = require("promisify-node");
var fs = promisify('fs')

interface PropertyGroupMap {
    [s: string]: PropertyGroup
}

interface PropertyGroup {
    id?: string
    properties?: Array<PropertyDescription>
}

export interface OperationDescription {
    name?: string
    input?: string
    output?: string
}

export interface ContractDescription {
    name?: string
    operations?: Array<OperationDescription>
}

export interface TypeDescription {
    name: string
    namespace: string
    complex: boolean
    properties: Array<PropertyDescription>
    globalName?: string
    extends?: string
    documentation?: string
}

export interface PropertyDescription {
    name?: string
    type?: string
    documentation?: string
    attribute?: boolean
    array?: boolean
}

export interface ServiceDescription {
    name?: string
    contracts?: Array<ContractDescription>
    types?: Array<TypeDescription>
    namespaces?: { [name: string]: string }
}

const WSDL_NS_URI = "http://schemas.xmlsoap.org/wsdl/";
const SOAP_NS_URI = "http://schemas.xmlsoap.org/wsdl/soap/";
const XS_NS_URI = "http://www.w3.org/2001/XMLSchema";

export class WsdlParser {
    private filePath: string
    private doc: Document
    private select: xpath.XPathSelect
    private namespaceMap: { [name: string]: string }

    constructor(wsdlPath: string) {
        this.filePath = wsdlPath;
    }

    async init() {
        let contents = await this.getWSDLContent(this.filePath);
        this.doc = new dom.DOMParser().parseFromString(contents);
        this.select = xpath.useNamespaces({
            "wsdl": WSDL_NS_URI,
            "soap": SOAP_NS_URI,
            "xs": XS_NS_URI
        });
    }

    async getWSDLContent(filePath: string): Promise<any> {
        return await fs.readFile(filePath, 'utf8');
    }

    service(): ServiceDescription {
        let n = this.select('/wsdl:definitions/wsdl:service', this.doc, true) as Element;
        let sd: ServiceDescription = {
            name: n.getAttribute("name"),
            namespaces: this.getNamespaces(this.doc)
        };
        let typeRegistry = new TypeRegistry(sd.namespaces);
        this.processTypes(typeRegistry);
        sd.contracts = this.contracts(sd.name, typeRegistry);
        sd.types = typeRegistry.complexTypes();
        return sd;
    }

    private contracts(serviceName: string, typeRegistry: TypeRegistry): Array<ContractDescription> {
        let cds = new Array<ContractDescription>();
        let nodes = this.select(`/wsdl:definitions/wsdl:service[@name='${serviceName}']/wsdl:port`, this.doc);

        nodes.forEach((n: Element) => {

            let bindingName = n.getAttribute('binding').split(':')[1];
            let bindingNode = this.select(`/wsdl:definitions/wsdl:binding[@name='${bindingName}']`, this.doc, true) as Element;
            let portTypeName = bindingNode.getAttribute('type').split(':')[1];

            let cd: ContractDescription = {
                name: portTypeName
            };
            cd.operations = this.operations(cd.name, bindingName, typeRegistry);
            cds.push(cd)
        });

        return cds;
    }

    private operations(contractName: string, bindingName: string, typeRegistry: TypeRegistry): Array<OperationDescription> {
        let ods = new Array<OperationDescription>();
        let nodes = this.select(`/wsdl:definitions/wsdl:portType[@name='${contractName}']/wsdl:operation`, this.doc);

        nodes.forEach((n: Element) => {
            let operation: OperationDescription = {
                name: n.getAttribute("name")
            };

            let inputTypes = this.createOperationType(contractName, bindingName, operation.name, typeRegistry, 'input');
            let outputTypes = this.createOperationType(contractName, bindingName, operation.name, typeRegistry, 'output');

            operation.input = inputTypes[0].globalName;
            operation.output = outputTypes[0].globalName;
            ods.push(operation);
        });

        return ods;
    }

    private createOperationType(contractName: string, bindingName: string, operationName: string, typeRegistry: TypeRegistry, messageType: 'input' | 'output'): Array<TypeDescription> {
        let types: Array<TypeDescription> = [];
        let el = this.select(`/wsdl:definitions/wsdl:portType[@name='${contractName}']/wsdl:operation[@name='${operationName}']/wsdl:${messageType}`, this.doc, true) as Element;
        let messageName = el.getAttribute('message').split(':')[1];
        let [propertyName, itd] = this.getMessageType(messageName, typeRegistry);
        let headers = (this.select(`/wsdl:definitions/wsdl:binding[@name='${bindingName}']/wsdl:operation[@name='${operationName}']/wsdl:${messageType}/soap:header`, this.doc));
        let type: TypeDescription = {
            name: operationName + (messageType == 'input' ? 'Request' : 'Response'),
            namespace: this.findTargetNamespace(el),
            complex: true,
            properties: []
        };

        type.properties.push({
            name: propertyName,
            type: itd.globalName
        });

        let typeHeader: TypeDescription = {
            name: type.name + 'Header',
            namespace: this.findTargetNamespace(el),
            complex: true,
            properties: []
        };

        headers.forEach((h: Element) => {
            let headerMessageName = h.getAttribute('message').split(':')[1];
            let [propertyName, hdt] = this.getMessageType(headerMessageName, typeRegistry);
            typeHeader.properties.push({
                name: propertyName,
                type: hdt.globalName
            });
        });

        typeRegistry.add(typeHeader);

        type.properties.push({
            name: 'Header',
            type: typeHeader.globalName
        });
        
        typeRegistry.add(type);

        types.push(type, typeHeader)

        return types;
    }

    private getMessageType(name: string, typeRegistry: TypeRegistry): [string, TypeDescription] {
        let el = this.select(`/wsdl:definitions/wsdl:message[@name='${name}']`, this.doc, true) as Element;
        let bodyElName = (this.select(`/wsdl:definitions/wsdl:message[@name='${name}']/wsdl:part/@element`, this.doc, true) as Attr).value;
        let [ns, t] = this.resolveSchemaType(el, bodyElName);
        let bodyEl = this.getTypeEl(ns, t);
        let td = this.processElement(bodyEl, null, null, typeRegistry);
        return [t, td];
    }



    private getNamespaces(doc: Document): { [name: string]: string } {
        let ns: { [name: string]: string } = {};

        let attrs = Array.prototype.slice.call((this.select('/wsdl:definitions', doc, true) as Element).attributes);

        attrs.forEach((a: Attr) => {
            if (a.prefix == 'xmlns') {
                ns[a.value] = a.localName;
            }
        });

        return ns;
    }

    private processTypes(typeRegistry: TypeRegistry): Array<TypeDescription> {
        let schemaEls = this.select('/wsdl:definitions/wsdl:types/xs:schema', this.doc);

        console.log(`Schemas to process: ${schemaEls.length}`);

        let i = 1;

        let start = (new Date()).getTime();

        schemaEls.forEach((n) => {
            let sEl = n as Element;
            let start = (new Date()).getTime();
            console.log(`Processing schema #${i}. TargetNamespace=${sEl.getAttribute('targetNamespace')}...`);
            this.processSchema(sEl, typeRegistry);
            let end = (new Date()).getTime();

            console.log(`Done in: ${(end - start) / 1000}s`);
            i++;
        });

        let end = (new Date()).getTime();

        console.log(`Total Done in: ${(end - start) / 1000}s`);

        return typeRegistry.complexTypes();
    }

    private processSchema(el: Element, typeRegistry: TypeRegistry) {
        let nodes = Array.prototype.slice.call(el.childNodes);
        let propertyGroups: PropertyGroupMap = {};

        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:complexType') {
                    this.processComplexType(cEl, propertyGroups, typeRegistry);
                }
                else if (cEl.tagName == 'xs:simpleType') {
                    this.processSimpleType(cEl, typeRegistry);
                }
                else if (cEl.tagName == 'xs:element') {
                    this.processElement(cEl, null, propertyGroups, typeRegistry);
                }
                else if (cEl.tagName == 'xs:attributeGroup') {
                    let pg = this.processAttributeGroup(cEl, typeRegistry);
                    propertyGroups[pg.id] = pg;
                }
            }
        });
    }

    private processAttributeGroup(el: Element, typeRegistry: TypeRegistry): PropertyGroup {
        let pg: PropertyGroup = {
            id: el.getAttribute('id'),
            properties: []
        }

        let nodes = Array.prototype.slice.call(el.childNodes);
        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:attribute') {
                    pg.properties.push(this.processAttribute(cEl, typeRegistry));
                }
            }
        });

        return pg;
    }

    private processComplexType(el: Element, propertyGroups: PropertyGroupMap, typeRegistry: TypeRegistry): TypeDescription {

        let namespace = this.findTargetNamespace(el);
        let name = this.createTypeName(el);

        let td = typeRegistry.lookup(namespace, name);

        if (td) {
            return td;
        }

        let nodes = Array.prototype.slice.call(el.childNodes);

        td = {
            name: name,
            complex: true,
            namespace: namespace,
            properties: [],
            documentation: this.getElDocs(el)
        };

        typeRegistry.add(td);

        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:sequence' || cEl.tagName == 'xs:all') {
                    this.processSequence(cEl, td, propertyGroups, typeRegistry)
                }
                else if (cEl.tagName == 'xs:complexContent') {
                    this.processComplexContent(cEl, td, propertyGroups, typeRegistry)
                }
                else if (cEl.tagName == 'xs:simpleContent') {
                    td.properties.push({
                        name: '_content',
                        type: 'any'
                    });
                }
                else if (cEl.tagName == 'xs:attribute') {
                    let pd = this.processAttribute(cEl, typeRegistry);
                    td.properties.push(pd);
                }
                else if (cEl.tagName == 'xs:attributeGroup') {
                    let agRef = cEl.getAttribute('ref');
                    let pg = this.ensurePropertyGroup(el, agRef, propertyGroups, typeRegistry);
                    td.properties = td.properties.concat(pg.properties);
                }
            }
        });

        return td;
    }

    private ensurePropertyGroup(el: Element, agRef: string, propertyGroups: PropertyGroupMap, typeRegistry: TypeRegistry): PropertyGroup {
        let propertyGroup = propertyGroups[agRef];

        if (!propertyGroup) {
            let [ns, t] = this.resolveSchemaType(el, agRef);
            let agEl = this.getAttributeGroupEl(ns, t);
            propertyGroup = this.processAttributeGroup(agEl, typeRegistry);
        }

        return propertyGroup;
    }

    private processSimpleType(el: Element, typeRegistry: TypeRegistry): TypeDescription {

        let namespace = this.findTargetNamespace(el);
        let name = this.createTypeName(el);

        let td = typeRegistry.lookup(namespace, name);

        if (td) {
            return td;
        }

        let [ns, t] = this.getSimpleTypeRoot(el);
        td = {
            name: name,
            namespace: namespace,
            complex: false,
            properties: []
        };

        typeRegistry.add(td);
        td.globalName = typeRegistry.lookup(ns, t).globalName;
        return td;
    }

    private createTypeName(el: Element): string {
        let name = el.getAttribute('name');

        if (!name) {
            let parentEl = el.parentNode as Element;
            name = parentEl.getAttribute('name') + 'Type'
        }

        if (el.tagName == 'xs:simpleType') {
            name += 'Simple'
        }

        return name;

    }

    private findTargetNamespace(el: Element): string {
        let tns = el ? el.getAttribute('targetNamespace') || this.findTargetNamespace(el.parentNode as Element) : undefined;

        if (!tns) {
            throw new Error('Target namespace not found.');
        }

        return tns;
    }

    private getSimpleTypeRoot(el: Element): Array<string> {
        if (!el || el.tagName != 'xs:simpleType') {
            throw Error('Element not xs:simpleType');
        }

        let ns, t: string;

        var nodes = Array.prototype.slice.call(el.childNodes);
        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:restriction') {
                    let base = cEl.getAttribute('base');

                    if (!base) {
                        throw new Error('Base not specified for xs:simpleType');
                    }

                    [ns, t] = this.resolveSchemaType(cEl, base);
                    if (ns != XS_NS_URI) {
                        let el = this.getTypeEl(ns, t);
                        [ns, t] = this.getSimpleTypeRoot(el);
                    }
                }
                else if (cEl.tagName == 'xs:union') {
                    [ns, t] = [XS_NS_URI, 'string'];
                }
                else if (cEl.tagName == 'xs:list') {
                    [ns, t] = [XS_NS_URI, 'string'];
                }
            }
        });

        if (!ns || !t) {
            throw new Error('Could not process xs:simpleType');
        }

        return [ns, t];
    }

    private processAttribute(el: Element, typeRegistry: TypeRegistry): PropertyDescription {
        let pd: PropertyDescription = {
            name: el.getAttribute('name'),
            type: el.getAttribute('type'),
            attribute: true
        }

        if (!pd.type) {
            var nodes = Array.prototype.slice.call(el.childNodes);
            nodes.forEach((n: Node) => {
                if (n.nodeType == 1) {
                    let cEl = n as Element;
                    if (cEl.tagName == 'xs:simpleType') {
                        let td = this.processSimpleType(cEl, typeRegistry);
                        pd.type = td.globalName;
                    }
                }
            });
        }
        else {
            let [ns, t] = this.resolveSchemaType(el, pd.type);
            let td = this.ensureInTypeRegistry(ns, t, null, typeRegistry)
            pd.type = td.globalName;
            pd.documentation = this.getElDocs(el);
        }

        if (!pd.type) {
            throw new Error('Attribute type not resolved!');
        }

        pd.name = this.formatFieldName(pd.name);

        return pd;
    }

    private formatFieldName(name: string) {
        return name.replace(/\.|\s/g, '');
    }

    private getElDocs(el: Element) {
        let docs: string;
        let docEl = this.elChild(this.elChild(el, 'xs:annotation'), 'xs:documentation');
        if (docEl) {
            docs = docEl.textContent.replace(/\r?\n|\r/g, ' ').replace(/\s\s+/g, ' ');
        }
        return docs;
    }

    private processElement(el: Element, typeDescription: TypeDescription, propertyGroups: PropertyGroupMap, typeRegistry: TypeRegistry): TypeDescription {

        let name = el.getAttribute('name');
        let lookupType = el.getAttribute('ref') || el.getAttribute('type');
        let td: TypeDescription;

        if (lookupType) {
            let [ns, t] = this.resolveSchemaType(el, lookupType);
            td = this.ensureInTypeRegistry(ns, t, propertyGroups, typeRegistry);
        }

        let nodes = Array.prototype.slice.call(el.childNodes);
        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:complexType') {
                    td = this.processComplexType(cEl, propertyGroups, typeRegistry);
                }
                else if (cEl.tagName == 'xs:simpleType') {
                    td = this.processSimpleType(cEl, typeRegistry);
                }
            }
        });

        if (!td) {
            console.warn(`Could not resolve element: ${name} type.`);
            td = typeRegistry.lookup(XS_NS_URI, 'string');
        }

        if (typeDescription) {
            let pd: PropertyDescription = {
                name: name,
                type: td.globalName,
                documentation: this.getElDocs(el),
                array: this.isElArray(el)
            }

            if (!pd.name) {
                pd.name = pd.type + typeDescription.properties.length;
            }

            pd.name = this.formatFieldName(pd.name);

            typeDescription.properties.push(pd);
        }

        return td;
    }

    private isElArray(el: Element): boolean {
        let minOccurs = parseInt(el.getAttribute('minOccurs'));
        let maxOccurs = parseInt(el.getAttribute('maxOccurs'));

        return maxOccurs > 1 || (!isNaN(minOccurs) && isNaN(maxOccurs))
    }

    private processSequence(el: Element, typeDescription: TypeDescription, propertyGroups: PropertyGroupMap, typeRegistry: TypeRegistry) {
        var nodes = Array.prototype.slice.call(el.childNodes);

        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:element') {
                    this.processElement(cEl, typeDescription, propertyGroups, typeRegistry);
                }
            }
        });
    }

    private processComplexContent(el: Element, typeDescription: TypeDescription, propertyGroups: PropertyGroupMap, typeRegistry: TypeRegistry) {
        var nodes = Array.prototype.slice.call(el.childNodes);

        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:extension') {
                    this.processExtension(cEl, typeDescription, propertyGroups, typeRegistry);
                }
                else if (cEl.tagName == 'xs:sequence' || cEl.tagName == 'xs:all') {
                    this.processSequence(cEl, typeDescription, propertyGroups, typeRegistry);
                }
            }
        });
    }

    private processExtension(el: Element, typeDescription: TypeDescription, propertyGroups: PropertyGroupMap, typeRegistry: TypeRegistry) {
        let nodes = Array.prototype.slice.call(el.childNodes);

        let base = el.getAttribute('base');

        if (base) {
            let [ns, t] = this.resolveSchemaType(el, base);
            let td = this.ensureInTypeRegistry(ns, t, propertyGroups, typeRegistry)
            typeDescription.extends = td.globalName;
        }

        nodes.forEach((n: Node) => {
            if (n.nodeType == 1) {
                let cEl = n as Element;
                if (cEl.tagName == 'xs:sequence' || cEl.tagName == 'xs:all') {
                    this.processSequence(cEl, typeDescription, propertyGroups, typeRegistry);
                }
                else if (cEl.tagName == 'xs:attribute') {
                    let pd = this.processAttribute(cEl, typeRegistry)
                    typeDescription.properties.push(pd);
                }
            }
        });
    }

    private ensureInTypeRegistry(namespace: string, name: string,
        propertyGroups: PropertyGroupMap, typeRegistry: TypeRegistry): TypeDescription {

        let td = typeRegistry.lookup(namespace, name);

        if (td) {
            return td;
        }

        let el = this.getTypeEl(namespace, name);
        if (el.tagName == 'xs:complexType') {
            if (!propertyGroups) {
                throw new Error('Property groups not set for complex type processing.');
            }
            td = this.processComplexType(el, propertyGroups, typeRegistry);
        }
        else if (el.tagName == 'xs:simpleType') {
            td = this.processSimpleType(el, typeRegistry);
        }
        else if (el.tagName == 'xs:element') {
            let elType = el.getAttribute('type');
            if (!elType) {
                throw new Error(':(');
            }
            td = this.processElement(el, null, propertyGroups, typeRegistry)
        }

        if (!td) {
            throw new Error(`Can not ensure type: ${el.tagName}`);
        }

        return td;
    }

    private getTypeEl(namespace: string, name: string): Element {
        let types = ['simpleType', 'complexType', 'element']
        let el: Element;

        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            el = this.select(`/wsdl:definitions/wsdl:types/xs:schema[@targetNamespace='${namespace}']/xs:${type}[@name='${name}']`, this.doc, true) as Element;
            if (el) {
                break;
            }
        }

        if (!el) {
            throw new Error(`Type not found. Namespace: ${namespace}, Name: ${name}`)
        }

        return el;
    }

    private getAttributeGroupEl(namespace: string, name: string): Element {
        let el = this.select(`/wsdl:definitions/wsdl:types/xs:schema[@targetNamespace='${namespace}']/xs:attributeGroup[@name='${name}']`, this.doc, true) as Element;

        if (!el) {
            throw new Error(`Attribute group not found. Namespace: ${namespace}, Name: ${name}`)
        }

        return el;
    }

    private resolveSchemaType(contextEl: Element, type: string): Array<string> {
        let ns: string = this.findTargetNamespace(contextEl);
        let t: string = type;
        let ss = type.split(':')
        if (ss.length == 2) {
            ns = contextEl.lookupNamespaceURI(ss[0])
            t = ss[1];
        }

        return [ns, t];
    }

    private elChildren(el: Element, tagName: string): Array<Element> {
        let result: Array<Element> = [];
        for (let i = 0; i < el.childNodes.length; i++) {
            let ch = el.childNodes[i];
            if ((<Element>ch).tagName == tagName) {
                result.push(<Element>ch);
            }
        }
        return result;
    }

    private elChild(el: Element, tagName: string): Element {
        if (!el) {
            return undefined;
        }

        for (let i = 0; i < el.childNodes.length; i++) {
            let ch = el.childNodes[i];
            if ((<Element>ch).tagName == tagName) {
                return <Element>ch;
            }
        }
        return undefined;
    }
}

class TypeRegistry {
    types: Array<TypeDescription>
    typesLookup: any
    typesGlobalCounter: any
    ns: { [name: string]: string }

    constructor(namespaces: { [name: string]: string }) {
        this.typesLookup = {};
        this.typesGlobalCounter = {};
        this.initDefaultTypes();
        this.ns = namespaces;
    }

    add(type: TypeDescription) {
        if (!type.name) {
            throw new Error('Type name must be specified.');
        }

        if (!type.namespace) {
            throw new Error('Type namespace must be specified.');
        }

        let key = this.typeKey(type);

        if (!this.typesLookup[key]) {
            let globalTypeName = this.formatGlobalName(type.name);
            if (!this.typesGlobalCounter[type.name]) {
                this.typesGlobalCounter[type.name] = 0
            }

            if (this.typesGlobalCounter[type.name] > 0) {
                globalTypeName += this.typesGlobalCounter[type.name];
            }

            this.typesGlobalCounter[type.name]++;

            this.typesLookup[key] = {
                typeDescription: type,
                globalTypeName: globalTypeName
            };

            if (!type.globalName) {
                type.globalName = globalTypeName;
            }
        }
    }

    private formatGlobalName(name: string): string {

        return name;
    }

    lookup(namespace: string, typeName: string): TypeDescription {
        let key = namespace + ':' + typeName
        return this.typesLookup[key] ? this.typesLookup[key].typeDescription : undefined;
    }

    typeKey(type: TypeDescription): string {
        let key = type.namespace + ':' + type.name
        return key;
    }

    complexTypes(): Array<TypeDescription> {
        let tds = new Array<TypeDescription>();

        for (let key in this.typesLookup) {
            if (this.typesLookup.hasOwnProperty(key)) {
                let type = this.typesLookup[key].typeDescription;
                if (type.complex) {
                    tds.push(type);
                }
            }
        }

        return tds;
    }

    private initDefaultTypes() {

        let defaultTypesMap = {
            "decimal": 'number',
            "float": 'number',
            "double": 'number',
            "integer": 'number',
            "positiveInteger": 'number',
            "negativeInteger": 'number',
            "nonPositiveInteger": 'number',
            "nonNegativeInteger": 'number',
            "long": 'number',
            "int": 'number',
            "short": 'number',
            "byte": 'number',
            "unsignedLong": 'number',
            "unsignedInt": 'number',
            "unsignedShort": 'number',
            "unsignedByte": 'number',
            "dateTime": 'string',
            "date": 'string',
            "gYearMonth": 'string',
            "gYear": 'string',
            "duration": 'string',
            "gMonthDay": 'string',
            "gDay": 'string',
            "gMonth": 'string',
            "string": 'string',
            "normalizedString": 'string',
            "token": 'string',
            "language": 'string',
            "NMTOKEN": 'string',
            "NMTOKENS": 'string',
            "Name": 'string',
            "NCName": 'string',
            "ID": 'string',
            "IDREFS": 'string',
            "ENTITY": 'string',
            "ENTITIES": 'string',
            "QName": 'string',
            "boolean": 'boolean',
            "hexBinary": 'string',
            "base64Binary": 'string',
            "anyURI": 'string',
            "notation": 'string',
        };

        for (var key in defaultTypesMap) {
            if (defaultTypesMap.hasOwnProperty(key)) {
                var globalName = defaultTypesMap[key];
                this.add({
                    name: key,
                    complex: false,
                    globalName: globalName,
                    namespace: XS_NS_URI,
                    properties: []
                });

            }
        }
    }
}