import GraphBuilder from "GraphBuilder"

describe("GraphBuilder", () => {
  describe("graph()", () => {
    it("builds a graph for literals", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property2",
            },
            values: [
              // With lang
              {
                literal: "literal1",
                lang: "eng",
                uri: null,
                // Value references its property.
                property: {
                  propertyTemplate: {
                    type: "literal",
                  },
                },
              },
              // Without lang
              {
                literal: "literal2",
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "literal",
                  },
                },
              },
            ],
          },
        ],
      }

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal1"@eng .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal2" .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for uris", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property8",
            },
            values: [
              // With label
              {
                uri: "http://sinopia.io/uri1",
                label: "URI1",
                lang: "eng",
                // Value references its property.
                property: {
                  propertyTemplate: {
                    type: "uri",
                  },
                },
              },
              // Without label
              {
                uri: "http://sinopia.io/uri2",
                label: null,
                property: {
                  propertyTemplate: {
                    type: "uri",
                  },
                },
              },
            ],
          },
        ],
      }

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri1> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri2> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1"@eng .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for nested resources", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                      },
                      values: [
                        {
                          literal: "literal3",
                          lang: "eng",
                          uri: null,
                          property: {
                            propertyTemplate: {
                              type: "literal",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for ordered resources", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property19",
              ordered: true,
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template4/property1",
                      },
                      values: null,
                    },
                  ],
                },
              },
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template4/property1",
                      },
                      values: [
                        {
                          literal: "literal1",
                          lang: "eng",
                          uri: null,
                          property: {
                            propertyTemplate: {
                              type: "literal",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template4/property1",
                      },
                      values: [
                        {
                          literal: "literal2",
                          lang: "eng",
                          uri: null,
                          property: {
                            propertyTemplate: {
                              type: "literal",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber4",
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template4/property1",
                      },
                      values: null,
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
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
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            values: null,
          },
        ],
      }
      const rdf = `<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph ignoring empty nested resources", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                      },
                      values: [],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
      const rdf = `<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph ignoring empty literals", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property2",
            },
            values: [
              {
                literal: "literal1",
                lang: "eng",
                uri: null,
                // Value references its property.
                property: {
                  propertyTemplate: {
                    type: "literal",
                  },
                },
              },
              // Empty
              {
                literal: "",
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "literal",
                  },
                },
              },
            ],
          },
        ],
      }

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property2> "literal1"@eng .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph ignoring empty URIs", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property8",
            },
            values: [
              // With label
              {
                uri: "http://sinopia.io/uri1",
                label: "URI1",
                // Value references its property.
                property: {
                  propertyTemplate: {
                    type: "uri",
                  },
                },
              },
              // Empty
              {
                uri: "",
                label: null,
                property: {
                  propertyTemplate: {
                    type: "uri",
                  },
                },
              },
            ],
          },
        ],
      }

      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property8> <http://sinopia.io/uri1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1" .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for suppressible nested resource with uri", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber2",
                    suppressible: true,
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                      },
                      values: [
                        {
                          uri: "http://sinopia.io/uri1",
                          label: "URI1",
                          literal: null,
                          lang: null,
                          property: {
                            propertyTemplate: {
                              type: "uri",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> <http://sinopia.io/uri1> .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1" .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })

    it("builds a graph for suppressible nested resource with multiple uris", () => {
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber2",
                    suppressible: true,
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                      },
                      values: [
                        {
                          uri: "http://sinopia.io/uri1",
                          label: "URI1",
                          literal: null,
                          lang: null,
                          property: {
                            propertyTemplate: {
                              type: "uri",
                            },
                          },
                        },
                        {
                          uri: "http://sinopia.io/uri2",
                          label: "URI2",
                          literal: null,
                          lang: null,
                          property: {
                            propertyTemplate: {
                              type: "uri",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
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
      const resource = {
        subjectTemplate: {
          id: "resourceTemplate:testing:uber1",
          class: "http://id.loc.gov/ontologies/bibframe/Uber1",
        },
        properties: [
          {
            propertyTemplate: {
              uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
            },
            values: [
              {
                uri: null,
                property: {
                  propertyTemplate: {
                    type: "resource",
                  },
                },
                valueSubject: {
                  subjectTemplate: {
                    class: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  },
                  properties: [
                    {
                      propertyTemplate: {
                        uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                      },
                      values: [
                        {
                          uri: null,
                          label: null,
                          literal: "literal3",
                          lang: "eng",
                          property: {
                            propertyTemplate: {
                              type: "uri",
                              suppresible: true,
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }
      const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
      expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
    })
  })

  it("builds a graph for suppresible nested resource with multiple literal", () => {
    const resource = {
      subjectTemplate: {
        id: "resourceTemplate:testing:uber1",
        class: "http://id.loc.gov/ontologies/bibframe/Uber1",
      },
      properties: [
        {
          propertyTemplate: {
            uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
          },
          values: [
            {
              uri: null,
              property: {
                propertyTemplate: {
                  type: "resource",
                },
              },
              valueSubject: {
                subjectTemplate: {
                  class: "http://id.loc.gov/ontologies/bibframe/Uber2",
                },
                properties: [
                  {
                    propertyTemplate: {
                      uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                    },
                    values: [
                      {
                        uri: null,
                        label: null,
                        literal: "literal3",
                        lang: "eng",
                        property: {
                          propertyTemplate: {
                            type: "uri",
                            suppresible: true,
                          },
                        },
                      },
                      {
                        uri: null,
                        label: null,
                        literal: "literal4",
                        lang: "eng",
                        property: {
                          propertyTemplate: {
                            type: "uri",
                            suppresible: true,
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    }
    const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal4"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
    expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
  })

  it("builds a graph for suppressible nested resource with uri and literal", () => {
    const resource = {
      subjectTemplate: {
        id: "resourceTemplate:testing:uber1",
        class: "http://id.loc.gov/ontologies/bibframe/Uber1",
      },
      properties: [
        {
          propertyTemplate: {
            uri: "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
          },
          values: [
            {
              uri: null,
              property: {
                propertyTemplate: {
                  type: "resource",
                },
              },
              valueSubject: {
                subjectTemplate: {
                  class: "http://id.loc.gov/ontologies/bibframe/Uber2",
                  suppressible: true,
                },
                properties: [
                  {
                    propertyTemplate: {
                      uri: "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
                    },
                    values: [
                      {
                        uri: "http://sinopia.io/uri1",
                        label: "URI1",
                        literal: null,
                        lang: null,
                        property: {
                          propertyTemplate: {
                            type: "uri",
                          },
                        },
                      },
                      {
                        uri: null,
                        label: null,
                        literal: "literal3",
                        lang: "eng",
                        property: {
                          propertyTemplate: {
                            type: "uri",
                            suppresible: true,
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    }
    const rdf = `<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> <http://sinopia.io/uri1> .
<> <http://id.loc.gov/ontologies/bibframe/uber/template1/property1> _:c14n0 .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:testing:uber1" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber1> .
<http://sinopia.io/uri1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .
<http://sinopia.io/uri1> <http://www.w3.org/2000/01/rdf-schema#label> "URI1" .
_:c14n0 <http://id.loc.gov/ontologies/bibframe/uber/template2/property1> "literal3"@eng .
_:c14n0 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Uber2> .`
    expect(new GraphBuilder(resource).graph.toCanonical()).toMatch(rdf)
  })
})
