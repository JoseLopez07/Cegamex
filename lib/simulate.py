#!/usr/bin/env python3

import requests
import json
import time


class ApiClient:
    refresh_token = None
    access_token = ''
    base_url = ''

    def __init__(self, creds, base_url):
        self.base_url = base_url

        res = self._api_request('/api/v1/auth/login', 'POST', json=creds)
        self.access_token = res.json().get('access_token', '')
        self.refresh_token = res.cookies

    def _api_request(self,
                     uri,
                     method,
                     json=None,
                     try_refreshing_tokens=True,
                     cookies=None):
        res = requests.request(method,
                               f'{self.base_url}{uri}',
                               json=json,
                               headers={
                                   'content-type': 'application/json',
                                   'authorization':
                                   f'Bearer {self.access_token}'
                               },
                               cookies=cookies)

        if res.status_code == 401 and try_refreshing_tokens:
            self.refresh_tokens()
            return self._api_request(uri,
                                     method,
                                     json,
                                     try_refreshing_tokens=False)

        if not res.ok:
            raise Exception(
                f'Failed request with status {res.status_code}: {res.json().get("error")}'
            )

        return res

    def refresh_tokens(self):
        print('REFRESHING TOKENS')
        res = self._api_request('/api/v1/auth/refresh',
                                'GET',
                                try_refreshing_tokens=False,
                                cookies=self.refresh_token)

        self.access_token = res.json().get('access_token', '')
        self.refresh_token = res.cookies

    def is_logged_in(self):
        return self._api_request('/api/v1/auth', 'GET')


with open('creds.json') as f:
    client = ApiClient(json.load(f), 'http://localhost:3001')

while True:
    print(client.is_logged_in())
    time.sleep(5)
