# Github Issues -Trello integration using [Auth0 webtask](https://webtask.io)

This a simple Auth0 Webtask which recieves issues generated in a github repo and creates a corresponding card in a given trello list. The card contains the issue title as title and the link to the issue as content.

As always, the first step is to clone the project

```sh
git clone https://github.com/webocs/webtask-githubTrello.git
```

## Setting up

### Getting keys, tokens and IDs
The second step to use the webtask is to get all of keys that the project requires, to make it work we must get:

 - A Github secret
 - A Trello API key
 - A Trello Token
 - A Trello idList

All of the keys must be placed in the file called secrets-file or added in the webtask editor manually.

#### Github secret
To make sure nobody's sending Unauthorized requests to our webtask we must configure a secret in our github webhook. There are several ways to create a secret. For example, github suggests using:
```bash
ruby -rsecurerandom -e 'puts SecureRandom.hex(20)
```

You can use that method or use an online secret generator like [Symfony](http://nux.net/secret) or [RandomKeyGenerator](https://randomkeygen.).

#### Trello API key
If you don't have one already, create a Trello account. Then, go to [https://trello.com/app-key] and copy the Developer API Key. Put that key in the secrets-file

### Trello token
As stated by trello [here](https://trello.com/app-key):
>Most developers will need to ask each user to authorize your application. If you are looking to build an application for yourself, or are doing local testing, you can manually generate a Token.

Follow the [instructions](https://trello.com/app-key)  to authorize your app and get trello token. If you get into trouble you can call the login endpoint using postman and get the token "Manually".

### Trello idList

Sadly there is no direct way to do this, so this is the closes thing we have to a direct way to get the idList. In trello, create a board or open the board where you want your cards to go to. Then create a list, the trello board with the list should look like this:

![N|Solid](https://i.imgur.com/VNQEBI3.png)]

Then click on add a card, and a single card with any name. After that, click on the card and a card editor should popup. You will see something like this:

![N|Solid](https://i.imgur.com/hgNXJ1K.png)

While looking at that screen, the url will show something like this:

```
https://trello.com/c/Xs2EaTtG/2-i-just-added-this-card
```

Change the URL to:

```
https://trello.com/c/Xs2EaTtG/2-i-just-added-this-card.json
```

And you'll see a huge json containing a specific property called idList

![N|Solid](https://i.imgur.com/zRjDICw.png)

Copy that value and paste it to the secrets-file

## How to run

Now that you have configured your secrets-file, it's time to create the webtask. First you need to install webtask cli:

```sh
npm install wt-cli -g
```
Then you must initalize it with your wt account
```sh
wt init yourwebtaskMail@somedomain
```
Te CLI will pop a message asking for a code, check your email as it should be there. Put the code and hit enter

Create the webtask
```sh
wt create --name someName --secrets-file secrets-file githubTrello.js
```
Aftter creating the webtask, the CLI will popup a link. That's your webtask's public URL. Copy it, you'll need it for the next step.

### Create a webhook to test it!

Go to your favorite github repo (that you own, of course), and hit Settings. Then, on the left go to Webhooks. Once in the webhooks menu, hit Add webhook. You'll be presented with a window that must be filled as follow:

![N|Solid](https://i.imgur.com/ZkV1uEu.png)

Once eveything is setted up, create an issue and a card shoud appear in the list you've configured.

## Plans for the future

- Support for other events
- Better looking cards
- Archive or move closed issues
