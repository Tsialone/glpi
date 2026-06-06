import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GlpiPicturesService {
    private tmpPath = '/opt/lampp/htdocs/glpi/glpi/files/_tmp';
    private picturesPath = '/opt/lampp/htdocs/glpi/glpi/files/_pictures';

    moveToPictures(filename: string): void {
        const src = path.join(this.tmpPath, filename);
        const dest = path.join(this.picturesPath, filename);

        if (!fs.existsSync(src)) {
            throw new Error(`Fichier introuvable dans _tmp : ${filename}`);
        }

        fs.copyFileSync(src, dest);
        // fs.unlinkSync(src); 
    }
}
