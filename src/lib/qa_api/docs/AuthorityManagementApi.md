# Qa22LinkedDataApi.AuthorityManagementApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**gETListAuthorities**](AuthorityManagementApi.md#gETListAuthorities) | **GET** /list/linked_data/authorities | List currently loaded linked data authorities
[**gETReloadAuthorities**](AuthorityManagementApi.md#gETReloadAuthorities) | **GET** /reload/linked_data/authorities | Reload linked data authorities.  Using this command avoids having to restart the rails server.


<a name="gETListAuthorities"></a>
# **gETListAuthorities**
> gETListAuthorities()

List currently loaded linked data authorities

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.AuthorityManagementApi();
apiInstance.gETListAuthorities().then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

<a name="gETReloadAuthorities"></a>
# **gETReloadAuthorities**
> gETReloadAuthorities(authToken)

Reload linked data authorities.  Using this command avoids having to restart the rails server.

### Example
```javascript
var Qa22LinkedDataApi = require('qa_22_linked_data_api');

var apiInstance = new Qa22LinkedDataApi.AuthorityManagementApi();

var authToken = "authToken_example"; // String | Security token which must be included for this command to execute.

apiInstance.gETReloadAuthorities(authToken).then(function() {
  console.log('API called successfully.');
}, function(error) {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authToken** | **String**| Security token which must be included for this command to execute. | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

