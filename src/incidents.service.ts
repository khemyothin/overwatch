import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Incident } from './entities/incident.entity';
import { EventsGateway } from './events.gateway';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
    private readonly eventsGateway: EventsGateway,
  ) { }

  analyzeThreat(text: string): { type: string; priority: string } {
    if (!text) {
      return { type: 'UNCLEAR', priority: 'LOW' };
    }
    const highIntensityKeywords = ['ไฟ', 'ระเบิด', 'ชน', 'ตาย', 'เพลิง', 'ไหม้'];
    const lowIntensityKeywords = ['รถติด', 'น้ำท่วม'];

    const hasHighMatch = highIntensityKeywords.some((keyword) =>
      text.includes(keyword),
    );
    const hasLowMatch = lowIntensityKeywords.some((keyword) =>
      text.includes(keyword),
    );

    if (hasHighMatch) {
      return { type: 'ACCIDENT', priority: 'HIGH' };
    } else if (hasLowMatch) {
      return { type: 'GENERAL', priority: 'LOW' };
    }

    return { type: 'UNCLEAR', priority: 'LOW' };
  }

  async create(createIncidentDto: CreateIncidentDto) {
    const analysis = this.analyzeThreat(createIncidentDto.text);
    const incident = this.incidentRepository.create({
      ...createIncidentDto,
      ...analysis,
    });
    const savedIncident = await this.incidentRepository.save(incident);
    this.eventsGateway.emitNewIncident(savedIncident);
    return savedIncident;
  }

  findAll() {
    return this.incidentRepository.find();
  }

  findOne(id: string) {
    return this.incidentRepository.findOneBy({ id: id as any });
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto) {
    await this.incidentRepository.update(id, updateIncidentDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.incidentRepository.delete(id);
  }
}
