
import { Fragment } from 'react';
import SkillBadge from './SkillBadge';
import styles from './DeveloperCard.module.css';

export default function DeveloperCard({
  fullName = 'Đinh Nhật Bảo Nhi',
  role = 'Information Systems Student',
  location = 'Ho Chi Minh City, Vietnam',
 avatar = '/avatar.JPG',
  metrics = {
    commits: 512,
    downloads: 0,
    allyScore: 100,
  },
  skills = [
    { id: 'sk-1', name: 'React 19', level: 'Learning' },
    { id: 'sk-2', name: 'JavaScript ES6+', level: 'Intermediate' },
    { id: 'sk-3', name: 'HTML5 & CSS3', level: 'Intermediate' },
  ],
}) {
  return (
    <article
      className={styles.card}
      aria-labelledby="developer-heading"
    >
      <header className={styles.header}>
        <img
          className={styles.avatar}
          src={avatar}
          alt={`Portrait of ${fullName}`}
          width="240"
          height="240"
        />

        <hgroup>
          <h2 id="developer-heading">{fullName}</h2>
          <p className={styles.role}>{role}</p>
        </hgroup>

        <p className={styles.location}>{location}</p>
      </header>

      <section aria-label="Developer metrics">
        <h3>Developer Metrics</h3>

        <dl className={styles.metrics}>
          {Object.entries(metrics).map(([key, value]) => (
            <Fragment key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      </section>

      <section aria-label="Developer skills">
        <h3>Technical Skills</h3>

        <ul className={styles.skills}>
          {skills.map((skill) => (
            <SkillBadge
              key={skill.id}
              id={skill.id}
              name={skill.name}
              level={skill.level}
            />
          ))}
        </ul>
      </section>
    </article>
  );
}
