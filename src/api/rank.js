/**
 * Created by Shaun on 2018/5/17.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getTopList() {
  // 网站对应链接https://m.y.qq.com/#toplist
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5',
    uin: 0
  })

  return jsonp(url, data, options)
}

export function getMusicList(topid) {
  // 网站对应链接https://y.qq.com/w/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=4&type=top
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5',
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid
  })

  return jsonp(url, data, options)
}
