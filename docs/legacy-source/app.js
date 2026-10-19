(() => {
  'use strict';
  const workflows = {
    battery: {number:'01 / 03', title:'Prepare for the next journey.', intro:'Combine battery trends, departure intent and charging context into a useful readiness decision.', steps:[['Understand the battery','Read available health, charge and thermal trends.'],['Add the journey','Consider departure time, route and charging opportunities.'],['Request a permitted action','Recommend a charging plan or approved preconditioning.'],['Verify readiness','Check the outcome and record what helped.']], proof:'Useful readiness outcomes, appropriate alerts and low override rates.'},
    quality: {number:'02 / 03', title:'Turn a vehicle event into a learning loop.', intro:'Investigate a thermal or pump behavior change with linked vehicle history and comparable fleet context.', steps:[['Detect behavioral drift','Compare available signals with the expected operating behavior.'],['Preserve focused evidence','Link the event to operating context and hardware/software versions.'],['Support the investigation','Find comparable events and help an engineer test a likely explanation.'],['Verify the correction','Compare behavior after an approved fix and record the result.']], proof:'Evidence completeness, investigation time and recurrence after the correction.'},
    incident: {number:'03 / 03', title:'Preserve the context when it matters.', intro:'Enrich the established incident and recovery process with available vehicle evidence.', steps:[['Receive an authoritative trigger','Use the vehicle’s existing certified incident detection.'],['Preserve the event history','Retain available before-and-after vehicle context.'],['Prepare the permitted handoff','Include location, relevant vehicle states and connectivity status.'],['Confirm delivery','Record acknowledgement or retain evidence until connectivity returns.']], proof:'Incident-field completeness, offline persistence and acknowledged handoff.'}
  };
  const audiences = {
    strategic:{label:'A PARTNER-DEFINED ENTRY POINT', title:'Bring a use case. Build the proof together.', copy:'A nominated module or vehicle use case, approved data and an agreed business baseline create the foundation for a scoped Edge AI PoC.', points:['Compare module and business outcomes against the existing workflow.','Define integration responsibility and acceptance criteria.','Advance to a paid program when technical and commercial gates are met.']},
    capital:{label:'CAPITAL ALIGNED TO TECHNICAL MILESTONES', title:'Fund evidence that can support a scalable product.', copy:'The next stage develops Edge AI runtime, module integration and validation evidence to test vehicle value, organizational outcomes and a repeatable commercial model.', points:['Fund defined work packages and measurable pilot outcomes.','Test the licensing thesis and customer willingness to pay.','Release follow-on capital against integration, value and qualification gates.']}
  };
  function tabs(selector, onSelect) {
    const buttons = Array.from(document.querySelectorAll(selector));
    const select = button => { buttons.forEach(item => { const selected = item === button; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; }); onSelect(button); };
    buttons.forEach(button => { button.tabIndex = button.getAttribute('aria-selected') === 'true' ? 0 : -1; button.addEventListener('click', () => select(button)); button.addEventListener('keydown', event => { let index = buttons.indexOf(button); if(event.key === 'ArrowRight') index = (index + 1) % buttons.length; else if(event.key === 'ArrowLeft') index = (index - 1 + buttons.length) % buttons.length; else if(event.key === 'Home') index = 0; else if(event.key === 'End') index = buttons.length - 1; else return; event.preventDefault(); select(buttons[index]); buttons[index].focus(); }); });
  }
  const text = (id, value) => { document.getElementById(id).textContent = value; };
  tabs('[data-case]', button => {
    const data = workflows[button.dataset.case];
    text('case-number', data.number); text('case-title', data.title); text('case-intro', data.intro); text('case-proof', data.proof);
    document.getElementById('case-panel').setAttribute('aria-labelledby', button.id);
    const steps = data.steps.map((step, index) => { const li = document.createElement('li'); const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2,'0'); const content = document.createElement('div'); const title = document.createElement('strong'); title.textContent = step[0]; const copy = document.createElement('p'); copy.textContent = step[1]; content.append(title,copy); li.append(number,content); return li; });
    document.getElementById('case-workflow').replaceChildren(...steps);
  });
  tabs('[data-audience]', button => {
    const data = audiences[button.dataset.audience];
    text('investor-label',data.label); text('investor-panel-title',data.title); text('investor-panel-copy',data.copy);
    document.getElementById('investor-panel').setAttribute('aria-labelledby',button.id);
    document.getElementById('investor-points').replaceChildren(...data.points.map(value => { const li = document.createElement('li'); li.textContent = value; return li; }));
  });
})();
