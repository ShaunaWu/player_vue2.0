<template>
  <scroll class="listView"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll">
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="(item,index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList"
            class="item"
            :key="index"
            :class="{'current':currentIndex === index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import {getData} from '../../common/js/dom'
  import Loading from '../../base/loading/loading.vue'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    created() {
      // 为什么不放到data里面？data和props中的数据都被观测，此处并不需要被观测
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      // probeType默认是1，只能监听到点击滑动，鼠标放开后的滑动检测不到
      this.probeType = 3
    },
    props: {
      data: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        // console.log(e.target)e.target是点击的元素
        let anchorIndex = getData(e.target, 'index')
        // 获取触碰的位置
        // console.log(e.touches)
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // |0向下取整
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // this.touch.anchorIndex是字符串型，不用parseInt的话有问题
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      _scrollTo(index) {
        // 点击'热'上面时，会出现高亮部分消失。通过检测当index为null时，不做任何反应
        if (!index && index !== 0) {
          return
        }
        // 由于滑动时pageY在增大，出现边界问题，滑到最上面时,'z'变高亮
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 由于高亮索引是滑动时派发出来的事件。非滑动条件下，点击设置scrollY，才会出现对应位置高亮情况。
        this.scrollY = -this.listHeight[index]
        // 0是滚动动画的时间
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 点击时间派发出去，供给子路由使用
      selectItem(item) {
        this.$emit('select', item)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY > 0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动，因为多一个，所以到-1，i < listHeight.length - 1
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          // newY为负数
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        // 禁止每次都进行DOM操作，不需要的时候就不用
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listView
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 50px
          height 50px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family Helvetica
      .item
        padding 2px
        line-height 1
        color $color-text-l
        font-size $font-size-small
        &.current
          color $color-theme

    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
