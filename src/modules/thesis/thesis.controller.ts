import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
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

    @Put('/:thesisId/custom-url')
    async updateThesisCustomUrl(@Param('thesisId') thesisId: string, @Body() thesisDto: any) {
        return this.thesisService.updateThesisCustomUrl(thesisId, thesisDto);
    }

    @Put('/:thesisId/')
    async updateThesisProtectInfo(@Param('thesisId') thesisId: string, @Body() thesisDto: any) {
        return this.thesisService.updateThesis(thesisId, thesisDto);
    }

    @Put('/:thesisId/scoring')
    async updateThesisScoring(@Param('thesisId') thesisId: string, @Body() scoringDto: any) {
        return this.thesisService.updateThesisScoring(thesisId, scoringDto);
    }

    @Get()
    async getAllThesis(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('semester') semester: string,
        @Query('schoolYear') schoolYear: string,
        @Query('isPublic') isPublic: string,
    ) {
        return this.thesisService.getAllThesis( page, limit, semester, schoolYear, isPublic);
    }

}
