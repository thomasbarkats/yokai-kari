import { Controller, Get, HttpStatus, Param, Res, Response } from 'yasui';
import { IYokai } from '../../domain';
import { YokaisService } from '../services';


@Controller('/yokais')
export class YokaisController {

    constructor(
        private yokaisService: YokaisService,
    ) { }


    @Get('/:id')
    private async getYokai(
        @Param('id') id: string,
        @Res() res: Response
    ): Promise<void> {
        const yokai: IYokai = await this.yokaisService.get(id);
        res.status(HttpStatus.OK).json(yokai);
    }
}
