import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { CheckoutRequestsService } from './checkout-requests.service';
import { CreateCheckoutRequestDto, UpdateCheckoutRequestDto } from './dto/create-checkout-request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('api/checkout-requests')
export class CheckoutRequestsController {
  constructor(private readonly service: CheckoutRequestsService) { }

  // POST create new checkout request (student)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createDto: CreateCheckoutRequestDto) {
    return this.service.create(req.user.userId, createDto);
  }

  // GET my requests (student)
  @Get('my-requests')
  @UseGuards(JwtAuthGuard)
  findMyRequests(@Req() req) {
    return this.service.findByStudent(req.user.userId);
  }

  // GET all requests (admin/technician)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'technician')
  findAll(@Query('status') status?: string) {
    return this.service.findAll(status);
  }

  // GET single request (admin/technician)
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'technician')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // PUT update request status (admin/technician) - ✅ FIXED: Only 2 arguments
  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'technician')
  updateStatus(@Param('id') id: string, @Body() updateDto: UpdateCheckoutRequestDto) {
    return this.service.updateStatus(+id, updateDto);
  }

  // DELETE request (admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  // POST send reminder (admin/technician)
  @Post(':id/reminder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'technician')
  sendReminder(@Param('id') id: string) {
    return this.service.sendReminder(+id);
  }
}
