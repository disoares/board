import React, {useState} from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from './../styles/styles.module.scss';
import db from '../services/firebaseConnection';
import { collection, getDocs, query } from 'firebase/firestore';

import BoardUserIcon from './../../public/images/board-user.svg';

type Data = {
  id: string,
  donate: boolean,
  lastDonate: Date,
  image: string
}

interface HomeProps {
  data: string
}

export default function Home({data}: HomeProps) {

  const[donaters, setDonaters] = useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <Image src={BoardUserIcon} alt='Ferramenta board' />

        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia. Escreva, planeje e organize-se.</h1>
          <p>
            <span>100% gratuita</span> e online.
          </p>
        </section>

        <div className={styles.donaters}>
          <p>Apoiadores:</p>
          {donaters.map((item, key) => (
            <Image key={key} src={item.image} width={65} height={80} alt='Apoiador' />
          ))}          
        </div>

      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const donaters = query(collection(db, 'users'));

  const querySnapshot = await getDocs(donaters);
  const data = JSON.stringify(querySnapshot.docs.map((doc) => {
    return{
      id: doc.id,
      ...doc.data()
    }
  }));

  return {
    props: {
      data
    },
    revalidate: 60 * 60
  }
}