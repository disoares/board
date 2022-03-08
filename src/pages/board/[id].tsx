import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { doc, getDoc } from "firebase/firestore";
import db from "../../services/firebaseConnection";
import { format } from "date-fns";
import { FiCalendar } from "react-icons/fi";

import styles from './task.module.scss';

type Task = {
    id: string;
    created: string | Date;
    createdFormatted?: string;
    task: string;
    userId: string;
    name: string;
}

interface TaskListProps{
    data: string;
}

export default function Task({data}: TaskListProps){

    const task = JSON.parse(data) as Task;

    return(
        <>
            <Head>
                <title>Detalhes da sua tarefa</title>
            </Head>
            <article className={styles.container}>
                <div className={styles.actions}>
                    <div>
                        <FiCalendar size={30} color='#ffffff' />
                        <span>Tarefa criada:</span>
                        <time>{task.createdFormatted}</time>
                    </div>
                </div>
                <p>
                    {task.task}
                </p>
            </article>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async({req, params}) => {

    const {id} = params;
    const session = await getSession({req});

    if(!session?.vip){
        return {
            redirect: {
                destination: '/board',
                permanent: false
            }
        }
    }

    const docRef = doc(db, 'tasks', String(id));
    const data = await getDoc(docRef)
    .then((snapshot) => {
        const data = {
            id: snapshot.id,
            created: snapshot.data().created, 
            createdFormatted: format(snapshot.data().created.toDate(), 'dd MMMM yyyy'),
            task: snapshot.data().task,
            userId: snapshot.data().userId,
            name: snapshot.data().name
        }

        return JSON.stringify(data);
    })
    .catch((err) => {
        return {};
    });

    if(Object.keys(data).length === 0){
        return {
            redirect: {
                destination: '/board',
                permanent: false
            }
        }
    }

    return{
        props: {
            data
        }
    };
}