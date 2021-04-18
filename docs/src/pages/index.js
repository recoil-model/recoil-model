import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import useThemeContext from '@theme/hooks/useThemeContext';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

import WordMarkImaage from '../../static/img/wordmark.svg';

const features = [
];

function Feature({ feature: { imageUrl, imageUrlDark, imageAlt, title, description } }) {
  const {isDarkTheme} = useThemeContext();
  const resolvedImgUrl = useBaseUrl(isDarkTheme ? imageUrlDark : imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {resolvedImgUrl && (
        <div>
          <img className={styles.featureImage} src={resolvedImgUrl} alt={imageAlt} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout description="A model library for Recoil.">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            <WordMarkImaage width="200" />
            <div className={styles.hiddenText} aria-hidden="true">Recoil</div>
          </h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'hero__button button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/introduction/getting-started')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map(feature => (
                  <Feature
                    key={feature.imageUrl}
                    feature={feature}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
