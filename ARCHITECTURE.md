# 🏗️ OVERWATCH SYSTEM ARCHITECTURE

ความสัมพันธ์ของ Components และการไหลของข้อมูลภายในระบบ Overwatch.

## 📡 Data Flow Diagram

```mermaid
sequenceDiagram
    participant S as Simulation (Hotspots)
    participant A as NestJS API (Port 3000)
    participant G as Socket.io Gateway (Port 3001)
    participant C as Tactical HUD (Client)

    S->>A: 1. POST /incidents (Real Data)
    A->>A: 2. Threat Analysis & DB Save
    A->>G: 3. Invoke emitNewIncident()
    G-->>C: 4. WebSocket Broadcast (new_incident)
    C->>C: 5. Apply Jitter & Render Marker
```

## 🧩 Module Map (NestJS)

```mermaid
graph TD
    AppModule --> IncidentsModule
    
    subgraph IncidentsModule
        IncidentsController --> IncidentsService
        IncidentsService --> EventsGateway
        IncidentsService --> IncidentEntity[(SQLite DB)]
    end
    
    EventsGateway ---|WebSocket| TacticalHUD[index.html]
    Simulation[simulation.js] ---|HTTP POST| IncidentsController
```

## ⚙️ Component Breakdown

| Component | Responsibility | Tech Stack |
|-----------|----------------|------------|
| **Simulation** | จำลองเหตุการณ์จาก Hotspots จริง | Node.js (Fetch API) |
| **Incidents API** | รับข้อมูล, วิเคราะห์ Priority, จัดเก็บลง DB | NestJS, TypeORM, SQLite |
| **Events Gateway** | กระจายข้อมูลแบบ Real-time (Zero Latency) | Socket.io |
| **Tactical HUD** | แสดงผลแผนที่และเอฟเฟกต์ Cyberpunk | Leaflet.js, Tailwind CSS |
