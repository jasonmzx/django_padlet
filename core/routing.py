from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import padlet.routing

application = ProtocolTypeRouter({
'websocket' : AuthMiddlewareStack(
  URLRouter(
    padlet.routing.websocket_urlpatterns
  )
),
})