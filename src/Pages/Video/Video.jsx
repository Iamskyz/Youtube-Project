import React, { useEffect } from 'react'
import "./Video.css"
import PlayVideo from '../../Components/PlayVideo/PlayVideo.jsx'
import Recommanded from '../../Components/Recommanded/Recommanded.jsx'
import { useParams } from 'react-router-dom'



const Video = () => {

  const {videoId,categoryId} = useParams();

  return (
    <div className='play-container'>
      <PlayVideo videoId = {videoId} />
      <Recommanded categoryId={categoryId} />
    </div>
  )
}

export default Video
