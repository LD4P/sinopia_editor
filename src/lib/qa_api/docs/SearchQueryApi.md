# Qa22LinkedDataApi.SearchQueryApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**gETSearchAuthority**](SearchQueryApi.md#gETSearchAuthority) | **GET** /search/linked_data/{vocab} | Send a query string to an authority and return search results.  Parameters are typical examples.  Actual parameters are driven by the authority&#39;s config file.
[**gETSearchSubauthority**](SearchQueryApi.md#gETSearchSubauthority) | **GET** /search/linked_data/{vocab}/{subauthority} | Send a query string to a subauthority in an authority and return search results.
[**oPTIONSSearchAuthority**](SearchQueryApi.md#oPTIONSSearchAuthority) | **OPTIONS** /search/linked_data/{vocab} | CORS preflight request
[**oPTIONSSearchSubauthority**](SearchQueryApi.md#oPTIONSSearchSubauthority) | **OPTIONS** /search/linked_data/{vocab}/{subauthority} | CORS preflight request


<a name="gETSearchAuthority"></a>
# **gETSearchAuthority**
> gETSearchAuthority(vocab, q, opts)

Send a query string to an authority and return search results.  Parameters are typical examples.  Actual parameters are driven by the authority&#39;s config file.

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.SearchQueryApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var q = "q_example"; // String | The query string

var opts = { 
  'maxRecords': "maxRecords_example", // String | Limit number of returned results. NOTE: Most authorities use maxRecords, but a few use maximumRecords for this parameter.
  'lang': "lang_example" // String | Limit string values to this language when multiple languages are provided.
};
apiInstance.gETSearchAuthority(vocab, q, opts).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 
 **q** | **String**| The query string | 
 **maxRecords** | **String**| Limit number of returned results. NOTE: Most authorities use maxRecords, but a few use maximumRecords for this parameter. | [optional] 
 **lang** | **String**| Limit string values to this language when multiple languages are provided. | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="gETSearchSubauthority"></a>
# **gETSearchSubauthority**
> gETSearchSubauthority(vocab, subauthority, q, opts)

Send a query string to a subauthority in an authority and return search results.

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.SearchQueryApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var subauthority = "subauthority_example"; // String | Name of the subauthority.

var q = "q_example"; // String | The query string

var opts = { 
  'maxRecords': "maxRecords_example", // String | Limit number of returned results.  NOTE: Most authorities use maxRecords, but a few use maximumRecords for this parameter.
  'lang': "lang_example" // String | Limit string values to this language when multiple languages are provided.
};
apiInstance.gETSearchSubauthority(vocab, subauthority, q, opts).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 
 **subauthority** | **String**| Name of the subauthority. | 
 **q** | **String**| The query string | 
 **maxRecords** | **String**| Limit number of returned results.  NOTE: Most authorities use maxRecords, but a few use maximumRecords for this parameter. | [optional] 
 **lang** | **String**| Limit string values to this language when multiple languages are provided. | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="oPTIONSSearchAuthority"></a>
# **oPTIONSSearchAuthority**
> oPTIONSSearchAuthority(vocab)

CORS preflight request

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.SearchQueryApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

apiInstance.oPTIONSSearchAuthority(vocab).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="oPTIONSSearchSubauthority"></a>
# **oPTIONSSearchSubauthority**
> oPTIONSSearchSubauthority(vocab, subauthority)

CORS preflight request

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.SearchQueryApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var subauthority = "subauthority_example"; // String | Name of the subauthority.

apiInstance.oPTIONSSearchSubauthority(vocab, subauthority).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 
 **subauthority** | **String**| Name of the subauthority. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

