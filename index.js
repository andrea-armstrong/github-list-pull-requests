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
  var createdAt =new Date(pr.created_at)
  console.log("Reviewing PR: " + pr.number + " with created date: " + createdAt + "against target date: " + targetDate)
  if (createdAt > targetDate) {
    console.log("PR within time frame: " + pr.number)
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
  let filterMs = parseInt(core.getInput('window')) * 3600000 // convert to milliseconds
  let targetDate = new Date(Date.now() - filterMs);
  
  let prom = listPullRequests(token, repoOwner, repo, state);
  prom.then(function (list) {
    let filtered = list.data.filter(function(pr) { return filterDate(pr, targetDate); });
    outputNumbers(filtered);
  });
} catch (error) {
  core.setFailed(error.message);
}
