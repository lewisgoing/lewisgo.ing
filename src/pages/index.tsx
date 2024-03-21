import Head from "next/head";
import NavBar from "../../components/NavBar";
import Bento from "../../components/Bento";

export default function Home() {
  return (
    <>
      {/* <Head>
        <title>My portfolio</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      {/* <NavBar /> */}
      {/* <div className="divide-y divide-accent-foreground dark:divide-accent"> */}
      {/* <div className="mx-auto md:-mx-[5vw] lg:-mx-[20vw]"> */}
      <div className="divide-y divide-accent-foreground dark:divide-accent">
        <div className="mx-auto bento-md:-mx-[5vw] bento-lg:-mx-[20vw]">
          <Bento />
        </div>
      </div>

      {/* </div> */}
      {/* </div> */}
    </>
  );
}
