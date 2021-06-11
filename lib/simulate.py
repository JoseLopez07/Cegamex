#!/usr/bin/env python3

import requests
import json
import time
import pandas as pd
from datetime import datetime
import random

# post delay in seconds
POST_DELAY = 120

# maximum delta value for end date, in seconds
MAX_END = 172800  # == 2 days

# range of registered users
USER_RANGE = 1


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
                     cookies=None) -> requests.Response:
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

    def is_logged_in(self) -> requests.Response:
        return self._api_request('/api/v1/auth', 'GET')

    def get_latest_issue(self) -> requests.Response:
        return self._api_request(
            '/api/v1/jira/issues?limit=1&orderBy=issueId&orderAsc=0', 'GET')

    def get_latest_subtask(self) -> requests.Response:
        return self._api_request(
            '/api/v1/jira/subtasks?limit=1&orderBy=subtaskId&orderAsc=0',
            'GET')

    def insert_issue(self, issue_data) -> requests.Response:
        return self._api_request('/api/v1/jira/issues', 'POST', issue_data)

    def insert_subtask(self, subtask_data) -> requests.Response:
        return self._api_request('/api/v1/jira/subtasks', 'POST', subtask_data)


with open('creds.json') as f:
    client = ApiClient(json.load(f), 'http://localhost:3001')

# read smaple data
issues = pd.read_csv('issues.csv', sep=';', dtype=object)
issues.columns = [
    'id', 'type', 'name', 'creatorEId', 'leadEId', 'reporterEId', 'asigneeId',
    'state', 'startDate', 'endDate'
]
subtasks = pd.read_csv('subtasks.csv', sep=';', dtype=object)
subtasks.columns = [
    'id', 'issueId', 'name', 'creatorEId', 'leadEId', 'reporterEId', 'state',
    'startDate', 'endDate'
]

current_issue = client.get_latest_issue().json()[0]
current_issue['id'] = current_issue['issueId']
current_subtask = client.get_latest_subtask().json()[0]
current_subtask['id'] = current_subtask['subtaskId']

while True:
    now = int(datetime.utcnow().timestamp() * 1000)
    if random.choice((False, True)):
        issue_then = None
    else:
        issue_then = now + random.randint(1, MAX_END * 1000)
    if random.choice((False, True)):
        subtask_then = None
    else:
        subtask_then = now + random.randint(0, MAX_END * 1000)

    new_issue = {
        col: issues[col].sample().values[0]
        for col in ('type', 'name', 'creatorEId', 'leadEId', 'reporterEId')
    }
    new_issue['state'] = random.choice(('Closed', 'Done'))
    new_issue['priority'] = random.choice(('Normal', 'Medium', 'High'))
    new_issue.update({
        'id': current_issue['id'] + 1,
        'startDate': now,
        'endDate': issue_then
    })
    new_issue['asigneeId'] = random.randint(1, USER_RANGE)

    print('ISSUE:', client.insert_issue(new_issue))
    current_issue = new_issue

    new_subtask = {
        col: subtasks[col].sample().values[0]
        for col in ('issueId', 'name', 'creatorEId', 'leadEId', 'reporterEId')
    }
    new_subtask['state'] = random.choice(('Closed', 'Done'))
    new_subtask.update({
        'id': current_subtask['id'] + 1,
        'startDate': now,
        'endDate': subtask_then
    })

    # print('SUBTASK:', client.insert_subtask(new_subtask))
    current_subtask = new_subtask

    time.sleep(POST_DELAY)
