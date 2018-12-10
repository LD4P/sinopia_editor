# Qa22LinkedDataApi.FetchTermApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**gETFetchByIDFromAuthority**](FetchTermApi.md#gETFetchByIDFromAuthority) | **GET** /show/linked_data/{vocab}/{id} | Get a single term from an authority.  Generally there are no additional parameters.  See the authority&#39;s configuration file to be sure.  Some authorities support &#x60;lang&#x60; which can be used to filter the language of returned strings.
[**gETFetchByIDFromSubauthority**](FetchTermApi.md#gETFetchByIDFromSubauthority) | **GET** /show/linked_data/{vocab}/{subauthority}/{id} | Get a single term from a subauthority in an authority.  Generally there are no additional parameters.  See the authority&#39;s configuration file to be sure.  Some authorities support &#x60;lang&#x60; which can be used to filter the language of returned strings.
[**gETFetchURIFromAuthority**](FetchTermApi.md#gETFetchURIFromAuthority) | **GET** /fetch/linked_data/{vocab} | Get a single term from an authority given the term&#39;s URI.  Generally there are no additional parameters.  See the authority&#39;s configuration file to be sure.  Some authorities support &#x60;lang&#x60; which can be used to filter the language of returned strings.
[**oPTIONSFetchFromAuthority**](FetchTermApi.md#oPTIONSFetchFromAuthority) | **OPTIONS** /show/linked_data/{vocab}/{id} | CORS preflight request
[**oPTIONSFetchFromAuthority_0**](FetchTermApi.md#oPTIONSFetchFromAuthority_0) | **OPTIONS** /fetch/linked_data/{vocab} | CORS preflight request
[**oPTIONSFetchFromSubauthority**](FetchTermApi.md#oPTIONSFetchFromSubauthority) | **OPTIONS** /show/linked_data/{vocab}/{subauthority}/{id} | CORS preflight request


<a name="gETFetchByIDFromAuthority"></a>
# **gETFetchByIDFromAuthority**
> gETFetchByIDFromAuthority(vocab, id, opts)

Get a single term from an authority.  Generally there are no additional parameters.  See the authority&#39;s configuration file to be sure.  Some authorities support &#x60;lang&#x60; which can be used to filter the language of returned strings.

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.FetchTermApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var id = "id_example"; // String | The ID or URI for the term being retrieved.

var opts = { 
  'format': "format_example" // String | The format of the returned result.
};
apiInstance.gETFetchByIDFromAuthority(vocab, id, opts).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 
 **id** | **String**| The ID or URI for the term being retrieved. | 
 **format** | **String**| The format of the returned result. | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="gETFetchByIDFromSubauthority"></a>
# **gETFetchByIDFromSubauthority**
> gETFetchByIDFromSubauthority(vocab, subauthority, id, opts)

Get a single term from a subauthority in an authority.  Generally there are no additional parameters.  See the authority&#39;s configuration file to be sure.  Some authorities support &#x60;lang&#x60; which can be used to filter the language of returned strings.

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.FetchTermApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var subauthority = "subauthority_example"; // String | Name of the subauthority.

var id = "id_example"; // String | The ID or URI for the term being retrieved.

var opts = { 
  'format': "format_example" // String | The format of the returned result.
};
apiInstance.gETFetchByIDFromSubauthority(vocab, subauthority, id, opts).then(function() {
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
 **id** | **String**| The ID or URI for the term being retrieved. | 
 **format** | **String**| The format of the returned result. | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="gETFetchURIFromAuthority"></a>
# **gETFetchURIFromAuthority**
> gETFetchURIFromAuthority(vocab, uri, opts)

Get a single term from an authority given the term&#39;s URI.  Generally there are no additional parameters.  See the authority&#39;s configuration file to be sure.  Some authorities support &#x60;lang&#x60; which can be used to filter the language of returned strings.

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.FetchTermApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var uri = "uri_example"; // String | The URI for the term being retrieved.

var opts = { 
  'format': "format_example" // String | The format of the returned result.
};
apiInstance.gETFetchURIFromAuthority(vocab, uri, opts).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 
 **uri** | **String**| The URI for the term being retrieved. | 
 **format** | **String**| The format of the returned result. | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="oPTIONSFetchFromAuthority"></a>
# **oPTIONSFetchFromAuthority**
> oPTIONSFetchFromAuthority(vocab, id)

CORS preflight request

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.FetchTermApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var id = "id_example"; // String | The ID or URI for the term being retrieved.

apiInstance.oPTIONSFetchFromAuthority(vocab, id).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 
 **id** | **String**| The ID or URI for the term being retrieved. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="oPTIONSFetchFromAuthority_0"></a>
# **oPTIONSFetchFromAuthority_0**
> oPTIONSFetchFromAuthority_0(vocab, id)

CORS preflight request

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.FetchTermApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var id = "id_example"; // String | The ID or URI for the term being retrieved.

apiInstance.oPTIONSFetchFromAuthority_0(vocab, id).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **vocab** | **String**| Name of the authority&#39;s configuration file. | 
 **id** | **String**| The ID or URI for the term being retrieved. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="oPTIONSFetchFromSubauthority"></a>
# **oPTIONSFetchFromSubauthority**
> oPTIONSFetchFromSubauthority(vocab, subauthority, id)

CORS preflight request

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.FetchTermApi();

var vocab = "vocab_example"; // String | Name of the authority's configuration file.

var subauthority = "subauthority_example"; // String | Name of the subauthority.

var id = "id_example"; // String | The ID or URI for the term being retrieved.

apiInstance.oPTIONSFetchFromSubauthority(vocab, subauthority, id).then(function() {
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
 **id** | **String**| The ID or URI for the term being retrieved. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

