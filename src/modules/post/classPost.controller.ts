import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClassPostService } from './classPost.service';
import { ClassPost } from 'src/schemas/classPost.schema';

@Controller('/api/post')
export class ClassPostController {
  constructor(private readonly postService: ClassPostService) {}

  @Get('class/:id')
  getPostByClass(@Param('id') id: string): Promise<ClassPost[]> {
    return this.postService.getPostByClass(id);
  }

  @Post()
  createPost(@Body() createPostDto: ClassPost): Promise<ClassPost> {
    return this.postService.createPost(createPostDto);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): Promise<ClassPost> {
    return this.postService.deletePost(id);
  }

  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: ClassPost,
  ): Promise<ClassPost> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Put(':id/add-comment')
  addComment(
    @Param('id') id: string,
    @Body() commentDto: any,
  ): Promise<ClassPost> {
    return this.postService.addComment(id, commentDto);
  }

  @Delete(':id/delete-comment/:commentId')
  deleteComment(
    @Param('id') id: string,
    @Param('commentId') commentId: any,
  ): Promise<ClassPost> {
    return this.postService.deleteComment(id, commentId);
  }
}
