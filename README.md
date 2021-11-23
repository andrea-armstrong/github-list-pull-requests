# Github list pull requests action

This action will return all of the pull requests of the current repository with a given state and in a certain duration.

## Inputs

## `token`

**Required** The Github Token to access the repository

## `state`

*Optional* The pull request status (open/closed/all)

Default: 'all'

## `window`

*Optional* The window of time in which pull requests were created (in hours)

Default: '24'

## Outputs

## `pullRequestNumbers`

List of all pull request numbers that match the given criteria

## Example usage

```
- name: list all closed pull requests in last 24 hours
  id: list
  uses: actions/github-list-pull-requests@v1.0
  with:
    token: ${{secrets.GITHUB_TOKEN}}
    state: 'closed'
    window: '24'
- name: output
  run: echo '${{ steps.list.outputs.pullRequestNumbers }}'
```

## Development

This repository uses `@vercel/ncc` to compile the code and modules into one file for distribution.

(Currently manual) To re-compile code, run:
```
ncc build index.js --license licenses.txt
```

Then be sure to commit everything in the `dist/*` folder for a new release.
