import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ThesisService } from './thesis.service';
@Controller('/api/thesis')
export class ThesisController {
    constructor(private thesisService: ThesisService){}

    @Get('/student/:studentId')
    async getStudentThesis(@Param('studentId') studentId: string) {
        return this.thesisService.getStudentThesis(studentId);
    }

    @Put('/student/:studentId')
    async updateStudentThesis(@Param('studentId') studentId: string, @Body() thesisDto: any) {
        return this.thesisService.updateStudentThesis(studentId, thesisDto);
    }
}
