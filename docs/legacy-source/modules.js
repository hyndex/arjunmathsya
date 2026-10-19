(() => {
  'use strict';
  const modules = {
    battery:{title:'Battery & charging readiness',signals:'Available charge, health and temperature trends, combined with departure and charging context.',module:'Interpret trends and flag unusual behavior for an approved readiness or service decision.',vehicle:'Support useful charging plans and departure readiness.',organization:'Evaluate alert usefulness, repeat issues and the evidence available to quality and service teams.',proof:'Readiness usefulness, false alerts, override rate and attributable investigation effort.'},
    power:{title:'EV power & thermal context',signals:'Available power-stage, temperature, cooling and operating-mode observations.',module:'Explore health and thermal-pattern inference alongside validated control and protection.',vehicle:'Inform permitted charging and cooling recommendations.',organization:'Evaluate fault-investigation time and verified energy, thermal or service value.',proof:'Signal and interface feasibility, inference resource needs, false alerts and measured net value.'},
    connectivity:{title:'Connected functions & telematics',signals:'Remote-function events, connectivity transitions, positioning context and release information.',module:'Link intermittent behavior to operating context and software or hardware versions.',vehicle:'Support clearer diagnosis of unreliable connected experiences.',organization:'Give engineering and quality teams focused evidence for release and field investigations.',proof:'Evidence completeness, localization time and recurrence after an approved correction.'}
  };
  const buttons = [...document.querySelectorAll('[data-module]')];
  if (!buttons.length) return;
  const select = button => {
    buttons.forEach(item => { const active = item === button; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
    const data = modules[button.dataset.module];
    for (const key of ['title','signals','module','vehicle','organization','proof']) document.getElementById('module-' + key).textContent = data[key];
    document.getElementById('module-output').setAttribute('aria-labelledby', button.id);
  };
  buttons.forEach(button => {
    button.tabIndex = button.getAttribute('aria-selected') === 'true' ? 0 : -1;
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      let index = buttons.indexOf(button);
      if (event.key === 'ArrowRight') index = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') index = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = buttons.length - 1;
      else return;
      event.preventDefault(); select(buttons[index]); buttons[index].focus();
    });
  });
})();
