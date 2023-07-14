import {expect} from "chai";
import receivePossiblePropertiesModule from "../../../js/receivePossibleProperties";

const exampleDescribeFeatureType1 = "<?xml version='1.0' encoding='UTF-8'?>\n" +
        "<schema xmlns=\"http://www.w3.org/2001/XMLSchema\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:app=\"http://www.deegree.org/app\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" targetNamespace=\"http://www.deegree.org/app\" elementFormDefault=\"qualified\" attributeFormDefault=\"unqualified\">\n" +
        "  <import namespace=\"http://www.opengis.net/gml\" schemaLocation=\"http://schemas.opengis.net/gml/3.1.1/base/gml.xsd\"/>\n" +
        "  <element name=\"wfstgeom\" substitutionGroup=\"gml:_Feature\">\n" +
        "    <complexType>\n" +
        "      <complexContent>\n" +
        "        <extension base=\"gml:AbstractFeatureType\">\n" +
        "          <sequence>\n" +
        "            <element name=\"name\" minOccurs=\"0\" type=\"string\"/>\n" +
        "            <element name=\"nummer\" minOccurs=\"0\" type=\"integer\"/>\n" +
        "            <element name=\"bemerkung\" minOccurs=\"0\" type=\"string\"/>\n" +
        "            <element name=\"datum\" minOccurs=\"0\" type=\"date\"/>\n" +
        "            <element name=\"geom\" minOccurs=\"0\" type=\"gml:GeometryPropertyType\"/>\n" +
        "          </sequence>\n" +
        "        </extension>\n" +
        "      </complexContent>\n" +
        "    </complexType>\n" +
        "  </element>\n" +
        "</schema>",
    exampleProperties1 = [
        {
            key: "name",
            label: "name",
            required: false,
            type: "string",
            value: null
        },
        {
            key: "nummer",
            label: "nummer",
            required: false,
            type: "integer",
            value: null
        },
        {
            key: "bemerkung",
            label: "bemerkung",
            required: false,
            type: "string",
            value: null
        },
        {
            key: "datum",
            label: "datum",
            required: false,
            type: "date",
            value: null
        },
        {
            key: "geom",
            label: "geom",
            required: false,
            type: "geometry",
            value: null
        }
    ],
    exampleDescribeFeatureType2 = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n" +
    "<xsd:schema xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:gml=\"http://www.opengis.net/gml/3.2\" xmlns:gsm_wfs=\"gsm_wfs\" xmlns:wfs=\"http://www.opengis.net/wfs/2.0\" elementFormDefault=\"qualified\" targetNamespace=\"gsm_wfs\">\n" +
      "<xsd:import namespace=\"http://www.opengis.net/gml/3.2\" schemaLocation=\"https://geoportal-konfig.muenchen.de/geoserver/schemas/gml/3.2.1/gml.xsd\"/>\n" +
      "<xsd:complexType name=\"wfstgeomType\">\n" +
        "<xsd:complexContent>\n" +
          "<xsd:extension base=\"gml:AbstractFeatureType\">\n" +
            "<xsd:sequence>\n" +
              "<xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"name\" nillable=\"true\" type=\"xsd:string\"/>\n" +
              "<xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"nummer\" nillable=\"true\" type=\"xsd:double\"/>\n" +
              "<xsd:element maxOccurs=\"1\" minOccurs=\"0\" name=\"shape\" nillable=\"true\" type=\"gml:GeometryPropertyType\"/>\n" +
            "</xsd:sequence>\n" +
          "</xsd:extension>\n" +
        "</xsd:complexContent>\n" +
      "</xsd:complexType>\n" +
      "<xsd:element name=\"wfstgeom\" substitutionGroup=\"gml:AbstractFeature\" type=\"gsm_wfs:kultur_rbe1_museenType\"/>\n" +
    "</xsd:schema>",
    exampleProperties2 = [
        {
            key: "name",
            label: "name",
            required: false,
            type: "xsd:string",
            value: null
        },
        {
            key: "nummer",
            label: "nummer",
            required: false,
            type: "xsd:double",
            value: null
        },
        {
            key: "shape",
            label: "shape",
            required: false,
            type: "geometry",
            value: null
        }
    ];


describe("src_3_0_0/modules/wfst/js/parseDescribeFeatureTypeResponse.js", () => {
    let featureType;

    it("should retrieve the element values (required, type, key) from the parsed XML string if an element with name = featureType can be found in the XML", () => {
        featureType = "wfstgeom";

        const featureProperties = receivePossiblePropertiesModule.parseDescribeFeatureTypeResponse(exampleDescribeFeatureType1, featureType);

        expect(Array.isArray(featureProperties)).to.be.true;
        expect(featureProperties.length).to.equal(5);
        exampleProperties1.forEach(property => {
            const parsedProperty = featureProperties.find(({key}) => key === property.key);

            expect(parsedProperty).to.not.equal(undefined);
            expect(parsedProperty).to.eql(property);
        });
    });
    it("should return an empty array if no element with name = featureType can be found in the XML", () => {
        featureType = "myCoolType";

        const featureProperties = receivePossiblePropertiesModule.parseDescribeFeatureTypeResponse(exampleDescribeFeatureType1, featureType);

        expect(Array.isArray(featureProperties)).to.be.true;
        expect(featureProperties.length).to.equal(0);
    });
    it("should retrieve the element values (required, type, key) from the parsed XML string if an element with name = featureType can be found in the XML", () => {
        featureType = "wfstgeom";
        const featureProperties = receivePossiblePropertiesModule.parseDescribeFeatureTypeResponse(exampleDescribeFeatureType2, featureType);

        expect(Array.isArray(featureProperties)).to.be.true;
        expect(featureProperties.length).to.equal(3);
        exampleProperties2.forEach(property => {
            const parsedProperty = featureProperties.find(({key}) => key === property.key);

            expect(parsedProperty).to.not.equal(undefined);
            expect(parsedProperty).to.eql(property);
        });
    });
});
