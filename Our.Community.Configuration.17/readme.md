# Our.Community.Configuration - Umbraco 17+
Store configuration data in the Umbraco database.

This plugin allows you to store configuration data in a custom table in the Umbraco database. 

## Supported data types
- Strings (can be encrypted)
- Numbers
- Booleans

## Dashboard
![Settings](https://github.com/huwred/Our.Community.Configuration/blob/main/Documentation/images/dashboard.png?raw=true "Settings Dashboard")

### Add Property
![Property](https://github.com/huwred/Our.Community.Configuration/blob/main/Documentation/images/overlay.png?raw=true "Add Property")


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

var setting = ourconfig.Value(fieldname);

```

## OurConfigDataSchema

| Property | Type | Description |
|----------|------|-------------|
| `Id` | `int` | The unique identifier for the configuration entry |
| `Alias` | `string` | The unique alias used to retrieve the setting |
| `Name` | `string` | The display name of the setting |
| `Value` | `string` | The stored value (encrypted if `Encrypted` is `true`) |
| `DataType` | `string` | The data type of the value (`string`, `int`, `bool`) |
| `Group` | `string` | The group the setting belongs to |
| `Encrypted` | `bool` | Indicates whether the value is stored with encryption |

### Example usage
