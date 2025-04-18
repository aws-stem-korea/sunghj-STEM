import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CardLayout from "@site/src/components/CardLayout/CardLayout";
import styles from './style.module.css';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className={styles.landingPage}>
      <CardLayout title={siteConfig.title} description={siteConfig.tagline} />
    </div>
  );
}
