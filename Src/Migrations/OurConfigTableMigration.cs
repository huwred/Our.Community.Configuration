using Microsoft.Extensions.Logging;
using Our.Community.Configuration.Models;
using Umbraco.Cms.Infrastructure.Migrations;

namespace Our.Community.Configuration.Migrations;

/// <summary>
/// Creates Config table in Umbraco Database
/// </summary>
public class OurConfigTableMigration : MigrationBase
{
    private const string TABLE_NAME = "OurConfig";
    public OurConfigTableMigration(IMigrationContext context) : base(context)
    {
    }

    protected override void Migrate()
    {

        Logger.LogDebug("Running migration {MigrationStep}", "AddConfigTable");

        // Lots of methods available in the MigrationBase class - discover with this.
        if (TableExists(TABLE_NAME) == false)
        {
            Create.Table<OurConfigDataSchema>().Do();
            Logger.LogInformation("The database table {DbTable} has been created.", TABLE_NAME);
        }
        else
        {
            Logger.LogDebug("The database table {DbTable} already exists, checking columns", TABLE_NAME);
        }
    }

}