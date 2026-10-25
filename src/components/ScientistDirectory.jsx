
import { useId, useState } from 'react';
import { SMART_PEOPLE } from '../data/scientists';
import styles from './ScientistDirectory.module.css';

export default function ScientistDirectory({
  initialData = SMART_PEOPLE,
}) {
  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(60);
  const [sortBy, setSortBy] = useState('iq-desc');

  const searchId = useId();
  const iqId = useId();
  const sortId = useId();

  // Derived data: do not store filtered data in useState.
  const visible = people
    .filter((person) =>
      person.name.toLowerCase().includes(query.trim().toLowerCase())
      && person.iq >= minIq
    )
    .toSorted((a, b) => {
      if (sortBy === 'iq-desc') return b.iq - a.iq;
      if (sortBy === 'iq-asc') return a.iq - b.iq;
      if (sortBy === 'age-desc') return b.age - a.age;
      return a.age - b.age;
    });

  const handleDelete = (id) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
  };

  const handleReset = () => {
    setPeople([...SMART_PEOPLE]);
    setQuery('');
    setMinIq(60);
    setSortBy('iq-desc');
  };

  return (
    <section className={styles.directory} aria-labelledby="directory-title">
      <header className={styles.header}>
        <h2 id="directory-title">Scientist & Pioneer Directory</h2>
        <p>Explore and filter outstanding pioneers.</p>
      </header>

      <form
        className={styles.filters}
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor={searchId}>
          Search by name
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for Nhi, Einstein..."
          />
        </label>

        <label htmlFor={iqId}>
          Minimum IQ
          <input
            id={iqId}
            type="number"
            min="0"
            max="300"
            value={minIq}
            onChange={(event) => {
              const value = event.target.valueAsNumber;
              setMinIq(Number.isNaN(value) ? 0 : value);
            }}
          />
        </label>

        <label htmlFor={sortId}>
          Sort by
          <select
            id={sortId}
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="iq-desc">IQ: High to Low</option>
            <option value="iq-asc">IQ: Low to High</option>
            <option value="age-desc">Age: Oldest First</option>
            <option value="age-asc">Age: Youngest First</option>
          </select>
        </label>

        <button type="button" onClick={handleReset}>
          Reset All
        </button>
      </form>

      <p className={styles.counter} role="status" aria-live="polite">
        Found {visible.length} pioneers
      </p>

      {visible.length === 0 ? (
        <p className={styles.empty}>No matching pioneers found.</p>
      ) : (
        <ul className={styles.list}>
          {visible.map((person) => (
            <li key={person.id} className={styles.person}>
              <article>
                <h3>{person.name}</h3>
                <p>Age: {person.age} | IQ: {person.iq}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(person.id)}
                  aria-label={`Delete ${person.name}`}
                >
                  Delete
                </button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
