import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/me/',
    method: 'get'
  })
}

export function getList() {
  return request({
    url: '/users/',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/users/create/',
    method: 'post',
    data
  })
}

export function patch(data) {
  return request({
    url: '/users/patch/',
    method: 'post',
    data
  })
}

export function setPassword(data) {
  return request({
    url: '/users/password-change/',
    method: 'post',
    data
  })
}
