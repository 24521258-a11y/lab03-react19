
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
  const [requestCount, setRequestCount] = useState(0);

  const [request, setRequest] = useState(null);

  const [result, setResult] = useState({
    status: STATUS.IDLE,
    data: null,
    error: '',
  });

  const squadSelectId = useId();
  const packetLossId = useId();

  // Start a new request by changing the request parameters.
  const handleConnect = () => {
    setRequestCount((previous) => previous + 1);
    setRequest({
      squadId,
      packetLoss,
      attempt: requestCount + 1,
    });
  };

  const handleSquadChange = (event) => {
    const nextSquadId = event.target.value;

    setSquadId(nextSquadId);
    setRequestCount((previous) => previous + 1);

    // Switching squads starts a new request automatically.
    setRequest({
      squadId: nextSquadId,
      packetLoss,
      attempt: requestCount + 1,
    });
  };

  const handlePacketLossChange = (event) => {
    setPacketLoss(event.target.checked);
  };

  useEffect(() => {
    if (!request) {
      return undefined;
    }

    const controller = new AbortController();

    // Request lifecycle starts.
    // This is an intentional loading transition.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult({
      status: STATUS.LOADING,
      data: null,
      error: '',
    });

    fetchSquadTelemetry(request.squadId, {
      signal: controller.signal,
      packetLoss: request.packetLoss,
      latency: 1500,
    })
      .then((data) => {
        if (controller.signal.aborted) return;

        setResult({
          status: STATUS.SUCCESS,
          data,
          error: '',
        });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        if (error.name === 'AbortError') return;

        setResult({
          status: STATUS.ERROR,
          data: null,
          error: error.message,
        });
      });

    // Cancel old requests when switching squad or unmounting.
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

      <section className={styles.controls} aria-label="Telemetry controls">
        <label className={styles.controlGroup} htmlFor={squadSelectId}>
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

        <label className={styles.checkboxLabel} htmlFor={packetLossId}>
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
          {result.status === STATUS.ERROR
            ? 'Retry / Reconnect'
            : 'Connect'}
        </button>
      </section>

      <p
        className={styles.status}
        role="status"
        aria-live="polite"
      >
        Connection Status: {result.status}
      </p>

      {result.status === STATUS.IDLE && (
        <p>
          Select a squad and press Connect to start monitoring.
        </p>
      )}

      {result.status === STATUS.LOADING && (
        <TelemetrySkeleton />
      )}

      {result.status === STATUS.ERROR && (
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

      {result.status === STATUS.SUCCESS && result.data && (
        <section
          aria-label="Squad statistics"
        >
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
