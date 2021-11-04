import TemplatesBuilder from "TemplatesBuilder"
import { datasetFromN3 } from "utilities/Utilities"

describe("TemplatesBuilder", () => {
  it("builds subjectTemplate", async () => {
    const rdf = `<> <http://sinopia.io/vocabulary/hasAuthor> "Justin Littman"@eng .
<> <http://sinopia.io/vocabulary/hasClass> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<> <http://sinopia.io/vocabulary/hasDate> "2020-07-27"@eng .
<> <http://sinopia.io/vocabulary/hasRemark> "Template for testing purposes."@eng .
<> <http://sinopia.io/vocabulary/hasResourceId> <resourceTemplate:testing:uber1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "sinopia:template:resource" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/ResourceTemplate> .
<> <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1"@eng .
<> <http://sinopia.io/vocabulary/hasResourceAttribute> <http://sinopia.io/vocabulary/resourceAttribute/suppressible> .`

    const dataset = await datasetFromN3(rdf)
    const subjectTemplate = new TemplatesBuilder(dataset, "", "stanford", [
      "cornell",
    ]).build()
    expect(subjectTemplate).toStrictEqual({
      key: "resourceTemplate:testing:uber1",
      id: "resourceTemplate:testing:uber1",
      uri: "",
      class: "http://id.loc.gov/ontologies/bibframe/Uber1",
      label: "Uber template1",
      author: "Justin Littman",
      remark: "Template for testing purposes.",
      date: "2020-07-27",
      propertyTemplateKeys: [],
      propertyTemplates: [],
      suppressible: true,
      group: "stanford",
      editGroups: ["cornell"],
    })
  })

  it("builds common property template properties", async () => {
    const rdf = `<> <http://sinopia.io/vocabulary/hasClass> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<> <http://sinopia.io/vocabulary/hasPropertyTemplate> _:b1_c14n1 .
<> <http://sinopia.io/vocabulary/hasResourceId> <resourceTemplate:testing:uber1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "sinopia:template:resource" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/ResourceTemplate> .
<> <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1"@eng .
<http://sinopia.io/vocabulary/propertyAttribute/repeatable> <http://www.w3.org/2000/01/rdf-schema#label> "repeatable" .
<http://sinopia.io/vocabulary/propertyAttribute/required> <http://www.w3.org/2000/01/rdf-schema#label> "required" .
<http://sinopia.io/vocabulary/propertyAttribute/required> <http://www.w3.org/2000/01/rdf-schema#label> "ordered" .
<http://sinopia.io/vocabulary/propertyType/literal> <http://www.w3.org/2000/01/rdf-schema#label> "literal" .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:b1_c14n0 .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasPropertyAttribute> <http://sinopia.io/vocabulary/propertyAttribute/repeatable> .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasPropertyAttribute> <http://sinopia.io/vocabulary/propertyAttribute/required> .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasPropertyAttribute> <http://sinopia.io/vocabulary/propertyAttribute/ordered> .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasPropertyAttribute> <http://sinopia.io/vocabulary/propertyAttribute/immutable> .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasPropertyType> <http://sinopia.io/vocabulary/propertyType/literal> .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasRemark> "A repeatable literal."@eng .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasRemarkUrl> <http://access.rdatoolkit.org/2.4.2.html> .
_:b1_c14n0 <http://sinopia.io/vocabulary/hasPropertyUri> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> .
_:b1_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/PropertyTemplate> .
_:b1_c14n0 <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1, property2"@eng .
<http://access.rdatoolkit.org/2.4.2.html> <http://www.w3.org/2000/01/rdf-schema#label> "Note on Manifestation"@eng .`
    const dataset = await datasetFromN3(rdf)
    const subjectTemplate = new TemplatesBuilder(dataset, "").build()
    expect(subjectTemplate.propertyTemplates[0]).toStrictEqual({
      key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      label: "Uber template1, property2",
      uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      required: true,
      repeatable: true,
      languageSuppressed: false,
      ordered: true,
      immutable: true,
      remark: "A repeatable literal.",
      remarkUrl: "http://access.rdatoolkit.org/2.4.2.html",
      remarkUrlLabel: "Note on Manifestation",
      defaults: [],
      valueSubjectTemplateKeys: [],
      authorities: [],
      type: "literal",
      component: "InputLiteral",
    })
  })

  it("builds literal property template", async () => {
    const rdf = `<> <http://sinopia.io/vocabulary/hasClass> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<> <http://sinopia.io/vocabulary/hasPropertyTemplate> _:b1_c14n1 .
<> <http://sinopia.io/vocabulary/hasResourceId> <resourceTemplate:testing:uber1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "sinopia:template:resource" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/ResourceTemplate> .
<> <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1"@eng .
<http://sinopia.io/vocabulary/propertyType/literal> <http://www.w3.org/2000/01/rdf-schema#label> "literal" .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:b2_c14n0 .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:b2_c14n0 <http://sinopia.io/vocabulary/hasLiteralAttributes> _:b2_c14n1 .
_:b2_c14n0 <http://sinopia.io/vocabulary/hasPropertyType> <http://sinopia.io/vocabulary/propertyType/literal> .
_:b2_c14n0 <http://sinopia.io/vocabulary/hasPropertyUri> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> .
_:b2_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/PropertyTemplate> .
_:b2_c14n0 <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1, property2"@eng .
_:b2_c14n1 <http://sinopia.io/vocabulary/hasDefault> "default1"@eng .
_:b2_c14n1 <http://sinopia.io/vocabulary/hasDefault> "default2" .
_:b2_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/LiteralPropertyTemplate> .`
    const dataset = await datasetFromN3(rdf)
    const subjectTemplate = new TemplatesBuilder(dataset, "").build()
    expect(subjectTemplate.propertyTemplates[0]).toStrictEqual({
      key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      label: "Uber template1, property2",
      uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      required: false,
      repeatable: false,
      languageSuppressed: false,
      ordered: false,
      immutable: false,
      remark: null,
      remarkUrl: null,
      remarkUrlLabel: null,
      defaults: [
        { literal: "default1", lang: "eng" },
        { literal: "default2", lang: null },
      ],
      valueSubjectTemplateKeys: [],
      authorities: [],
      type: "literal",
      component: "InputLiteral",
    })
  })

  it("builds URI property template", async () => {
    const rdf = `<> <http://sinopia.io/vocabulary/hasClass> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<> <http://sinopia.io/vocabulary/hasPropertyTemplate> _:b1_c14n1 .
<> <http://sinopia.io/vocabulary/hasResourceId> <resourceTemplate:testing:uber1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "sinopia:template:resource" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/ResourceTemplate> .
<> <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1"@eng .
<http://sinopia.io/vocabulary/propertyType/uri> <http://www.w3.org/2000/01/rdf-schema#label> "uri" .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:b3_c14n3 .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:b3_c14n0 <http://sinopia.io/vocabulary/hasUri> <http://sinopia.io/uri1> .
_:b3_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/Uri> .
_:b3_c14n0 <http://www.w3.org/2000/01/rdf-schema#label> "Test uri1"@eng .
_:b3_c14n1 <http://sinopia.io/vocabulary/hasUri> <http://sinopia.io/uri2> .
_:b3_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/Uri> .
_:b3_c14n2 <http://sinopia.io/vocabulary/hasDefault> _:b3_c14n0 .
_:b3_c14n2 <http://sinopia.io/vocabulary/hasDefault> _:b3_c14n1 .
_:b3_c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/UriPropertyTemplate> .
_:b3_c14n3 <http://sinopia.io/vocabulary/hasPropertyType> <http://sinopia.io/vocabulary/propertyType/uri> .
_:b3_c14n3 <http://sinopia.io/vocabulary/hasUriAttributes> _:b3_c14n2 .
_:b3_c14n3 <http://sinopia.io/vocabulary/hasPropertyUri> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> .
_:b3_c14n3 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/PropertyTemplate> .
_:b3_c14n3 <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1, property2"@eng .`
    const dataset = await datasetFromN3(rdf)
    const subjectTemplate = new TemplatesBuilder(dataset, "").build()
    expect(subjectTemplate.propertyTemplates[0]).toStrictEqual({
      key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      label: "Uber template1, property2",
      uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      required: false,
      repeatable: false,
      languageSuppressed: false,
      ordered: false,
      immutable: false,
      remark: null,
      remarkUrl: null,
      remarkUrlLabel: null,
      defaults: [
        { uri: "http://sinopia.io/uri1", label: "Test uri1" },
        { uri: "http://sinopia.io/uri2", label: null },
      ],
      valueSubjectTemplateKeys: [],
      authorities: [],
      type: "uri",
      component: "InputURI",
    })
  })

  it("builds nested resource property template", async () => {
    const rdf = `<> <http://sinopia.io/vocabulary/hasClass> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<> <http://sinopia.io/vocabulary/hasPropertyTemplate> _:b1_c14n1 .
<> <http://sinopia.io/vocabulary/hasResourceId> <resourceTemplate:testing:uber1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "sinopia:template:resource" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/ResourceTemplate> .
<> <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1"@eng .
<http://sinopia.io/vocabulary/propertyType/resource> <http://www.w3.org/2000/01/rdf-schema#label> "nested resource" .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:b4_c14n1 .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:b4_c14n0 <http://sinopia.io/vocabulary/hasResourceTemplateId> <resourceTemplate:testing:uber2> .
_:b4_c14n0 <http://sinopia.io/vocabulary/hasResourceTemplateId> <resourceTemplate:testing:uber3> .
_:b4_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/ResourcePropertyTemplate> .
_:b4_c14n1 <http://sinopia.io/vocabulary/hasPropertyType> <http://sinopia.io/vocabulary/propertyType/resource> .
_:b4_c14n1 <http://sinopia.io/vocabulary/hasResourceAttributes> _:b4_c14n0 .
_:b4_c14n1 <http://sinopia.io/vocabulary/hasPropertyUri> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> .
_:b4_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/PropertyTemplate> .
_:b4_c14n1 <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1, property2"@eng .`
    const dataset = await datasetFromN3(rdf)
    const subjectTemplate = new TemplatesBuilder(dataset, "").build()
    expect(subjectTemplate.propertyTemplates[0]).toStrictEqual({
      key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      label: "Uber template1, property2",
      uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      required: false,
      repeatable: false,
      languageSuppressed: false,
      ordered: false,
      immutable: false,
      remark: null,
      remarkUrl: null,
      remarkUrlLabel: null,
      defaults: [],
      valueSubjectTemplateKeys: [
        "resourceTemplate:testing:uber2",
        "resourceTemplate:testing:uber3",
      ],
      authorities: [],
      component: "NestedResource",
      type: "resource",
    })
  })

  it("builds lookup property template", async () => {
    const rdf = `<> <http://sinopia.io/vocabulary/hasClass> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<> <http://sinopia.io/vocabulary/hasPropertyTemplate> _:b1_c14n1 .
<> <http://sinopia.io/vocabulary/hasResourceId> <resourceTemplate:testing:uber1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "sinopia:template:resource" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/ResourceTemplate> .
<> <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1"@eng .
<http://sinopia.io/vocabulary/propertyType/lookup> <http://www.w3.org/2000/01/rdf-schema#label> "lookup" .
<urn:discogs> <http://www.w3.org/2000/01/rdf-schema#label> "Discogs" .
<urn:ld4p:qa:agrovoc> <http://www.w3.org/2000/01/rdf-schema#label> "AGROVOC (QA)" .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:b5_c14n1 .
_:b1_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:b5_c14n0 <http://sinopia.io/vocabulary/hasAuthority> <urn:discogs> .
_:b5_c14n0 <http://sinopia.io/vocabulary/hasAuthority> <urn:ld4p:qa:agrovoc> .
_:b5_c14n0 <http://sinopia.io/vocabulary/hasAuthority> <urn:ld4p:sinopia:bibframe:instance> .
_:b5_c14n0 <http://sinopia.io/vocabulary/hasDefault> _:b5_c14n2 .
_:b5_c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/LookupPropertyTemplate> .
_:b5_c14n1 <http://sinopia.io/vocabulary/hasLookupAttributes> _:b5_c14n0 .
_:b5_c14n1 <http://sinopia.io/vocabulary/hasPropertyType> <http://sinopia.io/vocabulary/propertyType/uri> .
_:b5_c14n1 <http://sinopia.io/vocabulary/hasPropertyUri> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> .
_:b5_c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/PropertyTemplate> .
_:b5_c14n1 <http://www.w3.org/2000/01/rdf-schema#label> "Uber template1, property2"@eng .
_:b5_c14n2 <http://sinopia.io/vocabulary/hasUri> <http://sinopia.io/uri1> .
_:b5_c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/vocabulary/Uri> .
_:b5_c14n2 <http://www.w3.org/2000/01/rdf-schema#label> "URI1"@eng .`
    const dataset = await datasetFromN3(rdf)
    const subjectTemplate = new TemplatesBuilder(dataset, "").build()

    expect(subjectTemplate.propertyTemplates[0]).toStrictEqual({
      key: "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      subjectTemplateKey: "resourceTemplate:testing:uber1",
      label: "Uber template1, property2",
      uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      required: false,
      repeatable: false,
      languageSuppressed: false,
      ordered: false,
      immutable: false,
      remark: null,
      remarkUrl: null,
      remarkUrlLabel: null,
      defaults: [{ uri: "http://sinopia.io/uri1", label: "URI1" }],
      valueSubjectTemplateKeys: [],
      authorities: [
        {
          uri: "urn:discogs",
          label: "Discogs",
          authority: "discogs",
          subauthority: "all",
          nonldLookup: true,
        },
        {
          uri: "urn:ld4p:qa:agrovoc",
          label: "AGROVOC (QA)",
          authority: "agrovoc_ld4l_cache",
          subauthority: "",
          nonldLookup: false,
        },
        {
          label: "Sinopia BIBFRAME instance resources",
          nonldLookup: false,
          type: "http://id.loc.gov/ontologies/bibframe/Instance",
          uri: "urn:ld4p:sinopia:bibframe:instance",
        },
      ],
      type: "uri",
      component: "InputLookup",
    })
  })
})
