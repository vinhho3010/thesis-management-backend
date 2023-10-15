import { Controller, Get, Param } from '@nestjs/common';
import { ThesisService } from './thesis.service';
@Controller('/api/thesis')
export class ThesisController {
    constructor(private thesisService: ThesisService){}

    @Get('/student/:studentId')
    async getStudentThesis(@Param('studentId') studentId: string) {
        return this.thesisService.getStudentThesis(studentId);
    }
}
