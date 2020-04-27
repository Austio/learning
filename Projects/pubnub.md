https://www.pubnub.com/blog/the-comprehensive-pubnub-publish-subscribe-javascript-api-tutorial/
https://www.pubnub.com/blog/build-a-fully-featured-react-chat-app/

## Pubnub notes

[https://www.pubnub.com/blog/the-comprehensive-pubnub-publish-subscribe-javascript-api-tutorial/](Tutorial this summarizes)

### Channels
Dynamic concept
 - Exist when someone subscribes to it
 - Removed when they do not
 
Can subscribe to multiple channels (comma deliminated or array)
 - when subscribing to multiple ensure that you accept the channel
 
### Subscribe
- Is good to define the callback messages so that things can be diagnosed
- Robust error handling is important
pubnub.subscribe({ channel, callback })

#### Other options
 - restore: boolean do we want to try to grab the old messages on connection
 - timetoken: where to restore from when restore is tru

#### Callback options
 - error (connectivity failure)
 - connect: to first channel
 - disconnect
 - reconnect 
 
### Presence
- Identified by the uuid of the user that is subscribing 
 
### Publish
 - a way to send messags to all subscribers on a specific channel to a channel with a message
 - all subsribers to the channel receive it
 
DO NOT send JSON.stringify with the `message` data.  Pubnub handles the JSON Serialization
IF YOU SEND A STRING it will be escaped.

 - Be sure to handle the error when you submit, you may want to republish if it is due to state of the conneciton
 
- timetoken is when the message has been published

### Presence and State

When someone joins/leaves

 - presence provides a means to know when someone joins, to do this pass the `presence` callback on a subscribe
 - called when someone join/leave/timeout/state-change
   - leave is unsubscribe
   - timeout is when someone is subscribing but they stop responding after a period of time
   - state-change (state is for conveying state of listener, mute, do not distrub, etc)
     - state examples
     - mute, do not disturb
     - city
     - name
 
Few other methods on presence
 - here_now: who is currently subscribed
 - where_now: which chennels is the given user subscribed
 - state: what is the current state meta-data for the given user
 
### State: provides some info to other users
 - Add state at the time of subscribe
 - state is user and channel speific
 - state is only propogated when user joins on the first time
 - state sent on first join event, if you relog in with same user again it will not propogate

Can provide state by adding during subscribe
Can get a state for a user/channel by querying state 
- get state: `pubnub.state({ channel, uuid, callback, error })`
- set state: `pubnub.state({ channel, uuid, callback, error, state })`

When you set state it will rewrite state for whole channel.

### History
 - can only retrieve history for a single channel
 - only returns 100 most recent publishes
 - 
 
- newer messages
 pubnub.history({ channel, callback, end })
- older messages
 pubnub.history({ channel, callback, start })
- between
 pubnub.history({ channel, callback, start, end })

Other attributes
 - `reverse: true` to look at the very first message sent. 
 - `include_token: true` include time token of 0 element
 
Lessons:
 - When someone joins, instead of using the state from that join, query the state from pubnub
 - Don't use json stringify on messages
 - time token function:  (new Date().getTime - (5*60*1000)) * 10000;
 - there are several values that pubnub will automatically cut to localstorage for messages sent/received/etc 

Questions:
 - if someone goes into timeout and then starts getting responses again what is the event?
 - error handling, how do we do this robustly for a subscription
 
