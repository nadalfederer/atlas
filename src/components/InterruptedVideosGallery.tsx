import React from 'react'
import { RouteComponentProps } from '@reach/router'

import { useQuery } from '@apollo/client'
import { usePersonalData } from '@/hooks'
import { GET_VIDEOS } from '@/api/queries'

import { ErrorFallback, VideoGallery } from '@/components'
import { useVideos } from '../api/hooks/video'

const INTERRUPTED_VIDEOS_COUNT = 16

const InterruptedVideosGallery: React.FC<RouteComponentProps> = () => {
  const {
    state: { watchedVideos },
  } = usePersonalData()

  const interruptedVideosState = watchedVideos
    .filter((video) => video.__typename === 'INTERRUPTED')
    .slice(-INTERRUPTED_VIDEOS_COUNT)
  const interruptedVideosId = interruptedVideosState.map((video) => video.id)

  const { videos, error, loading, refetch } = useVideos({
    id_in: interruptedVideosId,
  })

  const videoTimestampsMap = interruptedVideosState.reduce((acc, video) => {
    if (video.__typename === 'INTERRUPTED') {
      acc[video.id] = video.timestamp || 0
    }
    return acc
  }, {} as Record<string, number>)

  const interruptedVideos = videos?.map((video) => ({
    ...video,
    progress: (videoTimestampsMap[video.id] / video.duration) * 100,
  }))

  const hasInterruptedVideosError = error && !loading

  return (
    <>
      {!hasInterruptedVideosError ? (
        <VideoGallery title="Continue watching" loading={loading} videos={interruptedVideos} />
      ) : (
        <ErrorFallback error={error} resetError={() => refetch()} />
      )}
    </>
  )
}

export default InterruptedVideosGallery