
/*
 * Lab 03 - Exercise 3
 * PUBG Vietnam Live Telemetry
 *
 * Simulated squad data and network requests.
 * ES6+ JavaScript
 */

export const PUBG_SQUADS = [
  {
    id: 'cerberus',
    name: 'CERBERUS Esports',
    region: 'Vietnam',
    players: 4,
    rank: 1,
    kills: 18,
    damage: 4250,
    survivalTime: 28,
    status: 'Alive',
  },
  {
    id: 'the-expendables',
    name: 'The Expendables',
    region: 'Vietnam',
    players: 3,
    rank: 2,
    kills: 14,
    damage: 3680,
    survivalTime: 25,
    status: 'Alive',
  },
  {
    id: 'new-generation',
    name: 'New Generation Esports',
    region: 'Vietnam',
    players: 2,
    rank: 3,
    kills: 11,
    damage: 2910,
    survivalTime: 22,
    status: 'Alive',
  },
  {
    id: 'team-flash',
    name: 'Team Flash',
    region: 'Vietnam',
    players: 0,
    rank: 4,
    kills: 8,
    damage: 2100,
    survivalTime: 19,
    status: 'Eliminated',
  },
];

/*
 * Simulate an asynchronous telemetry request.
 *
 * Supports:
 * - Network latency
 * - Packet loss
 * - AbortController
 * - Retry requests
 *
 * Data is simulated, not actual PUBG match data.
 */

export function fetchSquadTelemetry(
  squadId,
  {
    signal,
    packetLoss = false,
    latency = 1500,
  } = {},
) {
  return new Promise((resolve, reject) => {
    // Reject immediately if the request was aborted.
    if (signal?.aborted) {
      reject(new DOMException('Request aborted', 'AbortError'));
      return;
    }

    const handleAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Request aborted', 'AbortError'));
    };

    const cleanup = () => {
      signal?.removeEventListener('abort', handleAbort);
    };

    const timer = setTimeout(() => {
      cleanup();

      // Simulate packet loss / network failure.
      if (packetLoss) {
        reject(new Error('Packet loss detected. Connection failed.'));
        return;
      }

      const squad = PUBG_SQUADS.find(
        (item) => item.id === squadId,
      );

      if (!squad) {
        reject(new Error('Squad not found.'));
        return;
      }

      resolve({
        ...squad,
        timestamp: new Date().toISOString(),
      });
    }, latency);

    signal?.addEventListener('abort', handleAbort, {
      once: true,
    });
  });
}
