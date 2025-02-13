import React, {useEffect} from 'react';
import styles from './index.module.css';
import DfinityIcon from "@site/static/img/dfinityIcon.svg";
import GamingIcon from "@site/static/img/gamingIcon.svg";
import SocialFiIcon from "@site/static/img/socialFiIcon.svg";
import DatabaseIcon from "@site/static/img/databaseIcon.svg";
import GrowthIcon from "@site/static/img/growthIcon.svg";
import Link from "@docusaurus/Link";
import BuildingIcon from "@site/static/img/buildingIcon.svg";
import PlayIcon from "@site/static/img/playIcon.svg";
import NftIcon from "@site/static/img/nftIcon.svg";
import SecurityIcon from "@site/static/img/securityIcon.svg";
import {motion, useAnimation} from "framer-motion";
import {useInView} from "react-intersection-observer";

const container = {
    hidden: {opacity: 0, transition: {duration: 1}},
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        }
    }
}
const item = {
    hidden: {opacity: 0, y: 30},
    show: {opacity: 1, y: 0, transition: {duration: 0.5}}
}

function Index() {
    const controls = useAnimation();
    const {ref, inView} = useInView({delay:500,threshold: 0.2});
    useEffect(() => {
        if (inView) {
            controls.start("show");
        }
    }, [controls, inView]);
    return (
        <div className={styles.Container}>
            <a id="internetComputer"/>
            <div className={styles.main}>
                <motion.div
                    ref={ref}
                    animate={controls}
                    initial="hidden"
                    variants={container}
                    className={styles.iconsContainer}>
                    <DfinityIcon className={styles.dfinityIcon}/>
                    <GamingIcon className={styles.gamingIcon}/>
                    <SocialFiIcon className={styles.socialFiIcon}/>
                    <DatabaseIcon className={styles.databaseIcon}/>
                    <GrowthIcon className={styles.growthIcon}/>
                    <motion.p variants={item} className={styles.Title}>What's the <br/> Internet Computer</motion.p>
                    <motion.p variants={item} className={styles.Body}>Imagine building scalable dapps, DeFi, websites,
                        enterprise systems and
                        open
                        internet services that are 100%
                        on-chain and can be tokenized. Guess what...it’s all possible on the
                        Internet Computer.
                    </motion.p>
                    <motion.p variants={item} className={styles.Body}>The Internet Computer is blockchain reimagined, a
                        world
                        computer built by
                        a
                        team of more than 200
                        world-renowned scientists and engineers. Powered by groundbreaking chain key
                        cryptography, the Internet
                        Computer is the world's fastest, most scalable blockchain. It unleashes the full
                        capacity of smart
                        contracts
                        enabling infinite data and computation capacity hosted entirely on chain. Developers,
                        the world is at
                        your
                        fingertips!
                    </motion.p>
                    <motion.div variants={item} className={styles.CallToAction}>
                        <svg className={styles.CallToActionIcon} viewBox="0 0 16 16" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2 13.6667H14V15H2V13.6667ZM8.66667 9.78134L12.714 5.73334L13.6567 6.67601L8 12.3333L2.34333 6.67668L3.286 5.73334L7.33333 9.78001V2.33334H8.66667V9.78134Z"
                                fill="currentColor"/>
                        </svg>
                        <Link className={styles.CallToActionLink} to="https://dfinity.org/whitepaper.pdf">
                            Get the Whitepaper
                        </Link>
                    </motion.div>
                    <BuildingIcon className={styles.buildingIcon}/>
                    <PlayIcon className={styles.playIcon}/>
                    <DfinityIcon className={styles.dfinityIcon2}/>
                    <NftIcon className={styles.nftIcon}/>
                    <SecurityIcon className={styles.securityIcon}/>
                </motion.div>
            </div>
        </div>
    )
}

export default Index;
