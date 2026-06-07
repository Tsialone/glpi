import { assetsService } from "./assets.service";
import { documentService } from "./document.service";
import { itemModelService } from "./item-model.service";
import { itemStateService } from "./item-state.service";
import { itemTicketService } from "./item-ticket.service";
import { locationService } from "./location.service";
import { manufacturerService } from "./manufacturer.service";
import { ticketCostService } from "./ticket-cost.service";
import { ticketService } from "./ticket.service";
import { userService } from "./user.service";

class ResetService {
    async resetAll() {
        // fichier 1
        await assetsService.purge();
        await itemStateService.purge ();
        await locationService.purge ();
        await manufacturerService.purge ();
        await itemModelService.purge ();
        await userService.purge ();
        await documentService.purge ();


        // fichier 2
        await ticketService.purge ();
        await itemTicketService.purge ();

        // fichier 3
        ticketCostService.purge();

    }
}
export const resetService = new ResetService();