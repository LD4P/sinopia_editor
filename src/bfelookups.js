bfe.define('src/lookups/lcnames', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');

    var cache = [];

    // This var is required because it is used as an identifier.
    exports.scheme = 'http://id.loc.gov/authorities/names';

    exports.source = function (query, process, formobject) {
      // console.log(JSON.stringify(formobject.store));

      var triples = formobject.store;

      var type = '';
      var hits = _.where(triples, {
        'p': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
      });
      if (hits[0] !== undefined) {
        type = hits[0].o;
      }
      // console.log("type is " + type);

      var scheme = 'http://id.loc.gov/authorities/names';
      hits = _.where(triples, {
        'p': 'http://id.loc.gov/ontologies/bibframe/authoritySource'
      });
      if (hits[0] !== undefined) {
        console.log(hits[0]);
        scheme = hits[0].o;
      }
      // console.log("scheme is " + scheme);

      var rdftype = '';
      if (type == 'http://www.loc.gov/mads/rdf/v1#PersonalName') {
        rdftype = 'rdftype:PersonalName';
      } else if (type == 'http://id.loc.gov/ontologies/bibframe/Topic') {
        rdftype = '(rdftype:Topic OR rdftype:ComplexSubject)';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#place') {
        rdftype = 'rdftype:Geographic';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#organization') {
        rdftype = 'rdftype:CorporateName';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#family') {
        // rdftype = "rdftype:FamilyName";
        rdftype = 'rdftype:PersonalName';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#meeting') {
        rdftype = 'rdftype:ConferenceName';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#jurisdiction') {
        rdftype = 'rdftype:CorporateName';
      } else if (type == 'http://id.loc.gov/ontologies/bibframe/genreForm') {
        rdftype = 'rdftype:GenreForm';
      } else if (type == 'http://id.loc.gov/ontologies/bibframe/role') {
        rdftype = 'rdftype:Role';
      }

      var q = '';
      if (scheme !== '' && rdftype !== '') {
        q = 'cs:' + scheme + ' AND ' + rdftype;
      } else if (rdftype !== '') {
        q = rdftype;
      } else if (scheme !== '') {
        q = 'cs:' + scheme;
      }
      if (q !== '') {
        q = q + ' AND (' + query + ' OR ' + query + '* OR *' + query + '*)';
      } else {
        q = '(' + query + ' OR ' + query + '* OR *' + query + '*)';
      }
      // console.log('q is ' + q);
      q = encodeURI(q);

      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query.length > 2 && query.substr(0, 1) != '?' && !query.match(/^[Nn][A-z]{0,1}\d/)) {
          suggestquery = query.normalize();
          console.log(query);
          if (rdftype !== '') { suggestquery += '&rdftype=' + rdftype.replace('rdftype:', ''); }

          u = exports.scheme + '/suggest/?q=' + suggestquery + '&count=50';

          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = lcshared.processSuggestions(data, query);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else if (query.length > 2) {
          u = 'http://id.loc.gov/search/?format=jsonp&start=1&count=50&q=' + q.replace('?', '');
          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = lcshared.processATOM(data, query);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    /*

          subjecturi hasAuthority selected.uri
          subjecturi  bf:label selected.value
      */
    exports.getResource = lcshared.getResourceWithAAP;
  });
  bfe.define('src/lookups/lcshared', ['require', 'exports', 'module'], function (require, exports, module) {
    // require('https://twitter.github.io/typeahead.js/releases/latest/typeahead.bundle.js');

    /*
          subjecturi propertyuri selected.uri
          selected.uri  bf:label selected.value
      */

    exports.getResource = function (subjecturi, property, selected, process) {
      var triples = [];

      var triple = {};
      triple.s = subjecturi;
      triple.p = property.propertyURI;
      triple.o = selected.uri;
      triple.otype = 'uri';
      triples.push(triple);

      triple = {};
      triple.s = selected.uri;
      triple.p = 'http://www.w3.org/2000/01/rdf-schema#label';
      triple.o = selected.value;
      triple.otype = 'literal';
      triple.olang = 'en';
      triples.push(triple);

      return process(triples, property);
    };

    exports.getResourceWithAAP = function (subjecturi, property, selected, process) {
      var triples = [];

      var triple = {};
      triple.s = subjecturi;
      triple.p = property.propertyURI;
      triple.o = selected.uri;
      triple.otype = 'uri';
      triples.push(triple);

      triple = {};
      triple.s = subjecturi;
      triple.p = 'http://www.w3.org/2000/01/rdf-schema#label';
      triple.o = selected.value;
      triple.otype = 'literal';
      triple.olang = 'en';
      triples.push(triple);

      process(triples, property);
    };

    exports.getResourceLabelLookup = function (subjecturi, propertyuri, selected, process) {
      var triples = [];

      var triple = {};
      triple.s = subjecturi;
      triple.p = propertyuri;
      triple.o = selected.uri;
      triple.otype = 'uri';
      triples.push(triple);
      // add label
      $.ajax({
        url: selected.uri + '.jsonp',
        dataType: 'jsonp',
        success: function (data) {
          data.forEach(function (resource) {
            if (resource['@id'] === selected.uri) {
              var label = {};
              label.s = selected.uri;
              label.otype = 'literal';
              label.p = 'http://www.w3.org/2000/01/rdf-schema#label';
              label.o = resource['http://www.loc.gov/mads/rdf/v1#authoritativeLabel'][0]['@value'];
              triples.push(label);
              return process(triples);
            }
          });
        }
      });
    };

    exports.processJSONLDSuggestions = function (suggestions, query, scheme) {
      var typeahead_source = [];
      if (suggestions['@graph'] !== undefined) {
        for (var s = 0; s < suggestions['@graph'].length; s++) {
          if (suggestions['@graph'][s].inScheme !== undefined) {
            if (suggestions['@graph'][s]['@type'] === 'Concept' && suggestions['@graph'][s].inScheme === scheme) {
              if (suggestions['@graph'][s].prefLabel.en.length !== undefined) {
                var l = suggestions['@graph'][s].prefLabel.en;
                // break;
                // var l = suggestions['@graph'][s]['prefLabel']['@value'];
              }
              var u = suggestions['@graph'][s]['@id'];
              typeahead_source.push({
                uri: u,
                value: l
              });
            }
          }
        }
      }
      if (typeahead_source.length === 0) {
        typeahead_source[0] = {
          uri: '',
          value: '[No suggestions found for ' + query + '.]'
        };
      }
      return typeahead_source;
    };

    exports.processSuggestions = function (suggestions, query) {
      var typeahead_source = [];
      if (suggestions[1] !== undefined) {
        for (var s = 0; s < suggestions[1].length; s++) {
          var l = suggestions[1][s];
          var u = suggestions[3][s];
          var id = u.replace(/.+\/(.+)/, '$1');
          var d = l + ' (' + id + ')';
          var li;
          if (suggestions.length === 5) {
            var i = suggestions[4][s];
            li = l + ' (' + i + ')';
          } else {
            li = l;
          }

          typeahead_source.push({
            uri: u,
            value: li,
            display: d
          });
        }
      }
      if (typeahead_source.length === 0) {
        typeahead_source[0] = {
          uri: '',
          display: '[No suggestions found for ' + query + '.]'
        };
      }
      // console.log(typeahead_source);
      // $("#dropdown-footer").text('Total Results:' + suggestions.length);
      return typeahead_source;
    };

    exports.processATOM = function (atomjson, query) {
      var typeahead_source = [];
      for (var k in atomjson) {
        if (atomjson[k][0] == 'atom:entry') {
          var t = '';
          var u = '';
          var source = '';
          var d = '';
          for (var e in atomjson[k]) {
            if (atomjson[k][e][0] == 'atom:title') {
              t = atomjson[k][e][2];
            }
            if (atomjson[k][e][0] == 'atom:link') {
              u = atomjson[k][e][1].href;
              source = u.substr(0, u.lastIndexOf('/'));
              var id = u.replace(/.+\/(.+)/, '$1');
              d = t + ' (' + id + ')';
            }
            if (t !== '' && u !== '') {
              typeahead_source.push({
                uri: u,
                source: source,
                value: t,
                display: d
              });
              break;
            }
            console.log(typeahead_source);
          }
        }
      }
      if (typeahead_source.length === 0) {
        typeahead_source[0] = {
          uri: '',
          display: '[No suggestions found for ' + query + '.]'
        };
      }
      // console.log(typeahead_source);
      return typeahead_source;
    };

    exports.simpleQuery = function (query, cache, scheme, process) {
      console.log('q is ' + query);
      q = encodeURI(query.normalize());
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }
      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = scheme + '/suggest/?count=100&q=';
          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = exports.processSuggestions(data, '');
              return process(parsedlist);
            }
          });
        } else if (query.length >= 1) {
          u = scheme + '/suggest/?count=50&q=' + q;
          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = exports.processSuggestions(data, query);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };
  });
  bfe.define('src/lookups/lcsubjects', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');

    var cache = [];

    exports.scheme = 'http://id.loc.gov/authorities/subjects';

    exports.source = function (query, process, formobject) {
      // console.log(JSON.stringify(formobject.store));

      var triples = formobject.store;

      var type = '';
      var hits = _.where(triples, {
        'p': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
      });
      if (hits[0] !== undefined) {
        type = hits[0].o;
      }
      // console.log("type is " + type);

      var scheme = 'http://id.loc.gov/authorities/subjects';
      hits = _.where(triples, {
        'p': 'http://id.loc.gov/ontologies/bibframe/authoritySource'
      });
      if (hits[0] !== undefined) {
        // console.log(hits[0]);
        scheme = hits[0].o;
      }
      // console.log("scheme is " + scheme);

      var rdftype = '';
      if (type == 'http://www.loc.gov/mads/rdf/v1#Person') {
        rdftype = 'rdftype:PersonalName';
      } else if (type == 'http://id.loc.gov/ontologies/bibframe/Topic') {
        rdftype = '(rdftype:Topic OR rdftype:ComplexSubject)';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#Place') {
        rdftype = 'rdftype:Geographic';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#Organization') {
        rdftype = 'rdftype:CorporateName';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#Family') {
        // rdftype = "rdftype:FamilyName";
        rdftype = 'rdftype:PersonalName';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#Meeting') {
        rdftype = 'rdftype:ConferenceName';
      } else if (type == 'http://www.loc.gov/mads/rdf/v1#Jurisdiction') {
        rdftype = 'rdftype:CorporateName';
      } else if (type == 'http://id.loc.gov/ontologies/bibframe/GenreForm') {
        rdftype = 'rdftype:GenreForm';
      }

      var q = '';
      if (scheme !== '' && rdftype !== '') {
        q = 'cs:' + scheme + ' AND ' + rdftype;
      } else if (rdftype !== '') {
        q = rdftype;
      } else if (scheme !== '') {
        q = 'cs:' + scheme;
      }
      if (q !== '') {
        q = q + ' AND (' + query + ' OR ' + query + '* OR *' + query + '*)';
      } else {
        q = '(' + query + ' OR ' + query + '* OR *' + query + '*)';
      }
      // console.log('q is ' + q);
      q = encodeURI(q);

      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query.length > 2 && query.substr(0, 1) != '?' && !query.match(/[Ss][A-z]{0,1}\d/)) {
          suggestquery = query.normalize();
          if (rdftype !== '') { suggestquery += '&rdftype=' + rdftype.replace('rdftype:', ''); }

          u = exports.scheme + '/suggest/?q=' + suggestquery;
          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = lcshared.processSuggestions(data, query);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else if (query.length > 2) {
          u = 'http://id.loc.gov/search/?format=jsonp&start=1&count=50&q=' + q.replace('?', '');
          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = lcshared.processATOM(data, query);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    /*

          subjecturi hasAuthority selected.uri
          subjecturi  bf:label selected.value
      */
    exports.getResource = lcshared.getResourceWithAAP;
  });
  bfe.define('src/lookups/lcgenreforms', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');

    var cache = [];

    exports.scheme = 'http://id.loc.gov/authorities/genreForms';

    exports.source = function (query, process) {
      var scheme = 'http://id.loc.gov/authorities/genreForms';
      var rdftype = 'rdftype:GenreForm';

      var q = '';
      if (scheme !== '' && rdftype !== '') {
        q = 'cs:' + scheme + ' AND ' + rdftype;
      } else if (rdftype !== '') {
        q = rdftype;
      } else if (scheme !== '') {
        q = 'cs:' + scheme;
      }
      if (q !== '') {
        q = q + ' AND (' + query + ' OR ' + query + '* OR *' + query + '*)';
      } else {
        q = '(' + query + ' OR ' + query + '* OR *' + query + '*)';
      }
      console.log('q is ' + q);
      q = encodeURI(q);

      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        console.log('searching defined');
        clearTimeout(this.searching);
        process([]);
      }
      // lcgft
      this.searching = setTimeout(function () {
        if (query.length > 2 && !query.match(/[Gg][A-z]?\d/)) {
          suggestquery = query;
          if (rdftype !== '') { suggestquery += '&rdftype=' + rdftype.replace('rdftype:', ''); }

          u = scheme + '/suggest/?q=' + suggestquery;

          // u = "http://id.loc.gov/authorities/genreForms/suggest/?q=" + query;
          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = lcshared.processSuggestions(data, query);
              cache[q] = parsedlist;
              return process(parsedlist);
            }

          });
        } /* else if (query.length > 2 && query.match(/[Gg][A-z]?\d/)) {
          u = 'http://id.loc.gov/search/?q=cs:http://id.loc.gov/authorities/genreForms%20AND%20(' + query + ')&start=1&format=atom';
          $.ajax({
            url: u,
            dataType: 'jsonp',
            success: function (data) {
              parsedlist = lcshared.processATOM(data, query);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } */ else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResourceWithAAP;
  });

  bfe.define('src/lookups/rdaformatnotemus', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/FormatNoteMus';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });
  bfe.define('src/lookups/rdamediatype', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/RDAMediaType';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });
  bfe.define('src/lookups/rdamodeissue', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/ModeIssue';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });
  bfe.define('src/lookups/rdacarriertype', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/RDACarrierType';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });
  bfe.define('src/lookups/rdacontenttype', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/RDAContentType';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });
  bfe.define('src/lookups/rdafrequency', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/frequency';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });
  bfe.define('src/lookups/rdaaspectration', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/AspectRatio';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });
  bfe.define('src/lookups/rdageneration', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];
    exports.scheme = 'http://rdaregistry.info/termList/RDAGeneration';

    exports.source = function (query, process) {
      console.log('q is ' + query);
      q = encodeURI(query);
      if (cache[q]) {
        process(cache[q]);
        return;
      }
      if (typeof this.searching !== 'undefined') {
        clearTimeout(this.searching);
        process([]);
      }

      this.searching = setTimeout(function () {
        if (query === '' || query === ' ') {
          u = exports.scheme + '.json-ld';
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              return process(parsedlist);
            }
          });
        } else if (query.length > 1) {
          u = exports.scheme + '.json-ld';
          console.log(u);
          $.ajax({
            url: u,
            dataType: 'json',
            success: function (data) {
              parsedlist = lcshared.processJSONLDSuggestions(data, query, exports.scheme);
              cache[q] = parsedlist;
              return process(parsedlist);
            }
          });
        } else {
          return [];
        }
      }, 300); // 300 ms
    };

    exports.getResource = lcshared.getResource;
  });

  bfe.define('src/lookups/lcorganizations', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];

    exports.scheme = 'http://id.loc.gov/vocabulary/organizations';

    exports.source = function (query, process) {
      return lcshared.simpleQuery(query, cache, exports.scheme, process);
    };

    exports.getResource = lcshared.getResourceWithAAP;
  });

  bfe.define('src/lookups/relators', ['require', 'exports', 'module', 'src/lookups/lcshared'], function (require, exports, module) {
    var lcshared = require('src/lookups/lcshared');
    var cache = [];

    exports.scheme = 'http://id.loc.gov/vocabulary/relators';

    exports.source = function (query, process) {
      return lcshared.simpleQuery(query, cache, exports.scheme, process);
    };

    exports.getResource = lcshared.getResource;
  });
