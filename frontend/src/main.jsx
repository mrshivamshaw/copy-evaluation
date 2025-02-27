import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux'
import {configureStore} from '@reduxjs/toolkit'
import rootReducer from './reducer/index.js'
import { Analytics } from '@vercel/analytics/react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const store = configureStore({
  reducer: rootReducer
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <Provider store={store}>
    <BrowserRouter>
        <App />
      </BrowserRouter>
  </Provider>
  <Analytics/>
  </>
 
)

export default store