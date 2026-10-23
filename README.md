# FlowChain AI — Autonomous Supply Chain Recovery & Optimization SaaS

**Tagline:** When Supply Chains Break, Intelligence Takes Over.

FlowChain AI is an enterprise-grade autonomous supply-chain resiliency platform. When a disruption occurs, the system detects operational impacts, orchestrates six specialized AI agents, solves constrained mathematical optimization models using Google OR-Tools, simulates outcomes stochastically with SimPy, compares trade-offs, and presents actionable recovery strategies for human approval.

---

## 1. Architecture & Technologies

- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS, Lucide React, MapLibre GL JS, React Flow, Recharts, TanStack Query, Framer Motion.
- **Backend**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, PostgreSQL / SQLite.
- **Operations Research**: Google OR-Tools (Mixed-Integer Programming), NetworkX (Multi-modal graph traversal), SimPy (Discrete-event stochastic simulation).
- **Agentic AI**: 6 LangGraph agents with deterministic tool calling and human-in-the-loop interrupts.
- **Infrastructure**: Docker, Docker Compose, automated migrations, tenant isolation RBAC.

---

## 2. Monorepo Structure

```text
flowchain-ai/
├── apps/
│   └── web/                   # Next.js App Router Frontend
│       ├── app/               # Landing page + 16 SaaS command center routes
│       ├── components/        # Layout, sidebar, header, GIS, and charts
│       ├── lib/               # Utilities & helpers
│       └── package.json
├── services/
│   └── api/                   # FastAPI Backend
│       ├── app/
│       │   ├── api/v1/        # Health, Auth, Organizations, etc.
│       │   ├── core/          # Config, security, DB session, RBAC deps
│       │   ├── models/        # SQLAlchemy models (User, Organization, etc.)
│       │   ├── schemas/       # Pydantic v2 validation
│       │   ├── agents/        # LangGraph agents & tools
│       │   ├── optimization/  # Google OR-Tools MIP models & solver
│       │   └── simulation/    # SimPy discrete-event engine
│       ├── tests/             # Pytest test suite
│       └── requirements.txt
├── packages/
│   └── shared/                # Shared domain types
├── data/
│   └── synthetic/             # Synthetic electronics supply chain generator
├── docker-compose.yml         # Containerized Postgres, Redis, API, and Web
├── .env.example               # Config template
└── README.md
```

---

## 3. Quick Start

### Prerequisites
- Node.js v18+ (Node 20+ recommended)
- Python 3.12+
- Docker & Docker Compose (optional, for PostgreSQL/Redis)

### Local Development Setup

1. **Clone & Configure Environment**:
   ```bash
   cp .env.example .env
   ```

2. **Backend Setup**:
   ```bash
   # From repository root
   cd services/api
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Run Backend Tests**:
   ```bash
   pytest -v
   ```

4. **Start Backend Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   # API Docs available at: http://localhost:8000/api/v1/docs
   ```

5. **Frontend Setup & Start**:
   ```bash
   # In another terminal from repository root
   cd apps/web
   npm install
   npm run dev
   # Access application at: http://localhost:3000
   ```

---

## 4. Multi-Tenant Roles (RBAC)

- **Organization Owner**: Full governance, billing, member invites, and approval execution.
- **Operations Admin**: System telemetry, disruption simulation, solver parameters.
- **Supply Chain Manager**: Disruption management, recovery plan review, scenario trade-offs.
- **Logistics Manager**: Shipment tracking, carrier rerouting, freight transit modes.
- **Procurement Manager**: Sourcing replacement tiers, supplier capacity constraints.
- **Viewer**: Read-only access to command center and reports.
