<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from '../../api/singer'
  import {getSongVKey} from '../../api/song'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      // mapGetters辅助函数仅仅是将store中的getter映射到局部计算属性
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      // console.log(this.singer)
      this._getDetail()
    },
    methods: {
      _getDetail() {
        // 如果直接在详情页刷新，是拿不到歌手详细信息，可以强行让页面回退到歌手列表页面
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res.data.list)
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
            // 获取歌曲地址中的Vkey
            this.songs.forEach((item) => {
              let {mid} = item
              getSongVKey(mid).then((res) => {
                if (res.code === ERR_OK) {
                  if (res.data.items) {
                    let i = res.data.items[0]
                    item.url = `http://dl.stream.qqmusic.qq.com/${i.filename}?vkey=${i.vkey}&guid=8264324904&uin=0&fromtag=66`
                  }
                }
              })
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
