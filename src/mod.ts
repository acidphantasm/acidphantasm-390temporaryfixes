import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";

class TemporaryFixes implements IPostDBLoadMod
{
    public postDBLoad(container: DependencyContainer): void
    {
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables: IDatabaseTables = databaseServer.getTables();


        // Fix new figurines to be lootable
        const restrictionsInRaid = tables.globals.config.RestrictionsInRaid;
        const newFigurines = [
            "66572b8d80b1cd4b6a67847f",
            "66572be36a723f7f005a066e",
            "66572cbdad599021091c611a",
            "66572c82ad599021091c6118"
        ]

        for (const restriction in restrictionsInRaid)
        {
            const isIncluded =  newFigurines.some(itemID => restrictionsInRaid[restriction].TemplateId.includes(itemID))
            if (isIncluded)
            {
                restrictionsInRaid[restriction].MaxInLobby = 100;
                restrictionsInRaid[restriction].MaxInRaid = 100;
            }
        }
    }
}

export const mod = new TemporaryFixes();
