import { Body, Controller, Param, Put } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('api/comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
    ) {}

    @Put(':id')
    async updateComment(@Param('id') id: string, @Body() commentDto: any) {
        return await this.commentService.updateComment(id, commentDto);
    }
}
