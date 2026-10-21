import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowUpRight, ChevronDown, CircleAlert, Copy, Download, Info } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TOPICS } from '@/data/site';
import { DRAFT_FILENAME, buildDraft, enquirySchema, resolveTopic, type Draft, type EnquiryValues } from './enquiry';

// Draft mode: there is no submission backend. This island validates the fields, builds a plain-text draft in memory
// and lets the visitor copy or download it. Nothing is sent, uploaded or saved (no storage APIs, no network calls).
// A delivery mode needs a verified server-side receiver first; see docs/editing-pack-2026-10-20.md, section 10.

const IDS = {
  name: 'enquiry-name',
  email: 'enquiry-email',
  company: 'enquiry-company',
  topic: 'enquiry-topic',
  message: 'enquiry-message',
} as const;
const ORDER = ['name', 'email', 'company', 'topic', 'message'] as const;

/** aria-invalid + aria-describedby for a control, pointing at its hint and inline error when they exist. */
const aria = (field: keyof EnquiryValues, error?: string, hint = false) => ({
  'aria-invalid': error ? ('true' as const) : undefined,
  'aria-describedby': [hint && `${IDS[field]}-hint`, error && `${IDS[field]}-error`].filter(Boolean).join(' ') || undefined,
});

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="ct-error">
      <CircleAlert size={16} aria-hidden="true" />
      <span>
        <span className="visually-hidden">Error: </span>
        {message}
      </span>
    </p>
  );
}

export default function EnquiryForm({ contactEmail = '' }: { contactEmail?: string }) {
  const recipient = contactEmail.trim();
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const panelRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLPreElement>(null);

  // Validation runs on submit, then re-validates each field as it changes. The first invalid field takes focus.
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', email: '', company: '', message: '' },
  });

  useEffect(() => {
    setReady(true); // Prepare stays disabled until this runs, so a pre-hydration submit can never put entries in the URL.
    const topic = resolveTopic(new URLSearchParams(window.location.search).get('topic'));
    if (topic) setValue('topic', topic);
  }, [setValue]);

  useEffect(() => {
    if (draft) panelRef.current?.focus();
  }, [draft]);

  const onValid = (values: EnquiryValues) => {
    setActionStatus('');
    setDraft(buildDraft(values, recipient));
    setStatus('Your enquiry is ready to review. It has not been sent.');
  };

  const onInvalid = () => {
    setDraft(null);
    setStatus(''); // the error summary announces the problem
  };

  // Any edit after preparing invalidates the draft, so the panel can never show stale details.
  const invalidate = () => {
    if (!draft) return;
    setDraft(null);
    setActionStatus('');
    setStatus('Your details changed. Select Prepare enquiry to create an updated draft.');
  };

  const focusField = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    document.getElementById(id)?.focus();
  };

  const download = () => {
    if (!draft) return;
    const url = URL.createObjectURL(new Blob([draft.text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = DRAFT_FILENAME;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setActionStatus('Enquiry downloaded. This action did not send a message.');
  };

  const copy = async () => {
    if (!draft) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draft.text);
      setActionStatus('Enquiry copied. You can paste it into a message. Nothing has been sent.');
    } catch {
      if (textRef.current) window.getSelection()?.selectAllChildren(textRef.current);
      setActionStatus('Copy is unavailable in this browser. The draft text is selected: press Ctrl+C or Command+C, or use Download enquiry.');
    }
  };

  const failing = ORDER.filter((field) => errors[field]);

  return (
    <>
      <form className="ct-form" noValidate aria-labelledby="enquiry-heading" onSubmit={handleSubmit(onValid, onInvalid)} onChange={invalidate}>
        <div aria-live="polite">
          {failing.length > 0 && (
            <div className="ct-summary" role="group" aria-labelledby="enquiry-summary-title">
              <h3 id="enquiry-summary-title">
                <CircleAlert size={18} aria-hidden="true" />
                Some details need attention
              </h3>
              <ul>
                {failing.map((field) => (
                  <li key={field}>
                    <a href={`#${IDS[field]}`} onClick={(event) => focusField(event, IDS[field])}>
                      {errors[field]?.message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <p className="ct-required-note">All fields are required except company.</p>

        <div className="ct-fields">
          <div className="ct-field">
            <Label className="ct-label" htmlFor={IDS.name}>
              Name
            </Label>
            <Input className="ct-control" id={IDS.name} type="text" autoComplete="name" required {...aria('name', errors.name?.message)} {...register('name')} />
            <FieldError id={`${IDS.name}-error`} message={errors.name?.message} />
          </div>

          <div className="ct-field">
            <Label className="ct-label" htmlFor={IDS.email}>
              Email
            </Label>
            <Input
              className="ct-control"
              id={IDS.email}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              {...aria('email', errors.email?.message)}
              {...register('email')}
            />
            <FieldError id={`${IDS.email}-error`} message={errors.email?.message} />
          </div>

          <div className="ct-field">
            <Label className="ct-label" htmlFor={IDS.company}>
              Company <span className="ct-optional">Optional</span>
            </Label>
            <Input className="ct-control" id={IDS.company} type="text" autoComplete="organization" {...aria('company', errors.company?.message)} {...register('company')} />
            <FieldError id={`${IDS.company}-error`} message={errors.company?.message} />
          </div>

          <div className="ct-field">
            <Label className="ct-label" htmlFor={IDS.topic}>
              Enquiry category
            </Label>
            <div className="ct-select">
              <select className="ct-control" id={IDS.topic} autoComplete="off" required {...aria('topic', errors.topic?.message)} {...register('topic')}>
                <option value="">Choose a category</option>
                {TOPICS.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="ct-select-icon" size={18} aria-hidden="true" />
            </div>
            <FieldError id={`${IDS.topic}-error`} message={errors.topic?.message} />
          </div>

          <div className="ct-field ct-field--wide">
            <Label className="ct-label" htmlFor={IDS.message}>
              Problem or proposal
            </Label>
            <p id={`${IDS.message}-hint`} className="ct-hint">
              Describe the module or vehicle problem, the current baseline, the team or role that owns it and the outcome you want to improve.
            </p>
            <Textarea className="ct-control ct-textarea" id={IDS.message} rows={6} autoComplete="off" required {...aria('message', errors.message?.message, true)} {...register('message')} />
            <FieldError id={`${IDS.message}-error`} message={errors.message?.message} />
          </div>
        </div>

        <div className="ct-submit">
          <Button type="submit" size="lg" disabled={!ready}>
            Prepare enquiry <ArrowRight aria-hidden="true" />
          </Button>
          <p className="ct-fineprint">
            This form prepares a draft in your browser. Preparing, copying or downloading it does not upload the entered fields to Mathsya. The form does not save those fields in browser
            storage. <a href="/privacy">Read the privacy note</a>.
          </p>
        </div>
      </form>

      <p role="status" className="ct-status-line">
        {status}
      </p>

      {draft && (
        <section ref={panelRef} tabIndex={-1} className="ct-draft" aria-labelledby="enquiry-draft-title">
          <div className="ct-draft-head">
            <h3 id="enquiry-draft-title">Review your enquiry</h3>
            <span className="stage stage--neutral">Draft · not sent</span>
          </div>

          <pre ref={textRef} className="ct-draft-text" role="group" tabIndex={0} aria-label="Enquiry draft text">
            {draft.text}
          </pre>

          <div className="ct-draft-actions">
            <Button type="button" onClick={copy}>
              Copy enquiry <Copy aria-hidden="true" />
            </Button>
            <Button type="button" variant="secondary" onClick={download}>
              Download enquiry <Download aria-hidden="true" />
            </Button>
            {draft.mailto && (
              <a className={buttonVariants({ variant: 'secondary' })} href={draft.mailto}>
                Open email draft <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>

          <p role="status" className="ct-status-line">
            {actionStatus}
          </p>

          <p className="note ct-notice">
            <Info size={16} aria-hidden="true" className="flex-none" />
            {draft.mailto ? (
              <span>Open email draft opens your own email application with this text. You decide whether to send it. Some email applications shorten long drafts, so Download enquiry keeps the complete text.</span>
            ) : (
              <span>Our public business inbox is being configured, so this page does not send a message. Copy or download the draft to keep it.</span>
            )}
          </p>
          <p className="ct-fineprint">Editing the form above clears this draft. Select Prepare enquiry again to refresh it.</p>
        </section>
      )}
    </>
  );
}
