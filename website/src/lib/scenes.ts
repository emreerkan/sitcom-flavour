// Mock Claude Code sessions for the hero demo. Each ends with a line from a bank.
export type Scene = {
  prompt: string;
  tool: string;
  result: string;
  ok: boolean;
  reply: string;
  line: string;
  show: string;
};

export const scenes: Scene[] = [
  {
    prompt: 'run the suite again',
    tool: 'Bash(pnpm test)',
    result: '214 passed · 0 failed · 3.2s',
    ok: true,
    reply: 'All green, including the auth test that flaked twice this morning. The retry fix holds.',
    line: 'Noice. Smort.',
    show: 'Brooklyn Nine-Nine',
  },
  {
    prompt: 'is the queue bug gone?',
    tool: 'Bash(pnpm test queue)',
    result: '1 failed · worker drops job under load',
    ok: false,
    reply: 'No. The lock narrowed the window, but two workers can still claim the same job between the SELECT and the UPDATE.',
    line: 'And yet, crime has continued.',
    show: 'Brooklyn Nine-Nine',
  },
  {
    prompt: 'what would the new log tier cost us?',
    tool: 'Read(billing/usage.csv)',
    result: '2.3 TB ingested last month',
    ok: true,
    reply: 'About $4,100 a month, not $40. That tier bills per GB ingested, not per GB stored.',
    line: "It's one banana, Michael. What could it cost, ten dollars?",
    show: 'Arrested Development',
  },
  {
    prompt: 'what does includes/legacy-date.php do?',
    tool: 'Read(includes/legacy-date.php)',
    result: '1,204 lines · 3 hardcoded timezones',
    ok: true,
    reply: 'It reimplements strtotime() with three hardcoded timezones and a leap-year table that stops at 2019.',
    line: 'Why are you the way that you are?',
    show: 'The Office',
  },
  {
    prompt: 'why does staging pass and prod fail?',
    tool: 'Bash(diff .env.staging .env.production)',
    result: '7 keys differ · CACHE_DRIVER=file vs redis',
    ok: false,
    reply: 'Staging caches to disk, prod to Redis, and the session serializer only works with one of them.',
    line: 'Staging just put on a felt goatee.',
    show: 'Community',
  },
  {
    prompt: 'why was the customer charged twice?',
    tool: 'Grep(handlePaymentWebhook)',
    result: 'no idempotency key on the charge call',
    ok: false,
    reply: 'The webhook timed out, Stripe retried it, and the handler charged the card again. Nothing checks whether the event was already processed.',
    line: 'Did you just double-dip that webhook?',
    show: 'Seinfeld',
  },
];
