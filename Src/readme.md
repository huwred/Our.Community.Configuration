# Our.Community.Configuration
Store configuration data in the Umbraco database.

This plugin allows you to store configuration data in a custom table in the Umbraco database. 

## Supported data types
- Strings (can be encrypted)
- Numbers
- Booleans

## Dashboard
![Settings Dashboard](/Documentation/images/dashboard.png)

### Add Property
<img src="/Documentation/images/overlay.png" width="400" alt="Add Property"/>


## Access properties in code
To access your settings you will need to inject the configuration service.
```csharp
IOurConfiguration ourconfig
```

### Getting config data
```csharp
// Fetch a single config setting
OurConfigDataSchema setting = ourconfig.Get("propAlias"); 
//Fetch ALL config settings
IEnumerable<OurConfigDataSchema> settings = ourconfig.GetConfig(); 
//Fetch config settings for a specific group
IEnumerable<OurConfigDataSchema> settings = ourconfig.GetConfigByGroup("TESTGROUP") 
```

### Retrieving a value
Returns an object of the required type (string,int,bool), it will also return the decrypted value if the property is being stored with encryption.
```csharp

var setting = ourconfig.Value();

```
