import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import db from '../../services/firebaseConnection';
import { doc, setDoc } from 'firebase/firestore';
import { PayPalButtons } from '@paypal/react-paypal-js';

import styles from './styles.module.scss';

import RocketIcon from './../../../public/images/rocket.svg';

interface DonateProps{
    user: {
        name: string;
        id: string;
        image: string;
    }
}

export default function Donate({user}: DonateProps){

    const[vip, setVip] = useState(false);

    const handleSaveDonation = async() => {

        const docRef = doc(db, 'users', user.id);
        const payload = {
            donate: true,
            lastDonate: new Date(),
            image: user.image
        }
        await setDoc(docRef, payload)
        .then(() => {
            setVip(true);
        })
        .catch((err) => {
            console.log(err);
        });

    }

    return(
        <>
            <Head>
                <title>Ajude a plataforma board ficar online!</title>
            </Head>
            <main className={styles.container}>
                <Image src={RocketIcon} alt='Seja apoiador' className={styles.rocket} />

                {vip && 
                    <div className={styles.vip}>
                        <Image src={user.image} width={50} height={50} alt="Foto de perfil do usuário" />
                        <span>Parabéns, você já é nosso apoiador.</span>
                    </div>
                }

                <h1>Seja um apoiador desse projeto 🏆</h1>
                <h3>Contribua com apenas <span>R$ 1,00</span></h3>
                <strong>Apareça na nossa home, tenha funcionalidades exclusivas.</strong>

                <PayPalButtons 
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '1'
                                }
                            }]
                        })
                    }} 
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            console.log("Compra aprovada: " + details.payer.name.given_name);
                            handleSaveDonation();
                        })
                    }}
                />

            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async({req}) => {

    const session = await getSession({req});

    if(!session?.id){
        return{
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const user = {
        name: session?.user.name,
        id: session?.id,
        image: session?.user.image
    }

    return{
        props: {
            user
        }
    }
}