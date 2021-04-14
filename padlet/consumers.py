from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Padlet
from asgiref.sync import sync_to_async
import json

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'padlet_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'init_connect',
               # 'prev_logs': f"You've connected to chatroom{self.room_group_name}",
            }
        )

    async def init_connect(self, event):
       # prev_logs = event['prev_logs']
        connect_type = event['type']

        #Initial connect with the database aswell:
        try:
            padlet_db = await sync_to_async(Padlet.objects.get, thread_sensitive=True)(pk = self.room_group_name)
            prev_logs = padlet_db.p_content
        except:
            print(f"PadletDB: {self.room_group_name} not found, creating one for it.")
            newPadlet = Padlet(p_id=self.room_group_name , p_content='[]')
            await sync_to_async(newPadlet.save)()

        await self.send(text_data=json.dumps(
            {
                'prev_logs':prev_logs,
                'type':connect_type,
            }
        ))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        #Loads Data recieved
        text_data_json = json.loads(text_data)

        #If data being sent to is update a User's panel:
        if text_data_json['receive_type'] == "padlet_update":
            print("Padlet Update received!")
            new_padlet_content = [text_data_json['user_id'] , text_data_json['client_panel_content'] ]

            padlet_db = await sync_to_async(Padlet.objects.get, thread_sensitive=True)(pk=self.room_group_name)
            current_content = json.loads(padlet_db.p_content)
            current_content[text_data_json['user_id']][0] = text_data_json['client_panel_content']
            #Saving changes
            padlet_db.p_content = json.dumps(current_content)
            await sync_to_async(padlet_db.save)()

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'padlet_update',
                    'content':new_padlet_content[1],
                    'author':new_padlet_content[0]

                }
            )

            print(new_padlet_content)

    async def chatroom_message(self,event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message':message,
            'type':'chat_message',
        }))

    async def padlet_update(self,event):
        #This will be sent to the frontend
        updated_pad = [event['author'] , event['content']]

        await self.send(text_data=json.dumps({
            'message': updated_pad,
            'type': 'padlet_update',
        }))

    pass