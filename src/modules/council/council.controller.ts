import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CouncilService } from './council.service';

@Controller('api/council')
export class CouncilController {
  constructor(private councilService: CouncilService) {}

  @Get()
  async getCouncils(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('majorId') majorId: string,
    @Query('schoolYear') schoolYear: string,
    @Query('semester') semester: string,
  ) {
    return await this.councilService.getCouncils(page, limit, majorId, schoolYear, semester);
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

  @Put('/:id/thesis/:thesisId')
  async addThesisToCouncil(
    @Param('id') councilId: string,
    @Param('thesisId') thesisId: string,
    @Body() ProtectInfo: any,
  ) {
    return this.councilService.addThesisToCouncil(
      councilId,
      thesisId,
      ProtectInfo,
    );
  }

  @Delete('/:id/thesis/:thesisId')
  async removeThesisFromCouncil(
    @Param('id') councilId: string,
    @Param('thesisId') thesisId: string,
  ) {
    return this.councilService.removeThesisFromCouncil(councilId, thesisId);
  }

  @Get('/teacher/:teacherId')
  async getCouncilsByTeacher(
    @Param('teacherId') teacherId: string,
    @Query('schoolYear') schoolYear: string,
    @Query('semester') semester: string,
  ) {
    return await this.councilService.getCouncilByMemberId(teacherId,schoolYear,semester);
  }

  @Get('/thesis/:thesisId')
  async getCouncilsByThesis(
    @Param('thesisId') thesisId: string,
  ) {
    return await this.councilService.getCouncilByThesisId(thesisId);
  }
}
