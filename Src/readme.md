# Our.Community.Configuration
Store configuration data in the Umbraco database.

This plugin allows you to store configuration data in a custom table in the Umbraco database. 

## Supported data types
- Strings (Can be encrypted)
- Numbers
- Booleans

## Dashboard
![Settings Dashboard](/Documentation/images/dashboard.png)

### Add Property
![Add Property](/Documentation/images/overlay.png)

## Access properties in code
```csharp
IOurConfiguration ourconfig
```

### Get config data
```csharp
ourconfig.Get("propAlias"); // Fetches a single config setting

ourconfig.GetConfig(); //Fetches ALL config settings

ourconfig.GetConfigByGroup("TESTGROUP") //Fetch config settings for a specific group
```

### Gat a value
```csharp
// returns an object of the required type (string,int,bool), it will also return the decrypted value
// if the property is being stored with encryption.
ourconfig.Value();

```
