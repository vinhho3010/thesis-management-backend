/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CouncilService } from './council.service';

@Controller('api/council')
export class CouncilController {
    constructor(private councilService: CouncilService) {}

    @Get()
    async getCouncils(
        @Query('majorId') majorId: string,
        @Query('schoolYear') schoolYear: string,
        @Query('semester') semester: string,
    ) {
        return await this.councilService.getCouncils(majorId, schoolYear, semester);
    }

    @Get('/:id')
    async getCouncil(@Param('id') councilId: string) {
        return await this.councilService.getCouncil(councilId);
    }

    @Post()
    async createCouncil(@Body() councilDto: any) {
        return this.councilService.createCouncil(councilDto);
    }

    @Put('/:id')
    async updateCouncil(@Param('id') councilId: string, @Body() councilDto: any) {
        return this.councilService.updateCouncil(councilId, councilDto);
    }

    @Delete('/:id')
    async deleteCouncil(@Param('id') councilId: string) {
        return this.councilService.deleteCouncil(councilId);
    }




}
