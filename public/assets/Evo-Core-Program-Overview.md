# Mathsya — Evo Core
October 2026 | EV power hardware + embedded software | Architecture and hardware planning

## Product role
A proposed power platform bringing common control, defined EV conversion/distribution functions and Edge AI supervision into a coordinated architecture. PMG remains the connected vehicle-software layer. Battery & Charging AI may connect as a module product or share suitable compute after feasibility is established.

## Gen 1 — Charging and power foundation
Proposed scope: OBC, DC/DC, EVCC, high-voltage distribution/junction functions and common control with supervisory AI. Existing BMS, PMG, cooling and diagnostic functions connect through defined interfaces.
First integrate control and interfaces. Retain, adapt or develop power stages according to the reference design; combining everything in one housing is a separate packaging decision.

## Gen 2 — Battery and thermal extension
Extend the proven foundation with battery-state context, Battery & Charging AI, limited battery supervisory coordination and broader battery/power thermal orchestration. DC-session support and V2L/V2G are options requiring their own compatible hardware/interfaces and validation.
Cell sensing, balancing and protection retain defined ownership. Shared software does not itself provide a bidirectional power stage or replace cell-monitor hardware.

## Gen 3 — Wider energy coordination
Explore wider energy supervision, optional inverter supervisory functions and reusable interfaces across charging, propulsion and vehicle thermal/climate demands. Any inverter-control commonization or physical integration depends on compute, isolation, timing, thermal, EMC and fault-containment feasibility.
This is not a commitment to replace every vehicle controller or combine every power stage in one unit.

## How integration works
1. Control: review shared compute, modes, diagnostic services and reusable embedded software.
2. Power/interfaces: define retained or new functions and approved supplier interfaces.
3. Physical realization: evaluate cooling, isolation, connectors, housing and mechanical integration.
4. Evidence: verify modes, timing, fault response, thermal/EMC behavior and complete lifecycle cost.

## Customer and OEM outcomes to validate
Customer: readiness, clearer explanations of power/thermal conditions and useful health/service guidance.
OEM: controller/interface simplification, reusable software, evidence-led investigations and manageable variant complexity.
Measures: BOM, NRE, integration/qualification effort, controller/interface count, runtime resources, energy/readiness outcomes, triage time and recurrence. Include tooling, redesign, supplier access, repairability and support in net value.

## Hardware gates and commercial path
Reference scope → bench evidence → prototype/packaging/cost → partner vehicle qualification.
Generation scopes are a working roadmap; ratings, release dates and production specifications are not committed. The site's 12–16 week PMG software PoC is not a production-hardware delivery promise.
Proposed revenue: paid engineering/reference programs, hardware supply and embedded-software/support terms after buyer and cost validation.

Public source: https://mathsya-connected-services.arjtha.chatgpt.site
