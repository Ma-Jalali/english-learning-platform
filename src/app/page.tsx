const courseFamilies = [
  "General English A1–C1",
  "Cambridge English",
  "IELTS, TOEFL iBT and PTE",
  "EAP and Business English",
  "Young Learners",
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <p className="eyebrow">English learning, designed for real classrooms</p>
        <h1>Clear courses. Meaningful feedback. Visible progress.</h1>
        <p className="intro">
          A specialist platform for English learners, teachers and academic designers.
          Core courses stay consistent; teachers support their own cohorts safely.
        </p>
        <div className="actions">
          <button type="button">Explore courses</button>
          <button className="secondary" type="button">Teacher sign in</button>
        </div>
      </section>

      <section className="panel" aria-labelledby="principle-heading">
        <p className="eyebrow">Platform principle</p>
        <h2 id="principle-heading">Teachers guide learning. Students create evidence.</h2>
        <p>
          Academic designers control the official course sequence. Teachers can add
          class announcements and supplementary practice only in dedicated slots.
        </p>
      </section>

      <section className="courses" aria-labelledby="courses-heading">
        <div>
          <p className="eyebrow">Course families</p>
          <h2 id="courses-heading">One platform, built for English learning.</h2>
        </div>
        <ul>
          {courseFamilies.map((courseFamily) => (
            <li key={courseFamily}>{courseFamily}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

