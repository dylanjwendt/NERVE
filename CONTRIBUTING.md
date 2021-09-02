## Contributing

Here are the basic steps to submit a pull request.

1. Make sure your current task is known and updated on the project board.

1. Create a new branch and switch to it with `git checkout -b branch-name-iss#` where `iss#` is the issue number.

1. Write code to implement your changes.

1. Write and run unit tests and make sure everything passes.

1. Run linters and fix any linting errors they brings up.
    * You can do this for all subprojects by running `npm run -s lint` or `npm run -s lint:fix` from the top level.
    * You can also do this for an individual subproject by running the same commands in that subproject's directory.

1. Push to your branch and submit a pull request. Include the issue number (ex. `Resolves #1`) in the PR description.

1. Have another team member due a quick code review. If it checks out then we can merge it.

1. In case of a major feature or change, please at least run the app and do some manual testing.
