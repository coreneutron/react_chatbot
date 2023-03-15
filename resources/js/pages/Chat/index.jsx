import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import ChatBot from 'react-simple-chatbot'
import { ThemeProvider } from 'styled-components'

const theme = {
  background: '#FFFFFF',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#162f5c',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#EEEEEE',
  botFontColor: '#314141',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
}

// all available config props
const config = {
  width: '400px',
  height: '500px',
  hideUserAvatar: true,
  placeholder: 'Type your response.',
  headerTitle: 'ChatBot',
}

const Chat = () => {


  return (
    <ThemeProvider theme={theme}>
        <ChatBot
          speechSynthesis={{ enable: true, lang: 'en-US' }}
          recognitionEnable={true}
          steps={[
            {
              id: 'welcome',
              message: 'Hello!',
              trigger: 'q-firstname',
            },
            {
              id: 'q-firstname',
              message: 'What is your  name?',
              trigger: 'firstname',
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
          ]}
          {...config}
        />
    </ThemeProvider>
  )
}

export default Chat;