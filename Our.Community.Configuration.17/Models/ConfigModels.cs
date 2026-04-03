namespace Our.Community.Configuration._17.Models;

/// <summary>
/// Read model returned by the config API.
/// </summary>
public record ConfigItemModel(
    int Id,
    string Name,
    string Alias,
    string? Value,
    string? Label,
    bool Encrypted,
    string? Group,
    int Type,
    string? Key);

/// <summary>
/// Payload for creating a new config entry.
/// </summary>
public record CreateConfigRequest(
    string Name,
    string? Label,
    string? Value,
    bool Encrypted,
    string? Group,
    int Type);

/// <summary>
/// Payload for updating one or more config entries.
/// </summary>
public record UpdateConfigRequest(
    string Name,
    string? Value,
    string? Key,
    bool Encrypted);
