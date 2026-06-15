import { UTIL_CONST } from "../utils";
import { assetsService } from "./assets.service";
import { budgetService } from "./budget.service";
import { documentService } from "./document.service";
import { itemModelService } from "./item-model.service";
import { itemStateService } from "./item-state.service";
import { itemTicketService } from "./item-ticket.service";
import { locationService } from "./location.service";
import { manufacturerService } from "./manufacturer.service";
import { specialCostService } from "./nest/special-cost.service";
import { ticketCostService } from "./ticket-cost.service";
import { ticketValidationService } from "./ticket-validation.service";
import { ticketService } from "./ticket.service";
import { userService } from "./user.service";

class ResetService {
    async resetAll() {
        // fichier 1
        await assetsService.purge();
        await itemStateService.purge();
        await locationService.purge();
        await manufacturerService.purge();
        await itemModelService.purge();
        await userService.purge();
        await documentService.purge();


        // fichier 2
        await ticketService.purge();
        await itemTicketService.purge();

        // fichier 3
        await ticketCostService.purge();


        // autre
        await budgetService.purge();
        await ticketValidationService.purge();


        // await superCostService.purge();
        await specialCostService.purge();

        localStorage.removeItem(UTIL_CONST.ticket_position);
        localStorage.removeItem(UTIL_CONST.lang);

    }
}
export const resetService = new ResetService();