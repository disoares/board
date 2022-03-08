import Link from 'next/link';
import Image from 'next/image';
import styles from './styles.module.scss';

import SignInButton from './../SignInButton';

import Logo from './../../../public/images/logo.svg';

export default function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/" passHref>
                    <Image src={Logo} alt="Logo meu board" />
                </Link>
                <nav>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/board">
                        <a>Meu board</a>
                    </Link>
                </nav>
                <SignInButton />
            </div>
        </header>
    );
}