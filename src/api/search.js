/**
 * Created by Shaun on 2018/5/18.
 */
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey() {
  // 网站对应链接https://m.y.qq.com/#search
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
  // 网站对应链接https://m.y.qq.com/#search
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const data = Object.assign({}, commonParams, {
    needNewCode: 1,
    platform: 'h5',
    w: query,
    catZhida: zhida ? 1 : 0,
    p: page,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uin: 0
  })

  return jsonp(url, data, options)
}
