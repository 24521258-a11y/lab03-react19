
import { useEffect, useId, useState } from 'react';
import {
  PUBG_SQUADS,
  fetchSquadTelemetry,
} from '../data/pubgData';
import TelemetrySkeleton from './TelemetrySkeleton';
import styles from './PUBGTelemetry.module.css';

const STATUS = {
  IDLE: 'IDLE',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

export default function PUBGTelemetry() {
  const [squadId, setSquadId] = useState(PUBG_SQUADS[0].id);
  const [packetLoss, setPacketLoss] = useState(false);
  const [request, setRequest] = useState(null);

  const [result, setResult] = useState({
    requestId: null,
    status: STATUS.IDLE,
    data: null,
    error: '',
  });

  const squadSelectId = useId();
  const packetLossId = useId();

  // Create a unique request for every connection attempt.
  const startRequest = (nextSquadId, nextPacketLoss) => {
    setRequest((previous) => ({
      id: (previous?.id ?? 0) + 1,
      squadId: nextSquadId,
      packetLoss: nextPacketLoss,
    }));
  };

  // Start connection or retry after an error.
  const handleConnect = () => {
    startRequest(squadId, packetLoss);
  };

  // Automatically connect when switching squads.
  const handleSquadChange = (event) => {
    const nextSquadId = event.target.value;

    setSquadId(nextSquadId);
    startRequest(nextSquadId, packetLoss);
  };

  const handlePacketLossChange = (event) => {
    setPacketLoss(event.target.checked);
  };

  // Derive the current visible status.
  // No synchronous setState inside useEffect.
  const status = !request
    ? STATUS.IDLE
    : result.requestId !== request.id
      ? STATUS.LOADING
      : result.status;

  useEffect(() => {
    if (!request) {
      return undefined;
    }

    const controller = new AbortController();

    fetchSquadTelemetry(request.squadId, {
      signal: controller.signal,
      packetLoss: request.packetLoss,
      latency: 1500,
    })
      .then((data) => {
        if (controller.signal.aborted) return;

        setResult({
          requestId: request.id,
          status: STATUS.SUCCESS,
          data,
          error: '',
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error.name === 'AbortError') return;

        setResult({
          requestId: request.id,
          status: STATUS.ERROR,
          data: null,
          error: error.message,
        });
      });

    // Cleanup prevents stale requests from updating state.
    return () => {
      controller.abort();
    };
  }, [request]);

  return (
    <section
      className={styles.telemetry}
      aria-labelledby="pubg-title"
    >
      <header className={styles.header}>
        <h2 id="pubg-title">
          PUBG Vietnam Live Telemetry
        </h2>

        <p className={styles.subtitle}>
          Simulated real-time squad monitoring dashboard
        </p>
      </header>

      <section
        className={styles.controls}
        aria-label="Telemetry controls"
      >
        <label
          className={styles.controlGroup}
          htmlFor={squadSelectId}
        >
          Select Squad

          <select
            id={squadSelectId}
            value={squadId}
            onChange={handleSquadChange}
          >
            {PUBG_SQUADS.map((squad) => (
              <option key={squad.id} value={squad.id}>
                {squad.name}
              </option>
            ))}
          </select>
        </label>

        <label
          className={styles.checkboxLabel}
          htmlFor={packetLossId}
        >
          <input
            id={packetLossId}
            type="checkbox"
            checked={packetLoss}
            onChange={handlePacketLossChange}
          />
          Simulate Packet Loss
        </label>

        <button
          type="button"
          className={styles.button}
          onClick={handleConnect}
        >
          {status === STATUS.ERROR
            ? 'Retry / Reconnect'
            : 'Connect'}
        </button>
      </section>

      <p
        className={styles.status}
        role="status"
        aria-live="polite"
      >
        Connection Status: {status}
      </p>

      {status === STATUS.IDLE && (
        <p>
          Select a squad and press Connect to start monitoring.
        </p>
      )}

      {status === STATUS.LOADING && (
        <TelemetrySkeleton />
      )}

      {status === STATUS.ERROR && (
        <section
          className={styles.error}
          role="alert"
          aria-labelledby="telemetry-error-title"
        >
          <h3 id="telemetry-error-title">
            Connection Failed
          </h3>

          <p>{result.error}</p>

          <p>
            Disable packet loss and press Retry / Reconnect.
          </p>
        </section>
      )}

      {status === STATUS.SUCCESS && result.data && (
        <section aria-label="Squad statistics">
          <h3>{result.data.name}</h3>

          <p>Region: {result.data.region}</p>

          <section className={styles.statsGrid}>
            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                Match Rank
              </span>
              <strong className={styles.statValue}>
                #{result.data.rank}
              </strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                Total Kills
              </span>
              <strong className={styles.statValue}>
                {result.data.kills}
              </strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                Total Damage
              </span>
              <strong className={styles.statValue}>
                {result.data.damage.toLocaleString()}
              </strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                Players Alive
              </span>
              <strong className={styles.statValue}>
                {result.data.players}
              </strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                Survival Time
              </span>
              <strong className={styles.statValue}>
                {result.data.survivalTime} min
              </strong>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>
                Squad Status
              </span>
              <strong className={styles.statValue}>
                {result.data.status}
              </strong>
            </article>
          </section>

          <p className={styles.timestamp}>
            Last updated:{' '}
            {new Date(result.data.timestamp).toLocaleString()}
          </p>
        </section>
      )}
    </section>
  );
}
