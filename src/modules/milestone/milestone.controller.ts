import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MilestoneService } from './milestone.service';

@Controller('api/milestone')
export class MilestoneController {
    constructor(private readonly milestoneService: MilestoneService) {}

    @Get('/class/:classId')
    async getAllClassMilestone(
        @Param('classId') classId: string
    ) {
        return this.milestoneService.getAllClassMilestone(classId);
    }

    @Get('/:milestoneId')
    async getMilestone(
        @Param('milestoneId') milestoneId: string
    ) {
        return this.milestoneService.getMilestone(milestoneId);
    }

    @Post('/class/:classId')
    async createMilestone(
        @Param('classId') classId: string,
        @Body() milestoneDto: any
    ) {
        return this.milestoneService.createMilestone(classId, milestoneDto);
    }

    @Put('/:milestoneId')
    async updateMilestone(
        @Param('milestoneId') milestoneId: string,
        @Body() milestoneDto: any
    ) {
        return this.milestoneService.updateMilestone(milestoneId, milestoneDto);
    }

    @Delete('/:milestoneId')
    async deleteMilestone(
        @Param('milestoneId') milestoneId: string
    ) {
        return this.milestoneService.deleteMilestone(milestoneId);
    }


}
