# Mathsya — Evo Core
October 2026 | EV power hardware + embedded software | Architecture and hardware planning

## Power brought together. Intelligence built in.
Evo Core is a proposed EV power-hardware and embedded-software platform. It explores common control across defined charging, conversion and distribution functions, with supervisory intelligence for operating context and module behaviour. PMG remains the connected vehicle-software layer.

## Proposed generation roadmap
**Gen 1 — charging and power.** Establish the foundation around the onboard charger (OBC), high-to-low-voltage DC/DC conversion, charging communication through the Electric Vehicle Communication Controller (EVCC), and high-voltage distribution or junction functions, with common control and Edge AI supervision. The reference program determines retained power stages, interfaces, ratings and packaging.

**Gen 2 — battery and thermal.** Extend an evaluated foundation with battery-state context, Battery & Charging AI, limited battery supervisory coordination and broader battery or power thermal orchestration. DC-session and bidirectional functions are options requiring compatible power hardware, interfaces and separate validation.

**Gen 3 — energy and propulsion.** Explore wider energy supervision, reusable interfaces and optional inverter supervisory functions. Any broader control or physical integration depends on compute, isolation, timing, thermal, fault-containment and qualification feasibility.

| Function | Gen 1 | Gen 2 | Gen 3 |
| --- | --- | --- | --- |
| OBC, DC/DC, EVCC and HV distribution | Core scope | Retained foundation | Retained foundation |
| Common control and supervisory AI | Core scope | Extended | Extended |
| Battery & Charging AI | Connected option | Proposed extension | Retained or extended |
| Battery supervisory context | BMS interface | Limited BMS coordination | Wider energy context |
| Cell sensing, balancing and protection | Defined BMS ownership | Defined BMS ownership | Defined BMS ownership |
| Power and battery thermal coordination | Selected interfaces | Proposed extension | Wider coordination |
| Bidirectional functions | Reference program decision | Options requiring hardware proof | Options requiring validation |
| Inverter supervision | External interface | External interface | Future option |
| PMG | Connected vehicle software | Connected vehicle software | Connected vehicle software |

## How integration works
First establish control ownership and approved interfaces. Evaluate shared compute and software, then retained or new power functions. Assess cooling, isolation, connectors, housing and repairability. Verify modes, timing, fault response and the complete cost of realization and qualification.

## Value to evaluate
Customer: charging readiness, clearer power and thermal explanations, and useful health or service guidance through approved vehicle interfaces.
OEM: reusable control and diagnostic software, manageable interfaces and variants, better investigation evidence and a complete commonization cost case.

## Hardware proof path
Reference architecture; controlled bench evidence; prototype and cost evidence; partner vehicle integration and qualification.

## Roadmap boundary
Generation scopes are a working development direction. Ratings, release dates and production specifications are not committed. Sharing control or a housing does not by itself establish lower cost, fewer qualification obligations or bidirectional capability. The 12–16 week plan elsewhere on the site is a PMG software PoC, not a hardware release schedule.

## Commercial direction
Paid engineering, then hardware supply and program software or support. Potential buyers: OEMs and EV power-system partners.

Public source: https://arjunmathsya.vercel.app/evo-core
