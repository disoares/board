import React from 'react';
import Link from 'next/link';

import styles from './styles.module.scss';

export default function SuportButton() {
    return (
        <div className={styles.donateContainer}>
            <Link href='/donate' passHref>
                <a>
                    <button>Apoiar</button>
                </a>
            </Link>
        </div>
    );
}
