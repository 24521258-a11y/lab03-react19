
import styles from './SkillBadge.module.css';

export default function SkillBadge({
  id,
  name,
  level = 'Intermediate',
}) {
  return (
    <li className={styles.badge}>
      <span className={styles.name}>{name}</span>
      <span className={styles.level}>{level}</span>
      <span className={styles.srOnly}>
        Skill ID: {id}
      </span>
    </li>
  );
}
