import Cookies from 'js-cookie'
import React, { createContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../App'
import { SocketContainerContext } from '../../SocketContainer/SocketContainer'
import InComingCall from '../InComingCall/InComingCall'
import MainScreen from './MainScreen'
import Profile from './Profile'

export const HomeContext= createContext()
const Home = (props) => {
  const {socketState}= useContext(SocketContainerContext)
  const {data, setChange }= useContext(AppContext)
  const [inComingCall, setInComingCall]= useState(false)
  const [senderInfo, setSenderInfo]= useState()
  const [callId, setCallId]= useState()
  useEffect(()=> {
    socketState?.emit("join_room_self", {meId: Cookies.get("uid")})
  }, [socketState])
  useEffect(()=> {
    if(data?._id) {
      socketState?.emit("joinUser", {user: data})
    }
  }, [socketState, data])
  useEffect(()=> {
    socketState?.on("signal_to_user", (dataSocket)=> {
      if(dataSocket?.user_to_call=== data?._id) {
        socketState.emit("receiver_to_call", {call_id: dataSocket.call_id})
        setInComingCall(()=> true)
        setCallId(()=> dataSocket.call_id)
        setSenderInfo(dataSocket.senderInfo)
        
      }

    })
  }, [socketState, data?._id])
  useEffect(()=> {
    socketState?.on("update_profile_user_on", (data)=> {
      setChange(prev=> !prev)
    })
}, [socketState])
  return (
    <HomeContext.Provider value={{setInComingCall, inComingCall}}>

      <div className={"ajdkasjkdjfaesas"} style={{width: '100%', }}>
        <div className={"djasjkfjkejamwlawas"} style={{width: "100%", display: "flex", alignItems: 'center'}}>
          <Profile />
          <MainScreen />
        </div>
        {
          inComingCall=== true && 
          <InComingCall {...senderInfo} setInComingCall={setInComingCall} call_id={callId} />
        }
      </div>
    </HomeContext.Provider>
  )
}

export default Home