import { assetsService } from "./assets.service";
import { itemModelService } from "./item-model.service";
import { itemStateService } from "./item-state.service";
import { locationService } from "./location.service";
import { manufacturerService } from "./manufacturer.service";

class ResetService {
    async resetAll() {
        await assetsService.purge("Computer");
        await assetsService.purge("Monitor");
        await itemStateService.purge ();
        await locationService.purge ();
        await manufacturerService.purge ();
        await itemModelService.purge ("Computer");
        await itemModelService.purge ("Monitor");

    }
}
export const resetService = new ResetService();