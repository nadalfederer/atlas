import React, { useMemo } from 'react'
import { Container, SearchesList, Title } from './RecentSearches.style'
import { RecentChannelPreview, RecentVideoPreview } from './previews'
import { usePersonalData } from '@/hooks'
import { Text } from '@/shared/components'
import { useVideos, useChannels } from '@/api/hooks'
import { createLookup } from '@/utils/data'

type IdsLookup = {
  videoIds: string[]
  channelIds: string[]
}

const RecentSearches: React.FC = () => {
  const {
    state: { recentSearches },
  } = usePersonalData()

  const { videoIds, channelIds } = useMemo(() => {
    return recentSearches.reduce(
      (acc, item) => {
        const arr = item.type === 'channel' ? acc.channelIds : acc.videoIds
        arr.push(item.id)
        return acc
      },
      { videoIds: [], channelIds: [] } as IdsLookup
    )
  }, [recentSearches])

  const { videos, error: videosError } = useVideos({ id_in: videoIds }, { skip: !videoIds.length })
  const { channels, error: channelsError } = useChannels({ id_in: channelIds }, { skip: !channelIds.length })

  if (videosError) {
    throw videosError
  }

  if (channelsError) {
    throw channelsError
  }

  const videosLookup = useMemo(() => createLookup(videos || []), [videos])
  const channelsLookup = useMemo(() => createLookup(channels || []), [channels])

  return (
    <Container>
      <Title variant="hero">Recent Searches</Title>
      <SearchesList>
        {recentSearches.length ? (
          recentSearches.map((recentSearch) => {
            if (recentSearch.type === 'channel') {
              return <RecentChannelPreview key={recentSearch.id} channel={channelsLookup[recentSearch.id]} />
            } else {
              return <RecentVideoPreview key={recentSearch.id} video={videosLookup[recentSearch.id]} />
            }
          })
        ) : (
          <Text variant="body1">No recent searches yet</Text>
        )}
      </SearchesList>
    </Container>
  )
}

export default RecentSearches
