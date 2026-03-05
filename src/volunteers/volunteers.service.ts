import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyVolunteerDto } from './dto/apply-volunteer.dto';
import { UpdateVolunteerApplicationDto } from './dto/update-volunteer-application.dto';

@Injectable()
export class VolunteersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Applies the current user as a volunteer for an event
   */
  async apply(userId: string, eventId: string, dto: ApplyVolunteerDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');

    const existing = await this.prisma.volunteerApplication.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) throw new ConflictException('Already applied as volunteer');

    return this.prisma.volunteerApplication.create({
      data: { userId, eventId, skills: dto.skills },
    });
  }

  /**
   * Returns all volunteer applications for an event (organizer only)
   */
  async getEventApplications(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId)
      throw new ForbiddenException('Only the organizer can view applications');

    return this.prisma.volunteerApplication.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  /**
   * Accepts or rejects a volunteer application (organizer only)
   */
  async updateApplication(
    userId: string,
    eventId: string,
    applicationId: string,
    dto: UpdateVolunteerApplicationDto,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId)
      throw new ForbiddenException(
        'Only the organizer can update applications',
      );

    const application = await this.prisma.volunteerApplication.findUnique({
      where: { id: applicationId },
    });
    if (!application) throw new NotFoundException('Application not found');

    return this.prisma.volunteerApplication.update({
      where: { id: applicationId },
      data: { status: dto.status },
    });
  }

  /**
   * Returns all volunteer applications for the current user
   */
  async getMyApplications(userId: string) {
    return this.prisma.volunteerApplication.findMany({
      where: { userId },
      include: {
        event: { select: { id: true, title: true, startDate: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
