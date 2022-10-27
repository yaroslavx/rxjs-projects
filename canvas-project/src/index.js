import { EMPTY, from, fromEvent, merge } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  mergeMap,
  tap,
  catchError,
  filter,
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const url = 'https://api.github.com/search/users?q=';

const search = document.querySelector('#search');
const result = document.querySelector('#result');

const stream$ = fromEvent(search, 'input').pipe(
  map((e) => e.target.value),
  debounceTime(1000),
  distinctUntilChanged(),
  tap(() => (result.innerHTML = '')),
  filter((value) => value.trim()),
  switchMap((v) => ajax.getJSON(url + v).pipe(catchError((err) => EMPTY))),
  map((res) => res.items),
  mergeMap((items) => items)
);

stream$.subscribe((user) => {
  console.log(user);
  const html = `
  <div class="card">
            <div class="card-image">
              <img src="${user.avatar_url}"/>
              <span class="card-title">${user.login}</span>
            </div>
            <div class="card-action"></div>
            <a href="${user.html_url}" targer="_blank">Open GitHub </a>
          </div>
  `;
  result.insertAdjacentHTML('beforeend', html);
});
