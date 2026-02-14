import { ApiProperty } from '@nestjs/swagger';

export class CreateIncidentDto {
  @ApiProperty({
    example: 'เกิดเหตุเพลิงไหม้ที่อาคาร A',
    description: 'รายละเอียดเหตุการณ์',
  })
  text: string;

  @ApiProperty({ example: 13.7563, description: 'ละติจูด' })
  latitude: number;

  @ApiProperty({ example: 100.5018, description: 'ลองจิจูด' })
  longitude: number;
}
