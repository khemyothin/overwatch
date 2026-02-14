import { Injectable } from '@nestjs/common';

export interface Hospital {
    name: string;
    distanceKm: number;
    availableBeds: number;
}

export interface Patient {
    name: string;
    condition: 'STABLE' | 'URGENT' | 'CRITICAL';
}

@Injectable()
export class SmartDispatcherService {
    findBestHospital(patient: Patient, hospitals: Hospital[]): { hospital: Hospital; reasoning: string } {
        if (!hospitals || hospitals.length === 0) {
            throw new Error('No hospitals available');
        }

        let bestHospital: Hospital | null = null;
        let reasoning = '';

        // Logic: If Critical, Capacity (Available Beds > 0) is mandatory.
        if (patient.condition === 'CRITICAL') {
            const candidates = hospitals.filter(h => h.availableBeds > 0);

            if (candidates.length > 0) {
                // Find nearest among those with capacity
                bestHospital = candidates.reduce((prev, curr) => (prev.distanceKm < curr.distanceKm ? prev : curr));
                reasoning = `ตัดสินใจเลือก ${bestHospital.name} เนื่องจากผู้ป่วยอยู่ในภาวะวิกฤต (CRITICAL) แม้อาจจะอยู่ไกลกว่าบางจุด แต่มีความพร้อมของเตียงว่าง (Capacity) ซึ่งสำคัญกว่าระยะทาง เพื่อเลี่ยงความเสียเวลาจากการรอส่งต่อ (Secondary Transfer) และเพิ่มโอกาสรอดใน Golden Hour.`;
            } else {
                // Fallback to nearest if none have beds (Emergency Stabilize only)
                bestHospital = hospitals.reduce((prev, curr) => (prev.distanceKm < curr.distanceKm ? prev : curr));
                reasoning = `ไม่มีโรงพยาบาลที่มีเตียงว่างพร้อมรับ จำต้องเลือก ${bestHospital.name} เนื่องจากอยู่ใกล้ที่สุดเพื่อการประคองอาการ (Stabilization) เบื้องต้นก่อนหาทางส่งตัวต่อ.`;
            }
        } else {
            // Default: Nearest hospital for non-critical cases
            bestHospital = hospitals.reduce((prev, curr) => (prev.distanceKm < curr.distanceKm ? prev : curr));
            reasoning = `ผู้ป่วยอาการไม่วิกฤต เลือก ${bestHospital.name} เพราะเป็นจุดที่เข้าถึงได้เร็วที่สุด (Distance Priority).`;
        }

        return { hospital: bestHospital, reasoning };
    }
}
