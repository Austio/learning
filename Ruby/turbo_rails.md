### Sharp Edges
- Make sure that <%= turbo_frame_from :something %> is rendered in the proper place for delivered partials.  Failure to do this right can end up with a scenario where you render a partial to the client but the subscription necessary for the client to get updates is not delivered

In general Websockets are at-most once delivery by default so there is a few problems that it's use introduces

[Good Discussion on Pitfalls of Websockets](https://www.youtube.com/watch?v=TgpSs2ffJL0&list=PLbHJudTY1K0f1WgIbKCc0_M-XMraWwCmk&index=64)
 - Late to the Party: lots of messages sent before you connect
 - Missing broadcasts due to spotty connection

 - Realtime is different but not difficult 
 - Know your tools

Solutions
 - 21:23 - Have a history request after connection
   - but we have to account for messages sent while connecting or while transmitting
   - 23:27 so we have to ensure that we collect messages after connections start until we send and then deliver those 
 - bit.ly/turbo-history
 - bit.ly/turbo-presenece
 - anycable - https://anycable.io/
 - transportation: Some people block websockets -> sometimes we need long polling to swap out
 - performance: hotwire is pretty bad performance

### Wiring

Ultimately you have to wire things up properly for everything to flow.  This seems like a really complex verson of redux/vuex when using with websockets.
 - [Example](https://github.com/Austio/special-interest/pull/14/commits/27b03f3d0a2f53c8ea6647568be34870a5f38f20)

#### Frames

Frames are identified by an id on an element `turbo_frame id='foo'`
 - add a `src` to make the frame lazy loaded, after boot it will request from the src and replace the frame with the response with a matching id

#### Streams (Broadcast)

```
message = Message.find(23)

# In model
broadcast_replace_to message,
                     target: dom_id(message, :index),
                     partial: "bullhorn/contacts/messages/index",
                     locals: { message: message }

# in view

<%= turbo_stream_from message %>                     
# will be listening because message will end up with the same string so the backend will broadcast to the wired up frontend
# Will look for a dom id of dom_id(message, :index) and replace the content with the partial                    
```



#### BroadCasting Internals

```
broadcast_replace_to self

ActionCable] Broadcasting to Z2lkOi8vanVtcHN0YXJ0LWFwcC9CdWxsaG9ybjo6TWVzc2FnZS8yMw: "<turbo-stream action=\"replace\" target=\"bullhorn_message_23\"><template><!-- BEGIN app/views/bullhorn/messages/_message.html.erb --><div id=\"bullhorn_message_23\">\n  <div class=\"mb-4\">\n    <p class=\"text-sm font-medium text-gray-500\">Message</p>\n    hello\n  </div>\n  <div class=\"mb-4..
```

| Parts                                                                 | What is it?                                       |
|-----------------------------------------------------------------------|---------------------------------------------------|
| Broadcasting to Z2lkOi8vanVtcHN0YXJ0LWFwcC9CdWxsaG9ybjo6TWVzc2FnZS8yMw | the global id of self, Bullhorn::Message.find(23) |
| <turbo-stream action=\"replace\" target=\"bullhorn_message_23\">      | replace (`broadcast_replase_to`)                  |
| <turbo-stream action=\"replace\" target=\"bullhorn_message_23\">      | target dom_id(self) inferred default              |
| <template><!-- BEGIN ... --><div id=\"bullhorn_message_23\">\n        | rendered infered partial                          |

```
broadcast_replace_to :bullhorn_contact_messages,
                     target: dom_id(self, :index),
                     partial: "bullhorn/contacts/messages/index",
                     locals: { message: self }
                     
[ActionCable] Broadcasting to bullhorn_contact_messages: "<turbo-stream action=\"replace\" target=\"index_bullhorn_message_23\"><template><!-- BEGIN app/views/bullhorn/contacts/messages/_index.html.erb --><div id=\"index_bullhorn_message_23\" turbo_streams>\n  <turbo-cable-stream-source channel=\"Turbo::StreamsChannel\" signed-stream-name=\"IloybGtPaTh..                     
```

| Parts                                                                  | What is it?                      |
|------------------------------------------------------------------------|----------------------------------|
| broadcasting to bullhorn_contact_messages                              | first symbol argument            |
| <turbo-stream action=\"replace\" target=\"index_bullhorn_message_23\"> | replace (`broadcast_replase_to`) |
| <turbo-stream action=\"replace\" target=\"index_bullhorn_message_23\"> | target: value passed to target   |
| <template><!-- BEGIN ... --><div id=\"index_bullhorn_message_23\">\n   | rendered bullhorn/contacts/messages/index                |


#### Signing

The `turbo_stream_from` helper will sign and 

```
def turbo_stream_from(*streamables, **attributes)
  attributes[:channel] = attributes[:channel]&.to_s || "Turbo::StreamsChannel"
  attributes[:"signed-stream-name"] = Turbo::StreamsChannel.signed_stream_name(streamables)

  tag.turbo_cable_stream_source(**attributes)
end

# Where 
Turbo::StreamsChannel.signed_stream_name(streamables) =>
Turbo.signed_stream_verifier.generate stream_name_from(streamables) =>
    
    def stream_name_from(streamables)
      if streamables.is_a?(Array)
        streamables.map  { |streamable| stream_name_from(streamable) }.join(":")
      else
        streamables.then { |streamable| streamable.try(:to_gid_param) || streamable.to_param }
      end
    end
```
