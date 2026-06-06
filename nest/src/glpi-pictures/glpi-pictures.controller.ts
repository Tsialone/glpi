import { Controller, Get, Param, Query } from '@nestjs/common';
import { GlpiPicturesService } from './glpi-pictures.service';
import { ok } from 'assert';

@Controller('glpi-pictures')
export class GlpiPicturesController {
    constructor(private glpiPictureService: GlpiPicturesService) { }
    @Get()
    findAll(@Query("file_name") fileName: string) {
        console.log (fileName)
        this.glpiPictureService.moveToPictures(fileName)
        return  ok ("Fichier deplacé avec success!!!");
    }

}
