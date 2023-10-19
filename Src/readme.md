# Our.Community.Configuration

This package creates a custom table in the Umbraco database for storing configuration data. 

## Supported data types
- Strings (can be encrypted)
- Numbers
- Booleans

## Dashboard
<img src="/Documentation/images/dashboard.png" width="800" alt="Settings Dashboard" title="Settings Dashboard"/>

### Add Property
<img src="/Documentation/images/overlay.png" width="400" alt="Add Property" title="Add property dialog"/>


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
