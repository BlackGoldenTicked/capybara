// Minimal test harness (no deps)
export function test(name, fn) {
  try { fn(); console.log('  ok  -', name) }
  catch (e) { console.error('  FAIL -', name, '\n      ', e.message); process.exitCode = 1 }
}
export function assert(cond, msg) { if (!cond) throw new Error(msg || 'assertion failed') }
export function assertEq(a, b) { if (a !== b) throw new Error(`expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`) }
