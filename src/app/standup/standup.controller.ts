import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StandupService } from './standup.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('task')
export class StandupController {
  constructor(private readonly standupService: StandupService) {}

  @Get('/:id')
  async next(
    @Param('id') workspaceId: number,
    @Query('direction') direction: string,
  ){
    return await this.standupService.next(workspaceId, direction);
  }
  
}
