import { ApiProperty } from '@nestjs/swagger';

export class CreateIncidentDto {
  @ApiProperty({
    example: 'เกิดเหตุเพลิงไหม้ที่อาคาร A',
    description: 'รายละเอียดเหตุการณ์',
  })
  text: string;
}
