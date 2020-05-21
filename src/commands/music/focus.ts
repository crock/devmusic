import { Command, MessageProps, Track } from '../../@interfaces'
import ytdl from '../../ytdl'
import { durationFromSeconds } from '../../utils/duration'

import bgMusic from '../../data/background-music.json'

const focus: Command = {
  regex: /^(f|focus)/,

  async callback ( props: MessageProps ): Promise<void> {
    
    // If no pre-defined songs are found in data/background-music.json, do nothing
    if (bgMusic.length === 0) return

    // Choose random song from background-music.json
    const song = bgMusic[Math.floor(Math.random() * bgMusic.length)];

    const connection = await props.music.connect()

    if (!connection) return

    if () {
      const track: Track = {
        title: /[^\/]+((?=\#|\?)|$)/.exec(song.url)[0].replace(/(\?|\#).+/, ''),
        duration: '00:00',
        rawDuration: 0,
        description: song.title,
        author: props.author,
        url: song.url,
        thumbnail: null,
      }
  
      await props.music.addTrack(track)
      
      return
    }

    const result: string = await ytdl(['-J', '-q', '-s', '-f', 'bestaudio', url])

    const {
      title,
      description,
      duration: rawDuration,
      thumbnails,
      formats,
    }: {
      title: string

      description: string

      duration: number

      thumbnails: [{
        url: string
      }]

      formats: [{
        ext: string
        url: string
        acodec: string
        format: string
      }]
    } = JSON.parse(result)

    const isYoutube = /youtube.com|youtu.be/.test(url)

    const source = isYoutube ? song.url : formats.find(({ format }) => /audio only/.test(format)).url

    const duration = durationFromSeconds(rawDuration)

    const track: Track = {
      title,
      duration,
      rawDuration,
      description,
      author: props.author,
      url: source,
      thumbnail: thumbnails && thumbnails.reverse()[0].url,
    }

    await props.music.addTrack(track)
  }
}

export default play
