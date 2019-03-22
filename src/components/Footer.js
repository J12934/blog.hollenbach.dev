import React from 'react';

import { rhythm } from '../utils/typography';

class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}
      >
        <div style={{ float: 'right' }}>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            rss
          </a>
        </div>
        <a
          href="https://mobile.twitter.com/j12934"
          target="_blank"
          rel="noopener noreferrer"
        >
          twitter
        </a>{' '}
        &bull;{' '}
        <a
          href="https://github.com/j12934"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
        <div style={{ marginTop: 16 }}>
          Theme forked from Dan Abramov's{' '}
          <a href="https://overreacted.io/">overreacted.io</a>
        </div>
      </footer>
    );
  }
}

export default Footer;
