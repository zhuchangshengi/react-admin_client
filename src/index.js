/*
* 入口js
* */
import React from 'react'
import ReactDom from 'react-dom'
import 'normalize.css'
import App from './App'
import storageUtils from "./utils/storageUtils"
import memoryUtils from "./utils/memoryUtils"
const user =storageUtils.getUser()
memoryUtils.user = user
ReactDom.render(<App/>,document.getElementById("root"))