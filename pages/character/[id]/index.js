import Head from "next/head";
import styles from "../../../styles/Character.module.css";
import Link from "next/link";

const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export async function getServerSideProps(context) {
  const id = context.query.id;
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Character({ data }) {
  const { name, image, gender, location, origin, species, status } = data;
  return (
    <div className={styles.container}>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{name}!</h1>

        <div className={styles.profile}>
          <div className={styles.profile_image}>
            <img src={image} alt={name} />
          </div>
          <div className={styles.profile_details}>
            <h2>Character Details</h2>
            <ul>
              <li>
                <strong>Name:</strong>
                {name}
              </li>
              <li>
                <strong>Status:</strong>
                {status}
              </li>
              <li>
                <strong>Gender:</strong>
                {gender}
              </li>
              <li>
                <strong>Species:</strong>
                {species}
              </li>
              <li>
                <strong>Location:</strong>
                {location?.name}
              </li>
              <li>
                <strong>Originally From:</strong>
                {origin?.name}
              </li>
            </ul>
          </div>
        </div>

        <p className={styles.back}>
          <Link href="/">
            <a>Back to All Characters</a>
          </Link>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/simpja/rick-and-morty"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by&nbsp;<b>simpja</b>{" "}
          <img
            src="/GitHub-Mark-32px.png"
            alt="Github Logo"
            className={styles.logo}
          />
        </a>
      </footer>
    </div>
  );
}
