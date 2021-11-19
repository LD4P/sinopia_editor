import GraphBuilder from "GraphBuilder"
import ResourceBuilder from "resourceBuilderUtils"

describe("GraphBuilder", () => {
  const build = new ResourceBuilder({
    injectPropertyKeyIntoValue: true,
    injectPropertyIntoValue: true,
    injectClassesIntoSubject: true,
  })
  describe("graph()", () => {
    it("builds a graph for literals", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.literalProperty({
            values: [
              // With languange
              build.literalValue({
                literal: "literal1",
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property2",
              }),
              // Without language
              build.literalValue({
                literal: "literal2",
                lang: null,
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property3",
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal1"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property3> "literal2" .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for literal with validationDataType", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:literalValidation",
          clazz: "http://sinopia.io/testing/LiteralValidation",
        }),
        properties: [
          build.literalProperty({
            propertyTemplate: build.propertyTemplate({
              subjectTemplateKey: "resourceTemplate:testing:literalValidation",
              label: "literalValidation, integer validationDataType",
              uris: {
                "http://sinopia.io/testing/LiteralValidation/property3":
                  "http://sinopia.io/testing/LiteralValidation/property3",
              },
              type: "literal",
              validationDataType: "http://www.w3.org/2001/XMLSchema#integer",
              languageSuppressed: true,
              component: "InputLiteral",
            }),
            values: [
              build.literalValue({
                literal: "literal with dataType",
                lang: null,
                propertyUri:
                  "http://sinopia.io/testing/LiteralValidation/property3",
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://sinopia.io/testing/LiteralValidation/property3> "literal with dataType"^^<http://www.w3.org/2001/XMLSchema#integer> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:literalValidation" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://sinopia.io/testing/LiteralValidation> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for uris", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.uriProperty({
            values: [
              // With label
              build.uriValue({
                uri: "http://sinopia.io/uri1",
                label: "URI1",
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property8",
              }),
              // Without label
              build.uriValue({
                uri: "http://sinopia.io/uri2",
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property8",
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri1> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri2> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1"@eng .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for nested resources", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.resourceProperty({
            values: [
              build.subjectValue({
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber2",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  }),
                  properties: [
                    build.literalProperty({
                      values: [
                        build.literalValue({
                          literal: "literal3",
                          propertyUri:
                            "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                        }),
                      ],
                    }),
                  ],
                }),
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for ordered resources", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.resourceProperty({
            propertyTemplate: build.propertyTemplate({
              subjectTemplateKey: "resourceTemplate:testing:uber1",
              label: "Uber template1, property19",
              uris: {
                "http://id.loc.gov/ontologies/bibframe/uber/template1/property19":
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property19",
              },
              ordered: true,
              type: "resource",
              component: "NestedResource",
            }),
            propertyUri:
              "http://id.loc.gov/ontologies/bibframe/uber/template1/property19",
            values: [
              build.subjectValue({
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber4",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  }),
                  properties: [build.property()],
                }),
              }),
              build.subjectValue({
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber4",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  }),
                  properties: [
                    build.literalProperty({
                      values: [
                        build.literalValue({
                          literal: "literal1",
                          propertyUri:
                            "http://id.loc.gov/ontologies/bibframe/uber/template4/property1",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              build.subjectValue({
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber4",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  }),
                  properties: [
                    build.property(),
                    build.literalProperty({
                      values: [
                        build.literalValue({
                          literal: "literal2",
                          propertyUri:
                            "http://id.loc.gov/ontologies/bibframe/uber/template4/property1",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              build.subjectValue({
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber4",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  }),
                  properties: [build.property()],
                }),
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property19> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:c14n2 .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> _:c14n1 .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> _:c14n3 .
_:c14n1 <http://www.w3.org/1999/02/22-rdf-syntax-ns#rest> <http://www.w3.org/1999/02/22-rdf-syntax-ns#nil> .
_:c14n2 <http://id.loc.gov/ontologies/bibframe/uber/template4/property1> "literal1"@eng .
_:c14n2 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber4> .
_:c14n3 <http://id.loc.gov/ontologies/bibframe/uber/template4/property1> "literal2"@eng .
_:c14n3 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber4> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph ignoring null values", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [build.property()],
      })

      const rdf = `<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph ignoring empty nested resources", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.property({
            values: [
              build.subjectValue({
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber2",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  }),
                  properties: [
                    build.property({
                      values: null,
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph ignoring empty literals", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.literalProperty({
            values: [
              build.literalValue({
                literal: "literal1",
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property2",
              }),
              build.literalValue({
                // Empty
                literal: "",
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property2",
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal1"@eng .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph ignoring empty URIs", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.literalProperty({
            values: [
              build.uriValue({
                uri: "http://sinopia.io/uri1",
                label: "URI1",
                lang: null,
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property8",
              }),
              build.uriValue({
                // Empty
                uri: "",
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property8",
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1" .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for suppressible nested resource with uri", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.resourceProperty({
            values: [
              build.subjectValue({
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber2",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
                    suppressible: true,
                  }),
                  properties: [
                    build.uriProperty({
                      values: [
                        build.uriValue({
                          propertyUri:
                            "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                          uri: "http://sinopia.io/uri1",
                          label: "URI1",
                          lang: null,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> <http://sinopia.io/uri1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1" .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for suppressible nested resource with multiple uris", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.resourceProperty({
            values: [
              build.subjectValue({
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber2",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
                    suppressible: true,
                  }),
                  properties: [
                    build.uriProperty({
                      values: [
                        build.uriValue({
                          propertyUri:
                            "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
                          uri: "http://sinopia.io/uri1",
                          label: "URI1",
                          lang: null,
                        }),
                        build.uriValue({
                          propertyUri:
                            "http://id.loc.gov/ontologies/bibframe/uber/template1/property2",
                          uri: "http://sinopia.io/uri2",
                          label: "URI2",
                          lang: null,
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> <http://sinopia.io/uri1> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> <http://sinopia.io/uri2> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1" .
<http://sinopia.io/uri2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
<http://sinopia.io/uri2> <http://www.w3.org/2000/01/rdf-schema#label> "URI2" .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for suppresible nested resource with literal", () => {
      const resource = build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber1",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
        }),
        properties: [
          build.resourceProperty({
            values: [
              build.subjectValue({
                propertyUri:
                  "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
                valueSubject: build.subject({
                  subjectTemplate: build.subjectTemplate({
                    id: "resourceTemplate:testing:uber2",
                    clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
                    suppressible: true,
                  }),
                  properties: [
                    build.literalProperty({
                      values: [
                        build.literalValue({
                          propertyUri:
                            "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                          literal: "literal3",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      })

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })
  })

  it("builds a graph for suppresible nested resource with multiple literal", () => {
    const resource = build.subject({
      subjectTemplate: build.subjectTemplate({
        id: "resourceTemplate:testing:uber1",
        clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
      }),
      properties: [
        build.resourceProperty({
          values: [
            build.subjectValue({
              propertyUri:
                "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
              valueSubject: build.subject({
                subjectTemplate: build.subjectTemplate({
                  id: "resourceTemplate:testing:uber2",
                  clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  suppressible: true,
                }),
                properties: [
                  build.literalProperty({
                    values: [
                      build.literalValue({
                        propertyUri:
                          "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                        literal: "literal3",
                      }),
                      build.literalValue({
                        propertyUri:
                          "http://id.loc.gov/ontologies/bibframe/uber/template2/property2",
                        literal: "literal4",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    })

    const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property2> "literal4"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
    expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
  })

  it("builds a graph for suppressible nested resource with uri and literal", () => {
    const resource = build.subject({
      subjectTemplate: build.subjectTemplate({
        id: "resourceTemplate:testing:uber1",
        clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
      }),
      properties: [
        build.resourceProperty({
          values: [
            build.subjectValue({
              propertyUri:
                "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
              valueSubject: build.subject({
                subjectTemplate: build.subjectTemplate({
                  id: "resourceTemplate:testing:uber2",
                  clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  suppressible: true,
                }),
                properties: [
                  build.property({
                    values: [
                      build.uriValue({
                        propertyUri:
                          "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                        uri: "http://sinopia.io/uri1",
                        label: "URI1",
                      }),
                      build.literalValue({
                        propertyUri:
                          "http://id.loc.gov/ontologies/bibframe/uber/template2/property2",
                        literal: "literal3",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    })

    const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> <http://sinopia.io/uri1> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1"@eng .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property2> "literal3"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
    expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
  })

  it("builds a graph when multiple classes", () => {
    const resource = build.subject({
      subjectTemplate: build.subjectTemplate({
        id: "resourceTemplate:testing:uber1",
        clazz: "http://id.loc.gov/ontologies/bibframe/Uber1",
      }),
      classes: [
        "http://id.loc.gov/ontologies/bibframe/Uber1",
        "http://id.loc.gov/ontologies/bibframe/Uber2",
      ],
      properties: [
        build.literalProperty({
          values: [
            // With languange
            build.literalValue({
              literal: "literal1",
              propertyUri:
                "http://id.loc.gov/ontologies/bibframe/uber/template1/property2",
            }),
            // Without language
            build.literalValue({
              literal: "literal2",
              lang: null,
              propertyUri:
                "http://id.loc.gov/ontologies/bibframe/uber/template1/property3",
            }),
          ],
        }),
      ],
    })

    const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal1"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property3> "literal2" .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
    expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
  })
})
