import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
