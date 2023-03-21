import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { LaravelReactI18nProvider } from 'laravel-react-i18n'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { ProSidebarProvider } from 'react-pro-sidebar';

import SideLayout from './components/SideLayout'
import Login from './pages/Login'
import Users from './pages/Users'
import ChangePassword from './pages/ChangePassword';
import Scenarios from './pages/Scenarios';
import ScenarioCreate from './pages/Scenarios/create';
import ScenarioEdit from './pages/Scenarios/edit';
import Questions from './pages/Questions';
import QuestionCreate from './pages/Questions/create';
import QuestionEdit from './pages/Questions/edit';
import Setting from './pages/Setting';
import SettingEdit from './pages/Setting/edit';
import Chat from './pages/Chat';

import Preloading from './components/Preloading'
import ToastMsg from './components/ToastMsg'

import NonProtectedRoute from './utils/NonProtectedRoute';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';

import reducers from './reducers/index'
import reportWebVitals from './reportWebVitals'
import './index.scss'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { jaJP } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' },
    },
  },
  jaJP,
);

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers)

export default function App(){
	return(
		<Router>
      <Routes>
        <Route exact path="/" element={<Chat />} />
        <Route path="/login" element={<NonProtectedRoute><Login /></NonProtectedRoute>} />
        <Route element={<SideLayout/>}>
          <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/changePassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/scenarios" element={<ProtectedRoute><Scenarios /></ProtectedRoute>} />
          <Route path="/scenario/create" element={<ProtectedRoute><ScenarioCreate /></ProtectedRoute>} />
          <Route path="/scenario/edit/:id" element={<ProtectedRoute><ScenarioEdit /></ProtectedRoute>} />
          <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
          <Route path="/question/create/:id" element={<ProtectedRoute><QuestionCreate /></ProtectedRoute>} />
          <Route path="/question/edit/:id" element={<ProtectedRoute><QuestionEdit /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
          <Route path="/setting/edit/:id" element={<ProtectedRoute><SettingEdit /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Preloading />
      <ToastMsg />
    </Router>
	);
}

const el = document.getElementById('root');

createRoot(el).render(
  <LaravelReactI18nProvider
      lang={'ja'}
      fallbackLang={'en'}
      resolve={lang => import(`../../lang/php_${lang}.json`)
      // resolve={async (lang) => {
      // const langs = import.meta.glob('../../lang/*.json')
      // const fn = langs[`/lang/php_${lang}.json`];
      
      // if (typeof fn === 'function') {
      //     return await fn();
      // }}
  }>
    {/* <React.StrictMode> */}
      <Provider store={store}>
        <ProSidebarProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ProSidebarProvider>
      </Provider>
    {/* </React.StrictMode> */}
  </LaravelReactI18nProvider>
)

reportWebVitals();