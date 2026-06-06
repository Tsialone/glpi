import { assetsService } from "./assets.service";
import { documentService } from "./document.service";
import { itemModelService } from "./item-model.service";
import { itemStateService } from "./item-state.service";
import { locationService } from "./location.service";
import { manufacturerService } from "./manufacturer.service";
import { userService } from "./user.service";

class ResetService {
    async resetAll() {
        await assetsService.purge();
        await itemStateService.purge ();
        await locationService.purge ();
        await manufacturerService.purge ();
        await itemModelService.purge ();
        await userService.purge ();
        await documentService.purge ();

    }
}
export const resetService = new ResetService();