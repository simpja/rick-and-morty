import Head from "next/head";
import styles from "../styles/Home.module.css";

const defaultEndpoint = "https://rickandmortyapi.com/api/character/";

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const { results = [] } = data;
  console.log("data", data);

  return (
    <div className={styles.container}>
      <Head>
        <title>Rick and Morty Character Show</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to the Rick and Morty character shoooow!
        </h1>

        <p className={styles.description}>You'll get the idea...</p>

        <ul className={styles.grid}>
          {results.map((result) => {
            const { id, name, image } = result;
            return (
              <li className={styles.card} key={id}>
                <a href="https://nextjs.org/docs">
                  <h3>
                    Character &rarr;
                    <br />
                    {name}
                  </h3>
                  <img src={image} alt={`Thumbnail image of ${name}`}></img>
                </a>
              </li>
            );
          })}
        </ul>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
