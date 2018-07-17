/**
 * Created by Shaun on 2018/5/14.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() {
  // 网站对应链接https://y.qq.com/portal/singer_list.html
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 5381
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  // 网站对应链接https://y.qq.com/n/yqq/singer/002J4UUk29y8BY.html
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1,
    singermid: singerId,
    g_tk: 5381
  })

  return jsonp(url, data, options)
}
