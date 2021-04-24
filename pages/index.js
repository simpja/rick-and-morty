import { useEffect, useState } from "react";
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
  // Four things happening on following line:
  //    Using destructuring to set results from data.results
  //    renaming results to defaultResults
  //    and setting defaultResults to [] in case data.result = null
  //    Getting also the data.info object that contains contination url for pagination
  const { info, results: defaultResults = [] } = data;
  // Using Iterable Destructuring with React Hook useState
  // Here is the equivalent of the following line in the old "React pre Hooks"-syntax
  // First you would have to make results a state object, then:
  // results = this.state.results;
  // updateResults(defaultResults) = this.setState({ results: defaultResults });
  const [results, updateResults] = useState(defaultResults);

  // Set a new object state called page, and its update function updatePage (that sets this state object)
  // give it the initial value of the data.info object from the API
  // and add an attribute to the state object called current with initial value of defaultEndpoint
  // We will use current to keep track of what page from the API we called most recently to help keep track of pagination
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });

  const { current } = page;

  // useEffect on the "current" variable.
  // "current" will be set to the "next" url on button "Load More" click
  // Now, everytime "current" changes we:
  //     * call the api with the current "current" endpoint (being the next url)
  //     * update the page state object with the updated info object from the fetched data
  //     * add the new data.results to our existing results state object
  useEffect(() => {
    // If we got the initial page, return
    if (current === defaultEndpoint) return;

    // define an async function: request:
    async function request() {
      // call the API with current as the URL
      const res = await fetch(current);
      const nextData = await res.json();

      // call our updatePage to update our page state object with data from the new page
      updatePage({
        current,
        ...nextData.info,
      });

      // if data.info.prev (url of the previous page) does not exists,
      // we are on the inital page. Meaning our results state object can -
      // simply be set to the results array of the data we just fetched
      if (!nextData.info?.prev) {
        console.log("Am i first page, or not first?");
        updateResults(nextData.results);
        return;
      }

      // If there is a nextData.info.prev, we are not on the first page
      // meaning we can assume we alredy have results in our results state object
      // Then we would rather add the newly fetched results to our existing results

      // updateResults takes one argument, a results object. BUT...
      // you can also give it a function as an argument, that will evaluate to what will be the new value of the state object
      // Here, we let results be equal to itself plus nextData.results,
      // effectively merging the new results array into the existing
      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }
    // Run the function right away
    request();
  }, [current]);

  // This function runs when we click the "Load More" button
  // It sets the current attribute to the next url (the url to fetch the next page)
  // This kicks off our useEffect above, that is listening to changes in excactly our "current" variable
  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

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

        <button onClick={handleLoadMore}>Load More</button>
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
