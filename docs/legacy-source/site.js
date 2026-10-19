(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const menu = document.querySelector('.menu-button');
  const navigation = document.getElementById('navigation');
  if (menu && navigation) {
    const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  }
  const recipient = String(window.MATHSYA_CONTACT_EMAIL || '').trim();
  const publicEmail = document.getElementById('public-email');
  if (publicEmail && recipient) {
    const link = document.createElement('a'); link.href = 'mailto:' + recipient; link.textContent = recipient;
    publicEmail.replaceChildren(link);
    const status = document.getElementById('contact-status');
    if (status) status.textContent = 'INVESTOR & PARTNERSHIP ENQUIRIES';
    const note = document.getElementById('contact-availability');
    if (note) note.textContent = 'Prepare your enquiry below, then open an email draft addressed to Mathsya.';
    const heroNote = document.getElementById('contact-hero-note');
    if (heroNote) heroNote.textContent = 'Prepare your enquiry below, then review and send it using your email application.';
  }
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  document.getElementById('prepare-enquiry').disabled = false;
  const panel = document.getElementById('draft-panel');
  const preview = document.getElementById('enquiry-preview');
  const status = document.getElementById('draft-status');
  const emailAction = document.getElementById('email-enquiry');
  const queryTopic = new URLSearchParams(window.location.search).get('topic');
  const topicField = document.getElementById('enquiry-topic');
  if (queryTopic && [...topicField.options].some(option => option.value === queryTopic)) topicField.value = queryTopic;
  let draft = '';
  const requiredTextFields = [
    {field: document.getElementById('enquiry-name'), message: 'Enter your name.'},
    {field: document.getElementById('enquiry-message'), message: 'Describe your problem or proposal.'}
  ];
  requiredTextFields.forEach(({field}) => field.addEventListener('input', () => field.setCustomValidity('')));
  const clearDraft = () => {
    if (!draft) return;
    draft = ''; preview.textContent = ''; panel.hidden = true;
    emailAction.hidden = true; emailAction.removeAttribute('href');
    status.textContent = 'Your details changed. Select Prepare enquiry to create an updated draft.';
  };
  form.addEventListener('input', clearDraft);
  form.addEventListener('change', clearDraft);
  form.addEventListener('submit', event => {
    event.preventDefault();
    requiredTextFields.forEach(({field, message}) => field.setCustomValidity(field.value.trim() ? '' : message));
    if (!form.reportValidity()) return;
    const value = id => document.getElementById(id).value.trim();
    const topic = value('enquiry-topic');
    const subject = 'Mathsya enquiry: ' + topic;
    draft = [subject, '', 'Name: ' + value('enquiry-name'), 'Email: ' + value('enquiry-email'), 'Company: ' + (value('enquiry-company') || 'Not provided'), 'Interest: ' + topic, '', value('enquiry-message')].join('\n');
    preview.textContent = draft; panel.hidden = false;
    status.textContent = 'Your enquiry is ready to review and download. It has not been sent.';
    if (recipient) { emailAction.href = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(draft); emailAction.hidden = false; }
    else emailAction.hidden = true;
    panel.focus();
  });
  document.getElementById('download-enquiry').addEventListener('click', () => {
    if (!draft) return;
    const url = URL.createObjectURL(new Blob([draft], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = 'Mathsya-Partnership-Enquiry.txt'; document.body.append(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Enquiry downloaded. This action did not send a message.';
  });
  document.getElementById('copy-enquiry').addEventListener('click', async () => {
    if (!draft) return;
    try { if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(draft); status.textContent = 'Enquiry copied. You can paste it into a message.'; }
    catch { status.textContent = 'Copy is unavailable in this browser. Use Download enquiry instead.'; }
  });
})();
