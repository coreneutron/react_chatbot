import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import ChatBot from 'react-simple-chatbot'
import { ThemeProvider } from 'styled-components'

import { startAction, endAction, showToast } from '../../actions/common'
import agent from '../../api'

import { useLaravelReactI18n } from 'laravel-react-i18n'
import { TRUE } from "sass";

const Chat = () => {
  const { t, tChoice } = useLaravelReactI18n();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);

  const [theme, setTheme] = useState({
    background: '#FFFFFF',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#162f5c',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#EEEEEE',
    botFontColor: '#314141',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
    botAvatar: ''
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
        setTheme({...theme, background:data[4]['value'], botFontColor:data[3]['value'], headerBgColor:data[2]['value'], botAvatar:'avatar/' + data[5]['value']})
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
          navigate('/login');
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
      }
      dispatch(endAction());
    } catch (error) {
      if (error.response.status >= 400 && error.response.status <= 500) {
        dispatch(endAction());
        dispatch(showToast('error', t(error.response.data.message)));
        if (error.response.data.message == 'Unauthorized') {
          localStorage.removeItem('token');
          dispatch(logout());
          navigate('/login');
        }
      }
    }
  }

  const handeChatBox = () => {
    setOpen(!open);
  }

  const exam_data =  [
    {
      id: 'welcome',
      message: 'Hello!',
      trigger: 'q-firstname',
    },
    {
      id: 'q-firstname',
      message: 'What is your  name?',
      trigger: 'welcome',
    },
    {
      id: 'firstname',
      user: true,
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
        { value: 4, label: 'More Information', trigger: 'q-submit' },
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
      ],
    },
    {
      id: 'end-message',
      component: '',
      asMessage: true,
      end: true,
    }
  ]

  const headerComponent = (
    <div>
      <div className="header-bar">
        <h2 className="color-white fs-15 margin-0">チャットページにようこそ</h2>
        <div className="cursor-pointer" onClick={handeChatBox}>
          <img src={'/assets/image/close.svg'} style={{height: '30px'}} />
        </div>
      </div>
    </div>
  )

  return (
    <ThemeProvider theme={theme}>
      {
        open ?
          story.length > 0 && theme.botAvatar &&
          <ChatBot
            speechSynthesis={{ enable: true, lang: 'en-US' }}
            recognitionEnable={true}
            botAvatar={theme.botAvatar}
            avatarStyle={{borderRadius:'50%'}}
            headerComponent={headerComponent}
            steps={ story }
            {...config}
            />
        :
        <div className="cursor-pointer open-chatbox" onClick={handeChatBox}>
          <img src={'/assets/image/open.svg'} style={{height: '60px'}} />
        </div>
      }
      
    </ThemeProvider>
  )
}

export default Chat;