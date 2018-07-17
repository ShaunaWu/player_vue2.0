/**
 * Created by Shaun on 2018/5/17.
 */
import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  // 组件DOM ready的时候
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  // keep alive的时候
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
