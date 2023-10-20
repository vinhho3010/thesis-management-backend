import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ThesisVersionService } from './thesis-version.service';

@Controller('api/thesis-version')
export class ThesisVersionController {
    constructor(
        private readonly thesisVersionService: ThesisVersionService
    ) {}

    @Get('/milestone/:milestoneId')
    async getAllMilestoneVersion(
        @Param('milestoneId') milestoneId: string
    ) {
        return this.thesisVersionService.getAllMilestoneVersion(milestoneId);
    }

    @Get('/milestone/:milestoneId/student/:studentId')
    async getVersionStudentMilestone(
        @Param('studentId') studentId: string,
        @Param('milestoneId') milestoneId: string
    ) {
        return this.thesisVersionService.getVersionStudentMilestone(studentId, milestoneId);
    }

    @Put('/:thesisVersionId')
    async updateThesisVersion(
        @Param('thesisVersionId') thesisVersionId: string,
        @Body() thesisVersionDto: any
    ) {
        return this.thesisVersionService.updateThesisVersion(thesisVersionId, thesisVersionDto);
    }
    
    @Put('/:thesisVersionId/url')
    async updateThesisVersionUrl(
        @Param('thesisVersionId') thesisVersionId: string,
        @Body() newFile: any
    ) {
        return this.thesisVersionService.updateThesisVersionUrl(thesisVersionId, newFile);
    }
}
