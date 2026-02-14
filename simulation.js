/**
 * Mission 7: Scenario Simulation Script
 * Developed by Ultron for The Overwatch System
 */

const API_URL = 'http://127.0.0.1:3000/incidents';

// Styles for console
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    magenta: "\x1b[35m"
};

const hotspots = [
    {
        name: "แยกอโศก-เพชรบุรี (Asoke-Phetchaburi)",
        lat: 13.7478, lng: 100.5630,
        scenarios: [
            "รายงานการจราจรติดขัดสะสมท้ายแถวทะลุแยกอโศก",
            "อุบัติเหตุเฉี่ยวชนบริเวณจุดกลับรถแยกอโศก-เพชรบุรี",
            "พบเศษวัสดุก่อสร้างหล่นกีดขวางการจราจร"
        ]
    },
    {
        name: "ห้าแยกลาดพร้าว (Lat Phrao Five-Way)",
        lat: 13.8164, lng: 100.5647,
        scenarios: [
            "ปริมาณรถหนาแน่นบริเวณหน้าห้างสรรพสินค้าเซ็นทรัลลาดพร้าว",
            "รายงานจุดเสี่ยงอุบัติเหตุเนื่องจากการเปลี่ยนช่องจราจรกะทันหัน",
            "พบรถยนต์จอดเสียกีดขวางการจราจรบริเวณทางขึ้นด่วน"
        ]
    },
    {
        name: "แยกพระราม 9 (Rama 9 Intersection)",
        lat: 13.7580, lng: 100.5663,
        scenarios: [
            "รายงานน้ำท่วมขังสูงหลังฝนตกหนักบริเวณแยกพระราม 9",
            "อุบัติเหตุรถบรรทุกเฉี่ยวชนรถจักรยานยนต์บริเวณแยกอสมท.",
            "สัญญาณไฟจราจรขัดข้องทำให้การจราจรเป็นอัมพาต"
        ]
    },
    {
        name: "แยกสาทร-สุรศักดิ์ (Sathorn-Surasak)",
        lat: 13.7228, lng: 100.5187,
        scenarios: [
            "การจราจรติดขัดรุนแรงหน้าโรงเรียนกรุงเทพคริสเตียน",
            "รายงานเหตุเพลิงไหม้สายสื่อสารบริเวณแยกสาทร",
            "อุบัติเหตุรถชนท้ายต่อเนื่อง 4 คันบริเวณทางลงสะพานตากสิน"
        ]
    },
    {
        name: "แยกประตูน้ำ (Pratunam Intersection)",
        lat: 13.7508, lng: 100.5401,
        scenarios: [
            "นักท่องเที่ยวหนาแน่นพ้นขอบทางเดินเท้าบริเวณแยกประตูน้ำ",
            "รายงานแก๊สระเบิดในร้านอาหารย่านธุรกิจประตูน้ำ",
            "พบวัตถุต้องสงสัยบริเวณหน้าห้างแพลทินัม"
        ]
    }
];

function getJitter(val, amount = 0.0005) {
    return val + (Math.random() - 0.5) * amount;
}

async function triggerSimulation() {
    const spot = hotspots[Math.floor(Math.random() * hotspots.length)];
    const text = spot.scenarios[Math.floor(Math.random() * spot.scenarios.length)];
    const lat = getJitter(spot.lat);
    const lng = getJitter(spot.lng);

    const payload = {
        text: `[${spot.name}] ${text}`,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng)
    };

    console.log(`${colors.magenta}[SIMULATION]${colors.reset} Initializing node telemetry deployment...`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            const priorityColor = result.priority === 'HIGH' ? colors.red : colors.green;

            console.log(`${colors.green}✔ DEPLOYMENT SUCCESSFUL${colors.reset}`);
            console.log(`${colors.cyan}---------------------------------------------------${colors.reset}`);
            console.log(`${colors.bright}ID:${colors.reset} ${result.id}`);
            console.log(`${colors.bright}TEXT:${colors.reset} ${result.text}`);
            console.log(`${colors.bright}TYPE:${colors.reset} ${result.type}`);
            console.log(`${colors.bright}PRIORITY:${colors.reset} ${priorityColor}${result.priority}${colors.reset}`);
            console.log(`${colors.bright}COORDS:${colors.reset} ${result.latitude}, ${result.longitude}`);
            console.log(`${colors.cyan}---------------------------------------------------${colors.reset}\n`);
        } else {
            console.error(`${colors.red}✘ DEPLOYMENT FAILED:${colors.reset} Status ${response.status}`);
        }
    } catch (error) {
        console.error(`${colors.red}✘ SYSTEM ERROR:${colors.reset}`, error.message);
    }
}

console.clear();
console.log(`${colors.yellow}${colors.bright}=== OVERWATCH SCENARIO SIMULATION ACTIVE ===${colors.reset}`);
console.log(`${colors.cyan}Interface: ${API_URL}`);
console.log(`Frequency: Every 5 Seconds\n`);

// Start Simulation
triggerSimulation();
setInterval(triggerSimulation, 5000);
