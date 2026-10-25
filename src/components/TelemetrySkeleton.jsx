
import styles from './PUBGTelemetry.module.css';

export default function TelemetrySkeleton() {
  return (
    <section
      className={styles.skeleton}
      aria-label="Loading squad telemetry"
      aria-busy="true"
    >
      <p className={styles.loadingText}>
        Connecting to PUBG telemetry server...
      </p>

      <section className={styles.skeletonGrid} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <article
            key={index}
            className={styles.skeletonCard}
          >
            <span className={styles.skeletonTitle} />
            <span className={styles.skeletonValue} />
          </article>
        ))}
      </section>

      <p className={styles.loadingText}>
        Receiving squad statistics...
      </p>
    </section>
  );
}
