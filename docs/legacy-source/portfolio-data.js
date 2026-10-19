window.MATHSYA_PORTFOLIO = {
  "benefits": {
    "battery": {
      "number": "01 / BATTERY CARE",
      "title": "Understand the battery behind the percentage.",
      "scene": "A driver sees a charge percentage. The useful question is whether the battery is ready for the next journey, and whether its behavior is changing.",
      "signals": "Available cell voltages, pack current, temperatures, charging history and validated battery-state estimates.",
      "module": "Battery AI evaluates health trends and unusual behavior, with confidence and data-quality checks.",
      "pmg": "PMG adds departure, journey and service context, then prepares a permitted recommendation and checks its outcome.",
      "customer": "Clearer battery-health guidance and a charging or service decision that fits the next journey.",
      "oem": "Evidence to investigate degradation patterns, review service decisions and identify repeat issues.",
      "proof": "Held-out state-estimation error, actionable alerts, false alerts, customer overrides and independently verified health outcomes."
    },
    "charging": {
      "number": "02 / CHARGING READINESS",
      "title": "Turn a charging session into journey readiness.",
      "scene": "The battery is warm after a long drive. A departure is planned for the morning. Charging, cooling and customer intent need a coordinated response.",
      "signals": "Available charge state, battery temperature, permitted charge limits, charger/session status and departure intent.",
      "module": "Battery and charging intelligence evaluates readiness and unusual session behavior within approved charging limits.",
      "pmg": "PMG combines the module insight with the next journey, requests approved scheduling or preconditioning, and confirms the result.",
      "customer": "A useful readiness plan, clearer charging guidance and fewer avoidable surprises to test.",
      "oem": "Context for session failures, support calls and recurring interoperability or thermal issues.",
      "proof": "Departure-readiness rate, charging completion, attributable energy use, false recommendations and support effort."
    },
    "thermal": {
      "number": "03 / POWER & THERMAL",
      "title": "See a change in behavior before it becomes a service mystery.",
      "scene": "A power module runs warmer than expected under a comparable load. Is it a new operating condition, a cooling issue or a component trend?",
      "signals": "Accessible power, temperature, cooling-command and operating-mode trends, with hardware/software versions.",
      "module": "Evo Core’s supervisory AI compares operating patterns and flags a reviewable change in module behavior.",
      "pmg": "PMG adds vehicle history and journey context, then routes a permitted notification or service recommendation.",
      "customer": "More useful explanations of power or thermal limitations and better-informed service planning.",
      "oem": "Focused evidence for component, cooling and calibration investigations across comparable vehicles.",
      "proof": "Detection lead time on known cases, false alerts, unnecessary interventions, thermal outcomes and investigation hours."
    },
    "service": {
      "number": "04 / OEM QUALITY & SERVICE",
      "title": "Make every relevant event a better investigation.",
      "scene": "A repeat issue appears across releases or vehicles. Quality and service teams need comparable evidence and a way to verify the correction.",
      "signals": "Approved module events, operating context, diagnostics, software/hardware versions and repair outcomes.",
      "module": "Local intelligence preserves focused evidence about the behavior that changed.",
      "pmg": "PMG links the event to vehicle context; optional cloud services compare authorized fleet evidence and track the correction.",
      "customer": "A clearer service recommendation and less repeated diagnosis to validate.",
      "oem": "Faster evidence-led triage, reviewable warranty decisions and measurable learning after a fix.",
      "proof": "Time to isolate a known cause, evidence completeness, no-fault-found rate, recurrence and attributable total cost."
    }
  },
  "generations": {
    "gen1": {
      "number": "GEN 1 / CHARGING & POWER",
      "title": "Establish the power backbone.",
      "intro": "A first Evo Core architecture brings onboard charging, low-voltage conversion, charging communication and high-voltage distribution under a coordinated control foundation.",
      "integrated": [
        "OBC · onboard charging",
        "DC/DC · low-voltage conversion",
        "EVCC · charging communication",
        "HV distribution / junction functions",
        "Common control + Edge AI supervision"
      ],
      "connected": [
        "Existing BMS and its permitted limits",
        "PMG vehicle software",
        "Vehicle cooling and diagnostics interfaces"
      ],
      "method": "Start with controller and interface commonization. Retain, adapt or develop power stages according to the reference design; a single housing is a separate packaging decision.",
      "customer": "Evaluate charging readiness, clearer power-system diagnostics and consistent operating behavior.",
      "oem": "Test controller/interface simplification, reusable software and the complete integration cost case.",
      "gate": "Bench proof of interfaces, operating modes, timing and fault response, plus a bottom-up cost comparison.",
      "boundary": "Working first-generation scope. Ratings, topology, packaging and qualification are defined with the reference program."
    },
    "gen2": {
      "number": "GEN 2 / BATTERY & THERMAL",
      "title": "Connect energy conversion to battery intelligence.",
      "intro": "Extend a proven Gen 1 foundation with battery-state context, Battery & Charging AI and broader battery/power thermal coordination.",
      "integrated": [
        "Proven Gen 1 power foundation",
        "Battery & Charging AI runtime",
        "Battery supervisory coordination",
        "Battery / power thermal orchestration",
        "DC-session and bidirectional functions · options"
      ],
      "connected": [
        "Cell monitors and validated BMS protection",
        "Pumps, fans and thermal controllers",
        "PMG journey and service context"
      ],
      "method": "Share approved battery information and supervisory decisions with the power platform. Cell sensing, protection and balancing hardware keep defined ownership. DC-session support and V2L/V2G require their own compatible interfaces and power hardware.",
      "customer": "Evaluate better charging guidance, thermal readiness and useful battery-health recommendations.",
      "oem": "Test reuse of battery/power evidence, coordinated calibration and reduced investigation effort.",
      "gate": "Battery data and runtime proof, controlled thermal tests, and qualification of every added charging or bidirectional function.",
      "boundary": "Proposed extension after Gen 1 evidence. Software commonization alone does not provide bidirectional power or replace cell-monitor hardware."
    },
    "gen3": {
      "number": "GEN 3 / ENERGY & PROPULSION",
      "title": "Scale toward coordinated vehicle energy.",
      "intro": "Explore a wider energy platform linking the Gen 2 foundation to propulsion and other vehicle energy demands, while PMG connects outcomes at vehicle level.",
      "integrated": [
        "Proven Gen 2 power / battery foundation",
        "Wider energy-supervision runtime",
        "Inverter supervisory functions · option",
        "Shared compute / packaging · subject to feasibility",
        "Reusable product and diagnostic interfaces"
      ],
      "connected": [
        "Validated motor-drive control and protection",
        "Vehicle climate / thermal controllers",
        "PMG + authorized OEM learning services"
      ],
      "method": "Expand supervisory coordination through approved interfaces. Select any inverter-control commonization or physical power-stage integration only after compute, isolation, thermal and validation feasibility is demonstrated.",
      "customer": "Evaluate consistent energy decisions across charging, propulsion, thermal demand and the planned journey.",
      "oem": "Test reuse across vehicle programs, manageable variant complexity and the economics of broader integration.",
      "gate": "Mixed-function timing and isolation proof, system thermal/EMC evidence, fault-containment tests and a validated program business case.",
      "boundary": "Longer-term concept. It is not a commitment to replace every vehicle controller or combine every power stage in one unit."
    }
  }
};
