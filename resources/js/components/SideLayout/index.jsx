import React from 'react';
import { Outlet } from 'react-router-dom';

import SideMenu from '../SideMenu';
import Header from '../Header';

import styles from './SideLayout.module.scss';

const SideLayout = () => {
  return (
    <div id="app" className={styles.app}>
      <SideMenu />
      <main className={styles.main}>
        <Header/>
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SideLayout