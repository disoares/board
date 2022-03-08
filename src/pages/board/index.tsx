import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import { format, formatDistance } from 'date-fns';
import {ptBR} from 'date-fns/locale';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiClock, FiX } from 'react-icons/fi';

import styles from './styles.module.scss';
import SuportButton from '../../components/SuportButton';

import db from './../../services/firebaseConnection';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc, updateDoc } from '@firebase/firestore';

type TaskList = {
    id: string;
    created: string | Date;
    createdFormated?: string;
    task: string;
    userId: string;
    name: string
}

interface BoardProps {
    user: {
        id: string;
        nome: string;
        vip: boolean;
        lastDonate?: string | Date;
    },
    data: string
}

export default function Board({ user, data }: BoardProps) {

    const [input, setInput] = useState('');
    const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
    const[taskEdit, setTaskEdit] = useState<TaskList | null>(null);

    const handleAddTask = async (e: FormEvent) => {
        e.preventDefault();

        if (input === '') {
            return;
        }

        if(taskEdit){

            await updateDoc(doc(db, 'tasks', taskEdit.id), {
                task: input
            })
            .then(() => {

                let data = taskList;
                let taskIndex = taskList.findIndex(item => item.id === taskEdit.id);
                data[taskIndex].task = input;

                setTaskList(data);

                setInput('');
                setTaskEdit(null);

            })
            .catch((err) => {
                console.log(err);
            });

            return;
        }

        const collectionRef = collection(db, 'tasks');
        const payload = {
            created: new Date(),
            task: input,
            userId: user.id,
            name: user.nome
        };
        await addDoc(collectionRef, payload).then((res) => {

            let data = {
                id: res.id,
                created: new Date(),
                createdFormated: format(new Date(), 'dd MMMM yyyy'),
                task: input,
                userId: user.id,
                name: user.nome
            }

            setTaskList([...taskList, data]);
            setInput('');

        }).catch((err) => {
            console.log(err);
        });
    }

    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, 'tasks', id))
        .then(() => {

            let newList = taskList.filter(item => {
                return (item.id !== id);
            });

            setTaskList(newList);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const handleEditTask = (task: TaskList) => {
        setTaskEdit(task);
        setInput(task.task);        
    }

    const handleCancelEdit = () => {
        setInput('');
        setTaskEdit(null);
    }

    return (
        <>
            <Head>
                <title>Minha tarefas - Board</title>
            </Head>
            <main className={styles.container}>

                {taskEdit && (
                    <span className={styles.warnText}>
                        <button onClick={handleCancelEdit}>
                            <FiX size={30} color='#ff3636' />
                        </button>
                        Você está editando uma tarefa.
                    </span>
                )}

                <form onSubmit={handleAddTask}>
                    <input type="text" placeholder='Digite sua tarefa' value={input} onChange={(e) => setInput(e.target.value)} />
                    <button type="submit">
                        <FiPlus size={25} color='#17181f' />
                    </button>
                </form>
                <h1>Você tem {taskList.length} {taskList.length === 1 ? 'tarefa' : 'tarefas'}!</h1>
                <section>
                    {taskList.map((task, key) => (
                        <article key={key} className={styles.taskList}>
                            <Link href={`/board/${task.id}`} passHref>
                                <a>
                                    <p>{task.task}</p>
                                </a>
                            </Link>
                            <div className={styles.actions}>
                                <div>
                                    <div>
                                        <FiCalendar size={20} color='#ffb800' />
                                        <time>{task.createdFormated}</time>
                                    </div>
                                    {user.vip && 
                                        <button onClick={() => handleEditTask(task)}>
                                            <FiEdit2 size={20} color='#ffffff' />
                                            <span>Editar</span>
                                        </button>
                                    }
                                </div>
                                <button onClick={() => handleDelete(task.id)}>
                                    <FiTrash size={20} color='#ff3636' />
                                    <span>Excluir</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
            {user.vip && 
                <div className={styles.vipContainer}>
                    <h3>Obrigado por apoiar esse projeto.</h3>
                    <div>
                        <FiClock size={28} color='#ffffff' />
                        <time>Última doação foi a {formatDistance(new Date(user.lastDonate), new Date(), {locale: ptBR})}.</time>
                    </div>
                </div>
            }

            <SuportButton />

        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req });

    if (!session?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    let documents = [];
    const q = query(collection(db, 'tasks'), where('userId', '==', session?.id));
    const tasks = await getDocs(q);

    tasks.forEach((doc) => {
        const curDoc = {
            id: doc.id,
            createdFormated: format(doc.data().created.toDate(), 'dd MMMM yyyy'),
            ...doc.data()
        }
        documents.push(curDoc);
    });

    const user = {
        nome: session?.user.name,
        id: session?.id,
        vip: session?.vip,
        lastDonate: session?.lastDonate
    }

    const data = JSON.stringify(documents);

    return {
        props: {
            user,
            data
        }
    }
}