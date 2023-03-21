import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import ChatBot from 'react-simple-chatbot'
import { ThemeProvider } from 'styled-components'

import { startAction, endAction, showToast } from '../../actions/common'
import agent from '../../api'

import { useLaravelReactI18n } from 'laravel-react-i18n'

const Chat = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [theme, setTheme] = useState({
    background: '#FFFFFF',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#162f5c',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#EEEEEE',
    botFontColor: '#314141',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a'
  });
  
  // all available config props
  const [config, setConfig] = useState({
    width: '400px',
    height: '500px',
    hideUserAvatar: true,
    placeholder: 'Type your response.',
    headerTitle: 'ChatBot',
  });

  const [story, setStory] = useState([]);

  useEffect(() => {
    getSettings();
    getStory();
  }, [])

  const getSettings = async () => {
    dispatch(startAction())
    try {
      const res = await agent.common.getSettings();
      if (res.data.success) {
        let data = res.data.data;
        setTheme({...theme, background:data[4]['value'], botFontColor:data[3]['value'], headerBgColor:data[2]['value'] })
        setConfig({...config, headerTitle:data[0]['value']})
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', t(error.response.data.message)));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/');
        }
      }
    }
  }

  const getStory = async () => {
    dispatch(startAction())
    try {
      const res = await agent.common.getStory();
      if (res.data.success) {
        setStory(res.data.data)
        console.log(res.data.data);
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', t(error.response.data.message)));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/');
        }
      }
    }
  }

  const exam_data =  [
    {
      id: 'welcome',
      message: 'Hello!',
      trigger: 'q-firstname',
    },
    /* Paste */
    {
      id: 'q-firstname',
      message: 'What is your  name?',
      trigger: 'firstname',
    },
    {
      id: 'firstname',
      user: true,
      validator: (value) => {
        if (/^[A-Za-z]+$/.test(value)) {
          return true
        } else {
          return 'Please input alphabet characters only.'
        }
      },
      trigger: 'rmcbot',
    },
    {
      id: 'rmcbot',
      message:
        'Hi,{previousValue} I am RMC Bot! What can I do for you?',
      trigger: 'qtype',
    },
    {
      id: 'qtype',
      options: [
        { value: 1, label: 'Property Tax ?', trigger: '4' },
        { value: 2, label: ' Professional Tax ?', trigger: '3' },
        { value: 3, label: 'Election Department', trigger: '5' },
        { value: 4, label: 'More Information', trigger: '6' },
      ],
    },
    {
      id: '3',
      message:
        'Profession tax is the tax levied and collected by the state governments in India.',
      trigger: 'qtype',
    },
    {
      id: '4',
      message:
        'A property tax or millage rate is an ad valorem tax on the value of a property.',
      trigger: 'qtype',
    },
    {
      id: '5',
      message:
        'An election is a way people can choose their candidate or their preferences in a representative democracy or other form of government',
      trigger: 'qtype',
    },
    {
      id: '6',
      component: '',
      trigger: 'q-submit',
    },
    {
      id: 'q-submit',
      message: 'Do you have any other questions !?',
      trigger: 'submit',
    },
    {
      id: 'submit',
      options: [
        { value: 'y', label: 'Yes', trigger: 'no-submit' },
        { value: 'n', label: 'No', trigger: 'end-message' },
      ],
    },
    {
      id: 'no-submit',
      options: [
        { value: 1, label: 'Property Tax ?', trigger: '4' },
        { value: 2, label: ' Professional Tax ?', trigger: '3' },
        { value: 3, label: 'Election Department', trigger: '5' },
        { value: 4, label: 'More Information', trigger: '6' },
      ],
    },
    {
      id: 'end-message',
      component: '',
      asMessage: true,
      end: true,
    },
  ]

  return (
    <ThemeProvider theme={theme}>
    {
      story.length > 0 &&
        <ChatBot
        speechSynthesis={{ enable: true, lang: 'en-US' }}
        recognitionEnable={true}
        steps={story}
        {...config}
        />
    }
    </ThemeProvider>
  )
}

export default Chat;