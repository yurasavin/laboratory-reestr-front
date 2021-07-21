import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/researches/',
    method: 'get',
    params
  })
}

export function getNextList(url) {
  return request({
    url: url,
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/researches/create/',
    method: 'post',
    data
  })
}

export function patch(data) {
  return request({
    url: '/researches/patch/',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: '/researches/remove/',
    method: 'post',
    data
  })
}

export function export_as_xlsx(id) {
  return request({
    url: `/researches/${id}/export/`,
    method: 'get',
    responseType: 'blob'
  })
}

export function stats(id) {
  return request({
    url: '/researches/stats/',
    method: 'get'
  })
}
