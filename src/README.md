# Contributing
## Get familiar with the codebase
 - aegis
    - All features of AegisNet are done here, each file is it's own feature
 - types
    - The necessary types needed for typescript
- utils
    - utility functions and code needed throughout the project
- dev-test
    - tests for each feature that should only be run in development
- tests
    - main testing is done here, use this code for making any changes to the codebase
## How to contribute
If you'd like to contribute, start by searching through the issues and pull requests to see whether someone else has raised a similar idea or question.

If you don't see your idea listed, and you think it fits into the goals of this guide, open a pull request.

**You must also increment the package version incase your PR is succesfull**
## Things to look for:
- Try to see if any type safety has been ingored - this is essential for the organization of the project. We try to ceck for this as much as possible, but sometimes we can miss some
- If you any feature requests or ideas that haven't been addressed leave a PR with a detailed label and description about it
## Setting up your environment
AegisNet is made in TypeScript, make sure you have it installed and are familar with the language.

In the **dev-test** directory, you will see many examples of using AegisNet in code, use this as an template.

Make sure you have installed and started up a working Redis server, this ensures that AegisNet can store keys and values about requests. View [this](https://redis.io/topics/quickstart) if you aren't familiar with Redis.


