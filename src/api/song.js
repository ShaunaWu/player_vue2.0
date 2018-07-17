/**
 * Created by Shaun on 2018/5/16.
 */
import jsonp from 'common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'

export function getSongVKey(songmid) {
  // 对应网络地址链接https://y.qq.com/portal/player.html
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: 8264324904
  })
  // 如果用jsopncallback会报错
  const option = {
    param: 'callback',
    prefix: 'callback'
  }

  return jsonp(url, data, option)
}

export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
