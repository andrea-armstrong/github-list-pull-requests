const core = require('@actions/core');
const github = require('@actions/github');

function listPullRequests(token, repoOwner, repo, state) {
  const octokit = github.getOctokit(token);
  var pullRequests = octokit.rest.pulls.list({
    owner: repoOwner,
    repo: repo,
    state: state,
    sort: 'created',
    direction: 'desc',
    per_page: 100,
  });
  return pullRequests;
}

function filterDate(pr, targetDate) {
  var createdAt = Date.parse(pr.created_at)
  console.log("Reviewing PR: " + pr.number + " with created date: " + pr.created_at)
  if (createdAt > targetDate) {
    return true;
  }
  return false;
}

function outputNumbers(list) {
  let numberList = list.map(p => p.number);
  core.setOutput('pullRequestNumbers', numberList);
}


try {
  const token = core.getInput('token');
  const repoOwner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const state = core.getInput('state');
  let filterSec = parseInt(core.getInput('window')) * 360
  let targetDate = new Date(Date.now() - filterSec);
  
  let prom = listPullRequests(token, repoOwner, repo, state);
  prom.then(function (list) {
    let filtered = list.data.filter(function(pr) { return filterDate(pr, targetDate); });
    outputNumbers(filtered);
  });
} catch (error) {
  core.setFailed(error.message);
}
